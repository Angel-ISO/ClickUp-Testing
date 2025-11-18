import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        fail: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "id-match": [
        "error",
        "^[a-z]+(?:_[a-z]+)*$", 
        {
          properties: false,
          classFields: false,
          ignoreDestructuring: false,
          onlyDeclarations: true
        }
      ],
    },
  },
];
