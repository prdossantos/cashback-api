module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    modulePathIgnorePatterns: ["<rootDir>/coverage", "<rootDir>/build", "<rootDir>/node_modules"]
};
