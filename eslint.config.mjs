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
        expect: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-useless-escape": "error",
      camelcase: [
        "error",
        {
          properties: "always",
          ignoreDestructuring: false,
          ignoreImports: false,
          ignoreGlobals: false,
          allow: ["^UNSAFE_", "^CLICKUP_"],
        },
      ],
      "no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
        },
      ],
    },
  },
  {
    files: ["bussines/schemaValidators/**/*Schemas.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-useless-escape": "error",
      camelcase: "off",
      "id-match": [
        "error",
        "^([a-z][a-zA-Z0-9_]*|[A-Z][a-zA-Z0-9]*)$",
        {
          properties: true,
          classFields: false,
          ignoreDestructuring: true,
          onlyDeclarations: true,
        },
      ],
      "no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
        },
      ],
    },
  },
  {
    files: ["bussines/utils/tags.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
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
      camelcase: [
        "warn",
        {
          properties: "never",
          ignoreDestructuring: true,
          ignoreImports: false,
          allow: ["^UNSAFE_", "^CLICKUP_", "^TC_"],
        },
      ],
      "no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
        },
      ],
    },
  },
];
