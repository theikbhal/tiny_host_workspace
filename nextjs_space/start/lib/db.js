const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read JSON file
const readJsonFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
};

// Helper to write JSON file
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        return false;
    }
};

// Users
export const readUsers = () => readJsonFile(USERS_FILE);
export const writeUsers = (users) => writeJsonFile(USERS_FILE, users);
export const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};
export const findUserById = (id) => {
    const users = readUsers();
    return users.find(u => u.id === id);
};

// Sites
export const readSites = () => readJsonFile(SITES_FILE);
export const writeSites = (sites) => writeJsonFile(SITES_FILE, sites);
export const findSitesByUserId = (userId) => {
    const sites = readSites();
    return sites.filter(s => s.userId === userId);
};
export const findSiteByDomain = (domain) => {
    const sites = readSites();
    return sites.find(s => s.domain === domain);
};
