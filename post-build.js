const fs = require('fs');
const path = require('path');

const fontsDir = path.join(
  __dirname,
  'dist/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts'
);

if (fs.existsSync(fontsDir)) {
  const files = fs.readdirSync(fontsDir);
  let copiedCount = 0;
  
  files.forEach(file => {
    // looking for files like Ionicons.b4eb097d35f44ed943676fd56f6bdc51.ttf
    if (file.endsWith('.ttf') && file.split('.').length === 3) {
      const unhashedName = file.split('.')[0] + '.ttf';
      fs.copyFileSync(
        path.join(fontsDir, file),
        path.join(fontsDir, unhashedName)
      );
      copiedCount++;
      console.log(`✅ Copied hashed font ${file} -> ${unhashedName}`);
    }
  });
  console.log(`\n🎉 Post-build font fix complete: Copied ${copiedCount} fonts.`);
} else {
  console.warn('⚠️ Font directory not found. Assuming no vector icons were bundled.');
}
