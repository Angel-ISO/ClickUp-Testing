import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-useless-escape": "error",
      "id-match": [
        "error",
        "^[a-zA-Z][a-zA-Z0-9]*$",
        {
          properties: false,
          classFields: false,
          ignoreDestructuring: false,
          onlyDeclarations: true
        }
      ],
    },
  },
  {
    files: ["tests/**/*.js", "jest.setup.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
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
        setTimeout: "readonly",
        Buffer: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off", 
      "no-empty": "off", 
    },
  },
];
