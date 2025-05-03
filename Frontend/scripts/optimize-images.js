const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch (error) {
    await fs.mkdir(directory, { recursive: true });
  }
}

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await ensureDirectoryExists(OUTPUT_DIR);
    
    // Get all image files
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file) && !file.includes('optimized_')
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process each image
    const optimizationPromises = imageFiles.map(async (filename) => {
      const inputPath = path.join(IMAGES_DIR, filename);
      const fileExt = path.extname(filename);
      const baseName = path.basename(filename, fileExt);
      
      // Create different optimized versions
      const operations = [
        // Create WebP version
        {
          output: path.join(OUTPUT_DIR, `${baseName}.webp`),
          transform: sharp(inputPath).webp({ quality: 80 })
        },
        // Create optimized JPG
        {
          output: path.join(OUTPUT_DIR, `${baseName}.jpg`),
          transform: sharp(inputPath).jpeg({ quality: 80, progressive: true })
        },
        // Create optimized PNG
        {
          output: path.join(OUTPUT_DIR, `${baseName}.png`),
          transform: sharp(inputPath).png({ compressionLevel: 9, progressive: true })
        },
        // Create thumbnail
        {
          output: path.join(OUTPUT_DIR, `${baseName}_thumb.webp`),
          transform: sharp(inputPath).resize(200, 200, { fit: 'inside' }).webp({ quality: 70 })
        },
        // Create responsive sizes (for srcset)
        {
          output: path.join(OUTPUT_DIR, `${baseName}_sm.webp`),
          transform: sharp(inputPath).resize(640, null, { fit: 'inside' }).webp({ quality: 75 })
        },
        {
          output: path.join(OUTPUT_DIR, `${baseName}_md.webp`),
          transform: sharp(inputPath).resize(1024, null, { fit: 'inside' }).webp({ quality: 80 })
        },
        {
          output: path.join(OUTPUT_DIR, `${baseName}_lg.webp`),
          transform: sharp(inputPath).resize(1920, null, { fit: 'inside' }).webp({ quality: 85 })
        }
      ];
      
      // Execute all operations
      const savePromises = operations.map(({ output, transform }) => {
        return transform.toFile(output)
          .then(info => {
            console.log(`Optimized: ${output} (${info.size} bytes)`);
            return info;
          });
      });
      
      return Promise.all(savePromises);
    });
    
    await Promise.all(optimizationPromises);
    console.log('Image optimization complete!');
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Run the optimization
optimizeImages(); 