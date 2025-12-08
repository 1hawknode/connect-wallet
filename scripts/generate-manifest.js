// scripts/generate-manifest.js
const fs = require('fs');
const path = require('path');

// Use absolute path to minikit.config.ts
const minikitConfig = require('../minikit.config.ts').minikitConfig;

const manifest = {
  name: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  icon: minikitConfig.miniapp.iconUrl,
  splash: {
    image: minikitConfig.miniapp.splashImageUrl,
    background: minikitConfig.miniapp.splashBackgroundColor
  },
  version: minikitConfig.miniapp.version,
  categories: [minikitConfig.miniapp.primaryCategory],
  tags: minikitConfig.miniapp.tags,
  url: minikitConfig.miniapp.homeUrl,
  webhook: minikitConfig.miniapp.webhookUrl,
  accountAssociation: minikitConfig.accountAssociation
};

const outputDir = path.join(process.cwd(), 'public', '.well-known');
const outputFile = path.join(outputDir, 'farcaster.json');

// Create .well-known directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the manifest file
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log('Manifest generated successfully at:', outputFile);