const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

// Add 'cjs' to the resolver extensions for Firebase compatibility
defaultConfig.resolver.sourceExts.push("cjs");

// Use withNativeWind for Tailwind CSS configuration
module.exports = withNativeWind(defaultConfig, { input: "./global.css" });
