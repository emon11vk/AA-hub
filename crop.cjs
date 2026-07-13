const sharp = require('sharp');

async function processLogo() {
  try {
    const original = sharp('public/ftu-logo.png');
    
    // Trim to get the square logo
    const trimmed = await original.trim().toBuffer();
    const trimMeta = await sharp(trimmed).metadata();
    const width = trimMeta.width;
    
    // Create a white circle SVG
    const circleSvg = Buffer.from(
      `<svg width="${width}" height="${width}">
        <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 2}" fill="white" />
      </svg>`
    );

    // Composite the white circle behind the trimmed logo
    await sharp(circleSvg)
      .composite([{ input: trimmed, blend: 'over' }])
      .toFile('public/favicon.png');
      
    await sharp(circleSvg)
      .composite([{ input: trimmed, blend: 'over' }])
      .toFile('public/ftu-logo-white.png');
      
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

processLogo();
