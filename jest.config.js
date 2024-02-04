require("dotenv").config({ path: "./.testenv" });

module.exports = {
    roots: ["./src"],
    // transform: {
    //   "^.+\\.ts?$": "ts-jest",
    // },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // transform: {
    //     '^.+\\.ts?$': 'ts-jest'
    // },
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    verbose: true,
    testEnvironment: "node",
    testTimeout: 15000,
    moduleDirectories: ['node_modules', 'src'],
  };