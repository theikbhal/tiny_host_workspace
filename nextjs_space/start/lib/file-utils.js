const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const TEMP_DIR = path.join(UPLOADS_DIR, 'temp');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export const processUploadedFile = async (file, domain) => {
    const siteDir = path.join(UPLOADS_DIR, domain);
    if (!fs.existsSync(siteDir)) fs.mkdirSync(siteDir, { recursive: true });

    const fileExt = path.extname(file.name).toLowerCase();

    // Convert File object to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (fileExt === '.zip') {
        // Save zip temporarily
        const tempZipPath = path.join(TEMP_DIR, `${Date.now()}-${file.name}`);
        fs.writeFileSync(tempZipPath, buffer);

        try {
            const zip = new AdmZip(tempZipPath);
            const tempExtractDir = path.join(TEMP_DIR, `extract-${Date.now()}`);

            // Extract to temporary directory
            zip.extractAllTo(tempExtractDir, true);

            // Check contents
            const extractedItems = fs.readdirSync(tempExtractDir);

            if (extractedItems.length === 1) {
                const singleItem = path.join(tempExtractDir, extractedItems[0]);
                const stats = fs.statSync(singleItem);

                if (stats.isDirectory()) {
                    // Move contents of the single folder
                    const folderContents = fs.readdirSync(singleItem);
                    folderContents.forEach(item => {
                        const srcPath = path.join(singleItem, item);
                        const destPath = path.join(siteDir, item);
                        // Remove dest if exists (overwrite)
                        if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true, force: true });
                        fs.renameSync(srcPath, destPath);
                    });
                } else {
                    // Move single file
                    const destPath = path.join(siteDir, extractedItems[0]);
                    if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true, force: true });
                    fs.renameSync(singleItem, destPath);
                }
            } else {
                // Move all items
                extractedItems.forEach(item => {
                    const srcPath = path.join(tempExtractDir, item);
                    const destPath = path.join(siteDir, item);
                    if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true, force: true });
                    fs.renameSync(srcPath, destPath);
                });
            }

            // Cleanup
            if (fs.existsSync(tempExtractDir)) fs.rmSync(tempExtractDir, { recursive: true, force: true });
            fs.unlinkSync(tempZipPath);

            return { success: true, type: 'zip', extracted: true };
        } catch (error) {
            if (fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
            return { success: false, error: 'Failed to extract ZIP: ' + error.message };
        }
    } else if (fileExt === '.html' || fileExt === '.htm') {
        const targetPath = path.join(siteDir, 'index.html');
        fs.writeFileSync(targetPath, buffer);
        return { success: true, type: 'html', file: targetPath };
    } else {
        const targetPath = path.join(siteDir, file.name);
        fs.writeFileSync(targetPath, buffer);
        return { success: true, type: 'other', file: targetPath };
    }
};
