const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function createDummyUser() {
    const USERS_FILE = path.join(__dirname, 'data', 'users.json');

    // Hash the password
    const hashedPassword = await bcrypt.hash('test', 10);

    // Create dummy user
    const dummyUser = {
        id: uuidv4(),
        email: 'test@test.com',
        password: hashedPassword,
        name: 'test',
        createdAt: new Date().toISOString(),
        projects: []
    };

    // Read existing users
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        users = JSON.parse(data);
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === 'test@test.com');
    if (existingUser) {
        console.log('Dummy user already exists!');
        return;
    }

    // Add dummy user
    users.push(dummyUser);

    // Write back to file
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log('Dummy user created successfully!');
    console.log('Email: test@test.com');
    console.log('Password: test');
}

createDummyUser().catch(console.error);
