const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'bangsal.sql');
const jsonPath = path.join(process.cwd(), 'src', 'data', 'bangsal.json');
const jsPath = path.join(process.cwd(), 'src', 'data', 'wardNames.js');

const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Parse INSERT statements: INSERT INTO `bangsal` VALUES ('code', 'name', 'status');
const regex = /INSERT INTO `bangsal` VALUES \('([^']*)', '([^']*)', '([^']*)'\);/g;
let match;
const wards = [];
const wardMap = {};

while ((match = regex.exec(sqlContent)) !== null) {
    const code = match[1];
    const name = match[2].trim();
    const status = match[3];

    wards.push({
        kd_bangsal: code,
        nm_bangsal: name,
        status: status
    });

    wardMap[code] = name;
}

// Ensure dir exists
const dir = path.dirname(jsonPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Write JSON file
fs.writeFileSync(jsonPath, JSON.stringify(wards, null, 2));
console.log(`Converted ${wards.length} wards to ${jsonPath}`);

// Generate JS mapping file
const jsContent = `// Auto-generated from bangsal.sql
// Mapping kode bangsal ke nama lengkap

const WARD_NAMES = ${JSON.stringify(wardMap, null, 4)};

export function getWardName(code) {
    return WARD_NAMES[code] || code;
}

export default WARD_NAMES;
`;

fs.writeFileSync(jsPath, jsContent);
console.log(`Generated ward names mapping to ${jsPath}`);
