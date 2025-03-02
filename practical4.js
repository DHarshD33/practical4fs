const fs = require('fs');
const path = require('path');


const fileCategories = {
    Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    Documents: ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.xls'],
    Videos: ['.mp4', '.avi', '.mov', '.mkv'],
    Others: []
};

function organizeFiles(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        console.log("Directory does not exist!");
        return;
    }

    const files = fs.readdirSync(directoryPath);
    let logData = "File Organization Summary:\n";

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.lstatSync(filePath).isFile()) {
            const fileExt = path.extname(file).toLowerCase();
            let category = "Others";

            for (const [folder, extensions] of Object.entries(fileCategories)) {
                if (extensions.includes(fileExt)) {
                    category = folder;
                    break;
                }
            }

            const categoryPath = path.join(directoryPath, category);
            if (!fs.existsSync(categoryPath)) {
                fs.mkdirSync(categoryPath);
            }

            const newFilePath = path.join(categoryPath, file);
            fs.renameSync(filePath, newFilePath);
            logData += `Moved: ${file} → ${category}/\n`;
        }
    });

 
    const logFilePath = path.join(directoryPath, "summary.txt");
    fs.writeFileSync(logFilePath, logData);
    console.log("Files have been organized successfully!");
}


const userPath = process.argv[2];
if (userPath) {
    organizeFiles(userPath);
} else {
    console.log("Please provide a directory path!");
}
