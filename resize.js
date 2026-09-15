const Jimp = require("jimp");
const path = require("path");

async function resizeIcons() {
  try {
    const iconPath = path.join(__dirname, "public", "icon.png");
    
    // Create 48x48 favicon
    const img48 = await Jimp.read(iconPath);
    await img48.resize(48, 48).writeAsync(path.join(__dirname, "public", "favicon-48x48.png"));
    console.log("Created /public/favicon-48x48.png");

    // Create 192x192 apple touch icon
    const img192 = await Jimp.read(iconPath);
    await img192.resize(192, 192).writeAsync(path.join(__dirname, "public", "apple-touch-icon.png"));
    console.log("Created /public/apple-touch-icon.png");

  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

resizeIcons();
