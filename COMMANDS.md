# Testing Commands

This document explains how to use the tag system to run tests selectively.

## Table of Contents

- [What are Tags?](#what-are-tags)
- [Test Categories](#test-categories)
- [Execution Tags](#execution-tags)
- [Available Commands](#available-commands)
- [Usage Examples](#usage-examples)
- [How to Add Tags to your Tests](#how-to-add-tags-to-your-tests)

## What are Tags?

**Tags** are labels added to tests to filter and run only specific groups. This is useful for:

- Running only critical tests (smoke tests) before deployment
- Running only tests for a specific functionality while developing
- Running only negative tests to validate error handling
- Saving time by running relevant test subsets

## Test Categories

Each test case has a category indicating its type:

| Category | Code | Description | Example |
|----------|------|-------------|---------|
| **Functional Positive** | `FP` | Happy path tests with valid inputs | TC-FP-001 |
| **Functional Negative** | `FN` | Tests with invalid inputs and errors | TC-FN-002 |
| **Performance** | `P` | Performance and response time tests | TC-P-001 |
| **Security** | `S` | Security and authentication tests | TC-S-003 |
| **Fuzz** | `FF` | Tests with random or unexpected inputs | TC-FF-004 |
| **Reliability** | `FR` | Consistency and stability tests | TC-FR-005 |

## Execution Tags

Execution tags are added to tests for filtering:

### `@smoke`
**Critical** tests that must always pass. Each functionality should have at least one smoke test.

**When to use:**
- Main test for creating a resource
- Login/authentication test
- Tests that validate core functionality

### `@funcionalidad:name`
Groups tests by module or feature.

**Available functionalities:**
- `@funcionalidad:folders` - Folder tests
- `@funcionalidad:tasks` - Task tests
- `@funcionalidad:lists` - List tests
- `@funcionalidad:tags` - Tag tests
- `@funcionalidad:comments` - Comment tests

### `@negativos`
All negative test cases (errors, validations).

**When to use:**
- Tests expecting error codes (400, 401, 403, 404, etc.)
- Required field validation tests
- Insufficient permissions tests

## Available Commands

### Smoke Tests

Run **all** smoke tests:
```bash
npm run test:smoke
```

Run smoke tests for a specific functionality:
```bash
npm run test:smoke:folders      # Only folder smoke tests
npm run test:smoke:tasks         # Only task smoke tests
npm run test:smoke:lists         # Only list smoke tests
npm run test:smoke:tags          # Only tag smoke tests
npm run test:smoke:comments      # Only comment smoke tests
```

### Negative Tests

Run **all** negative tests:
```bash
npm run test:negativos
```

Run negative tests for a specific functionality:
```bash
npm run test:negativos:folders   # Only folder negative tests
npm run test:negativos:tasks     # Only task negative tests
npm run test:negativos:lists     # Only list negative tests
npm run test:negativos:tags      # Only tag negative tests
npm run test:negativos:comments  # Only comment negative tests
```

### Tests by Functionality

Run **all** tests for a functionality:
```bash
npm run test:funcionalidad:folders    # All folder tests
npm run test:funcionalidad:tasks      # All task tests
npm run test:funcionalidad:lists      # All list tests
npm run test:funcionalidad:tags       # All tag tests
npm run test:funcionalidad:comments   # All comment tests
```

### Other Testing Commands

```bash
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

## Usage Examples

### Example 1: Feature Development
You're working on the folders functionality and want to run only those tests:

```bash
npm run test:funcionalidad:folders
```

### Example 2: Pre-Deploy Check
Before deployment, run smoke tests to ensure critical functionality works:

```bash
npm run test:smoke
```

### Example 3: Validate Error Handling
You want to verify that all negative task cases work correctly:

```bash
npm run test:negativos:tasks
```

### Example 4: Quick Check of a Feature
You only want to run the critical comment tests:

```bash
npm run test:smoke:comments
```

## How to Add Tags to your Tests

### Step 1: Import the Helpers

```javascript
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
```

### Step 2: Use `taggedDescribe` instead of `describe`

**Positive Test with Smoke:**
```javascript
taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  'TC-FP-001 - Verify that user can create a folder',
  () => {
    it('should create folder successfully', async () => {
      // test implementation
    });
  }
);
```

**Negative Test:**
```javascript
taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
  'TC-FN-002 - Verify error when folder name is missing',
  () => {
    it('should return 400 error', async () => {
      // test implementation
    });
  }
);
```

**Security Smoke Test:**
```javascript
taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  'TC-S-003 - Verify unauthorized access is rejected',
  () => {
    it('should reject invalid token', async () => {
      // test implementation
    });
  }
);
```

### Step 3: Run your Filtered Tests

```bash
# Run only the smoke test you just created
npm run test:smoke:folders

# Run all folder tests
npm run test:funcionalidad:folders

# Run only the negative ones
npm run test:negativos:folders
```

## Tagging Rules

1. **Each functionality must have at least one `@smoke` test**
2. **All `FN` tests must have the `@negativos` tag**
3. **All tests must have a `@funcionalidad:name` tag**
4. **Critical tests (main happy path) should be `@smoke`**

## Tips

- **In CI/CD**: You can run only `npm run test:smoke` in pull requests for quick feedback
- **During development**: Use `npm run test:funcionalidad:X` to focus on what you're developing
- **Before release**: Run `npm test` to run all tests
- **Debugging**: Use `npm run test:watch` with filters for iterative development

## More Information

For more details about the implementation, check:
- `bussines/utils/tags.js` - Tag definitions and helpers
- `TC-FP-001.test.js` - Example of implemented tagged test
