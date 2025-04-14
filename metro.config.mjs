// Import using ESM syntax
import { getDefaultConfig } from '@expo/metro-config';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultConfig = getDefaultConfig(__dirname);

// Add support for CJS files
defaultConfig.resolver.sourceExts.push('cjs');

// Helper function to create a regex pattern that works cross-platform
const createExcludePattern = (relativePath) => {
  const absolutePath = path.resolve(__dirname, relativePath).replace(/\\/g, '\\\\');
  return new RegExp(`^${absolutePath}(?:/|\\\\).*$`);
};

// Define a list of utility files/patterns that should not be treated as routes
defaultConfig.resolver.blockList = [
  // Exclude utility dirs by pattern
  createExcludePattern('app/utils'),
  createExcludePattern('app/models'),
  createExcludePattern('app/config'),
  createExcludePattern('app/services'),
  createExcludePattern('app/context'),
  createExcludePattern('app/constants'),
  createExcludePattern('app/hooks'),
  
  // Exclude specific files
  new RegExp(`${path.resolve(__dirname, 'app/firebase.ts').replace(/\\/g, '\\\\')}$`),
];

// Extra resolverMainFields configuration to better handle ESM
defaultConfig.resolver.resolverMainFields = ['browser', 'main', 'module'];

// Export using ESM syntax
export default defaultConfig; 