const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Serve static files from public directory
app.use(express.static(publicDir));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api-docs.html'));
});

app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  console.log('Request Body:', req.body);
  const { folderName, overwrite } = req.body;
  const file = req.file;

  if (!folderName || !file) {
    return res.status(400).json({ error: 'Folder name and file are required' });
  }

  const targetPath = path.join(publicDir, folderName);

  // Check if folder already exists
  if (fs.existsSync(targetPath)) {
    if (overwrite === 'true') {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.status(409).json({ error: 'Folder already exists. Check "Overwrite" to replace it.' });
    }
  }

  try {
    // Create target directory
    fs.mkdirSync(targetPath, { recursive: true });

    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed' || file.originalname.endsWith('.zip')) {
      // Extract zip file
      try {
        const zip = new AdmZip(file.path);
        zip.extractAllTo(targetPath, true);

        // Recursive function to flatten single directory structure
        const flatten = (currentPath) => {
          const items = fs.readdirSync(currentPath);
          if (items.length === 1) {
            const firstItemPath = path.join(currentPath, items[0]);
            if (fs.statSync(firstItemPath).isDirectory()) {
              // Move contents of the subdirectory to the current path
              const subItems = fs.readdirSync(firstItemPath);
              subItems.forEach(item => {
                const srcPath = path.join(firstItemPath, item);
                const destPath = path.join(currentPath, item);
                fs.renameSync(srcPath, destPath);
              });
              // Remove the now empty subdirectory
              fs.rmdirSync(firstItemPath);
              // Recursively check again in case of multiple nested single directories
              flatten(currentPath);
            }
          }
        };

        flatten(targetPath);
      } catch (zipError) {
        console.error('Zip extraction failed:', zipError);
        throw new Error('Invalid or corrupted ZIP file');
      }
    } else {
      // Handle single file upload
      let targetFileName = file.originalname;
      // If it's an HTML file, rename to index.html for convenience
      if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
        targetFileName = 'index.html';
      }

      const targetFile = path.join(targetPath, targetFileName);
      fs.copyFileSync(file.path, targetFile);
    }

    // Clean up uploaded file
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(200).json({ message: 'File uploaded and deployed successfully', path: `/public/${folderName}` });
  } catch (error) {
    console.error('Extraction/Upload error:', error);
    // Clean up on error
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    // Remove created folder if it was just created and failed
    // fs.rmSync(targetPath, { recursive: true, force: true }); 
    res.status(500).json({ error: 'Failed to process file' });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete('/delete/:folderName', (req, res) => {
  const { folderName } = req.params;
  const targetPath = path.join(publicDir, folderName);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'Site not found' });
  }

  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
    res.status(200).json({ message: `Site '${folderName}' deleted successfully` });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

// Authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Helper to read/write users
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Middleware to authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Profile
app.get('/profile', authenticateToken, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ id: user.id, name: user.name, email: user.email });
});

// Logout (Client-side usually handles this by deleting token, but we can have a dummy endpoint)
app.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});
