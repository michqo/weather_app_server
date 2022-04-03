export default {
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc-node/jest"],
  },
}
