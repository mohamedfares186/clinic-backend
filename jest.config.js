import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "esnext",
          esModuleInterop: true,
        },
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
