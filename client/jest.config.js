module.exports = {
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/**/*.test.{js,ts,jsx,tsx}",
    "!src/**/*.spec.{js,ts,jsx,tsx}"
  ],
  "testMatch": [
    "**/__tests__/**/*.(test|spec).{js,ts,jsx,tsx}",
    "**/?(*.)(test|spec).{js,ts,jsx,tsx}"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};