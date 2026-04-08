const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Directly point to the CommonJS files bypassing exports rules
  if (moduleName === 'zustand') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/zustand/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'zustand/middleware') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
      type: 'sourceFile',
    };
  }

  // fallback to default resolver
  if (context.resolveRequest) {
      return context.resolveRequest(context, moduleName, platform);
  }
  
  // Standard metro resolver fallback
  return require('metro-resolver').resolve(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
