const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'kamar.sql');
const jsonPath = path.join(process.cwd(), 'src', 'data', 'rooms.json');

const sqlContent = fs.readFileSync(sqlPath, 'utf8');

const regex = /INSERT INTO `kamar` VALUES \('([^']*)', '([^']*)', ([0-9]+), '([^']*)', '([^']*)', '([^']*)'\);/g;
let match;
const rooms = [];

while ((match = regex.exec(sqlContent)) !== null) {
    rooms.push({
        kd_kamar: match[1],
        kd_bangsal: match[2],
        trf_kamar: parseInt(match[3]),
        status: match[4],
        kelas: match[5],
        statusdata: match[6]
    });
}

// Ensure dir exists
const dir = path.dirname(jsonPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(jsonPath, JSON.stringify(rooms, null, 2));
console.log(`Converted ${rooms.length} rooms to ${jsonPath}`);
