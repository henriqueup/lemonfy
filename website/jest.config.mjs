// jest.config.js
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  roots: ["<rootDir>"],

  // If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
  // you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
  // The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
  // For example:
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
    "@entities/(.*)$": "<rootDir>/src/server/entities/$1",
    "@domains/(.*)$": "<rootDir>/src/server/domains/$1",
    "@routers/(.*)$": "<rootDir>/src/server/api/routers/$1",
    "@repositories/(.*)$": "<rootDir>/src/server/repositories/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
  testEnvironment: "./FixJSDOMEnvironment.ts",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
