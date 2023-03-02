module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["dist"],
  moduleNameMapper: {
    "./utils/api.js": "<rootDir>/src/utils/api.ts",
    "./controllers/iso.js": "<rootDir>/src/controllers/iso.ts",
    "../config/markets.js": "<rootDir>/src/config/markets.ts",
    "../config/currencies.js": "<rootDir>/src/config/currencies.ts",
    "../config/logEventTypes.js": "<rootDir>/src/config/logEventTypes.ts",
    "../config/initialize.js": "<rootDir>/src/config/initialize.ts",
    "./markets.js": "<rootDir>/src/config/markets.ts",
    "./parseSeaport.js": "<rootDir>/src/controllers/parseSeaport.ts",
    "./parseSaleToken.js": "<rootDir>/src/controllers/parseSaleToken.ts",
  }

};
