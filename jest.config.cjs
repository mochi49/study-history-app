module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(svg|png|jpg|jpeg|gif|webp|avif)$":
      "<rootDir>/src/__mocks__/fileMock.ts",
    "^/vite\\.svg$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
};
