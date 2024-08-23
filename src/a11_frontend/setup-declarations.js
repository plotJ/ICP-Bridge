const fs = require('fs');
const path = require('path');

const sourceFile = '/Users/josh/Desktop/GPT Pilot/gpt-pilot/workspace/a11/src/declarations/a11_backend/a11_backend.did.js';
const destinationDir = path.resolve(__dirname, 'src', 'declarations', 'a11_backend');
const destinationFile = path.join(destinationDir, 'a11_backend.did.js');

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

fs.copyFileSync(sourceFile, destinationFile);
console.log('Declarations file copied successfully to:', destinationFile);