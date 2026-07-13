const sharp = require('sharp');

async function processFaasa() {
  try {
    const original = sharp('public/faasa-logo.png');
    const metadata = await original.metadata();
    const width = metadata.width;
    
    // Create a white circle SVG
    const circleSvg = Buffer.from(
      `<svg width="${width}" height="${width}">
        <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 2}" fill="white" />
      </svg>`
    );

    // Composite the white circle behind the logo
    await sharp(circleSvg)
      .composite([{ input: await original.toBuffer(), blend: 'over' }])
      .toFile('public/faasa-logo-white.png');
      
    console.log('Done FAASA!');
  } catch (err) {
    console.error(err);
  }
}

processFaasa();
