const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = exclusionList([
  /node_modules\/@opentelemetry\/.*/,
]);

module.exports = config;
