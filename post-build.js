const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const oldModulesDir = path.join(distDir, 'assets/node_modules');
const newModulesDir = path.join(distDir, 'assets/vendor_modules');

// 1. Rename the blocked 'node_modules' folder if it exists
if (fs.existsSync(oldModulesDir)) {
  // If rebuilding locally, remove the old vendor_modules if it exists
  if (fs.existsSync(newModulesDir)) {
    fs.rmSync(newModulesDir, { recursive: true, force: true });
  }
  fs.renameSync(oldModulesDir, newModulesDir);
  console.log('✅ Renamed assets/node_modules to assets/vendor_modules');
}

// 2. Fix the unhashed font names inside the new directory
const fontsDir = path.join(
  distDir,
  'assets/vendor_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts'
);

if (fs.existsSync(fontsDir)) {
  const files = fs.readdirSync(fontsDir);
  let count = 0;
  files.forEach(file => {
    if (file.endsWith('.ttf') && file.split('.').length === 3) {
      const unhashedName = file.split('.')[0] + '.ttf';
      fs.copyFileSync(path.join(fontsDir, file), path.join(fontsDir, unhashedName));
      count++;
    }
  });
  console.log(`✅ Copied ${count} unhashed font files.`);
}

// 3. Search and replace 'assets/node_modules' with 'assets/vendor_modules' in all HTML, CSS, JS
function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInFiles(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html') || file.endsWith('.json')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // RegExp to catch path usages
      if (content.includes('assets/node_modules')) {
        content = content.replace(/assets\/node_modules/g, 'assets/vendor_modules');
        content = content.replace(/assets%2Fnode_modules/g, 'assets%2Fvendor_modules'); // URL encoded just in case
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }
}

if (fs.existsSync(distDir)) {
  replaceInFiles(distDir);
  console.log('✅ Updated all references from node_modules to vendor_modules.');
}

console.log('🎉 Post-build fix complete! Ready for Cloudflare Pages.');
