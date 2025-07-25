#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MAX_MODULE_SIZE = 10 * 1024; // 10KB max per module
const MAX_TOTAL_SIZE = 200 * 1024; // 200KB total max

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function checkModuleSizes(dir, baseDir = dir) {
  let totalSize = 0;
  const oversizedModules = [];

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.js')) {
        const size = getFileSize(filePath);
        totalSize += size;
        
        if (size > MAX_MODULE_SIZE) {
          const relativePath = path.relative(baseDir, filePath);
          oversizedModules.push({
            path: relativePath,
            size: size,
            sizeKB: (size / 1024).toFixed(2)
          });
        }
      }
    }
  }

  walk(dir);

  return { totalSize, oversizedModules };
}

// Check dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.log('No dist directory found. Run build first.');
  process.exit(0);
}

const { totalSize, oversizedModules } = checkModuleSizes(distDir);

console.log(`Total size: ${(totalSize / 1024).toFixed(2)}KB (max: ${MAX_TOTAL_SIZE / 1024}KB)`);

if (oversizedModules.length > 0) {
  console.error('\nOversized modules found:');
  oversizedModules.forEach(module => {
    console.error(`  ${module.path}: ${module.sizeKB}KB (max: ${MAX_MODULE_SIZE / 1024}KB)`);
  });
  process.exit(1);
}

if (totalSize > MAX_TOTAL_SIZE) {
  console.error(`\nTotal size exceeds limit: ${(totalSize / 1024).toFixed(2)}KB > ${MAX_TOTAL_SIZE / 1024}KB`);
  process.exit(1);
}

console.log('All module sizes within limits.');