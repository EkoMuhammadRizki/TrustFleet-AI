
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const logoNavyPath = path.join(__dirname, 'public', 'logo', 'TrustFleetAILogoNavy.png');
const logoWhitePath = path.join(__dirname, 'public', 'logo', 'TrustFleetAILogoWhite.png');

console.log('Checking TrustFleetAILogoNavy.png...');
fs.createReadStream(logoNavyPath)
  .pipe(new PNG())
  .on('parsed', function () {
    console.log(`  Dimensions: ${this.width}x${this.height}`);
    console.log(`  Aspect ratio: ${(this.width / this.height).toFixed(2)}:1`);
  });

console.log('\nChecking TrustFleetAILogoWhite.png...');
fs.createReadStream(logoWhitePath)
  .pipe(new PNG())
  .on('parsed', function () {
    console.log(`  Dimensions: ${this.width}x${this.height}`);
    console.log(`  Aspect ratio: ${(this.width / this.height).toFixed(2)}:1`);
  });
