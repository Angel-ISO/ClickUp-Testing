<div align="center">
  <img src="./media/quanonimos.png"alt="Logo" height="100">
  <h2>
    ClickUp Testing Project by qanonimos
  </h2>
</div>

<div align="center">
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
    </a>
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/release-latest-blue?style=for-the-badge" alt="Latest Version">
    </a>
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/contributors-4-orange?style=for-the-badge" alt="Contributors">
    </a>
</div>

<br>
<br>

## Project Objective

This project is a comprehensive API testing suite for ClickUp, developed as the final project for the Software Quality Engineering course. The goal is to implement automated tests that validate the functionality, reliability, and security of ClickUp's API endpoints, following industry best practices for test automation.


## Test Categories

### Functional Tests
- **Positive (FP)**: Happy path tests with valid inputs
- **Negative (FN)**: Invalid inputs and error scenarios

### Non-Functional Tests
- **Performance (P)**: Response time and load tests
- **Security (S)**: Authentication, authorization, and security validations
- **Fuzz (FF)**: Random or unexpected input testing
- **Reliability (FR)**: Consistency and stability testing



## Technologies Used

- **Jest**: Testing framework for unit and integration tests
- **Axios**: HTTP client for API requests
- **Dotenv**: Environment variable management
- **AJV**: JSON Schema validation
- **ESLint**: Code linting and formatting

##  Architecture

The project follows a **3-layer clean architecture**:

### Core Layer
- `http_client.js`: HTTP client with Result Monad for functional error handling
- `request_manager.js`: Singleton request manager
- `result.js`: Functional error handling (no exceptions)

### Business Logic Layer
- `apiServices/`: Specific API services (Tasks, Folders, Comments, etc.)
- `schemaValidators/`: JSON Schema validation with AJV
- `utils/`: Functional helper utilities

### Tests Layer
- `setup.test.js`: Automatic environment configuration
- Test suites using the architecture services

### Key Features
-  **Functional Programming**: Result Monad, no try-catch in business logic
-  **ES6 Modules**: Modern JavaScript with import/export
-  **Schema Validation**: Automatic response validation
-  **Snake Case**: Consistent naming convention
-  **Automatic Setup**: No manual configuration needed

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Angel-ISO/ClickUp-Testing.git
   cd ClickUp-Testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your ClickUp API token (SPACE_ID is obtained automatically!)
   ```

   ** New: Automatic Space ID Detection**
   The project now automatically detects your ClickUp Space ID from your API token. No need to manually configure `CLICKUP_SPACE_ID` anymore!

   ```bash
   # .env - Only these two are needed:
   CLICKUP_BASE_URL=https://api.clickup.com/api/v2
   CLICKUP_TOKEN=your_clickup_api_token_here
   ```

   The system will:
   1. Get your team/workspace ID from `/team`
   2. Get available spaces from `/team/{team_id}/space`
   3. Use the first available space automatically

   if u need more information about the setup u can check the [setup.md](./Setup.md)

4. **Run tests**
   ```bash
   npm test
   ```


## Test Execution

ensure that u have the .env file with the credentials of your clickup account

```bash
npm test

npm run test:watch

npm run test:coverage
```

if u want to run the tests by a member of the team u can use the foolowing commands

```bash
npm test -- "tests/Folders - Angel Ortega"
```

```bash
npm test -- "tests/Tags - David Cardona"
```

```bash
npm test -- "tests/Task - Jose Hernandez" 
```

```bash
npm test -- "tests/Comments - Sofia Beltran" 
```

```bash
npm test -- "tests/List - Jose Fernandez" 
```


## Definition of Done (DoD)

- **Code Quality**: Code follows team conventions and passes linting
- **Functionality**: Meets acceptance criteria and passes all tests
- **Testing**: Includes updated test cases with successful execution
- **Peer Review**: Code reviewed and approved by teammates
- **Documentation**: Changes documented in code and README
- **Integration**: Builds successfully without breaking functionality





##  Tag-Based Test Filtering

The project implements a comprehensive tag system that allows you to run specific subsets of tests based on categories and features.

### Quick Start

```bash
npm run test:smoke

npm run test:smoke:folders

npm run test:negativos

npm run test:funcionalidad:folders
```

### Available Tags

- **`@smoke`**: Critical tests that must pass (each feature should have at least one)
- **`@funcionalidad:name`**: Groups tests by feature (folders, tasks, lists, tags, comments)
- **`@negativos`**: All negative test cases (error scenarios)

### All Available Commands

```bash
npm run test:smoke                    # All smoke tests
npm run test:smoke:folders            # Smoke tests for folders
npm run test:smoke:tasks              # Smoke tests for tasks
npm run test:smoke:lists              # Smoke tests for lists
npm run test:smoke:tags               # Smoke tests for tags
npm run test:smoke:comments           # Smoke tests for comments

npm run test:negativos                # All negative tests
npm run test:negativos:folders        # Negative tests for folders
npm run test:negativos:tasks          # Negative tests for tasks
npm run test:negativos:lists          # Negative tests for lists
npm run test:negativos:tags           # Negative tests for tags
npm run test:negativos:comments       # Negative tests for comments

npm run test:funcionalidad:folders    # All tests for folders
npm run test:funcionalidad:tasks      # All tests for tasks
npm run test:funcionalidad:lists      # All tests for lists
npm run test:funcionalidad:tags       # All tests for tags
npm run test:funcionalidad:comments   # All tests for comments
```

### How to Add Tags to Your Tests

```javascript
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  'TC-FP-001 - Create folder with valid name',
  () => {
    it('should create folder successfully', async () => {
    });
  }
);

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
  'TC-FN-002 - Missing folder name validation',
  () => {
    it('should return 400 error', async () => {
    });
  }
);
```

**For detailed documentation**, see [COMMANDS.md](./COMMANDS.md)



## Team Conventions

- **Naming**: snake_case for variables/functions, PascalCase for classes
- **File Structure**: Tests stored under `/tests/{module}`
- **Comments**: Each test includes brief description and expected result
- **Commits**: Use format `feat: add test for folder creation` or `fix: update tag validation`
- **Linting**: ESLint for code style enforcement
- **Test Naming**: `TC-{TYPE}-{NUMBER} - {Description}`
- **Architecture**: 3-layer clean architecture with functional programming

## Hooks Implementation

The project implements Jest hooks for proper test lifecycle management:

- `beforeEach()`: Setup test prerequisites if that us needed
- `afterEach()`: Cleanup test artifacts (e.g., delete created folders)

This ensures tests are isolated and don't interfere with each other.

## Contributing

1. Follow the established naming conventions
2. Implement appropriate hooks for setup/teardown
3. Add comprehensive assertions and error handling
4. Update documentation as needed
5. Ensure all tests pass before submitting

## License

MIT License - see LICENSE file for details.

```bash
npm test -- "tests/List - Jose Fernandez" 
```


## Definition of Done (DoD)

- **Code Quality**: Code follows team conventions and passes linting
- **Functionality**: Meets acceptance criteria and passes all tests
- **Testing**: Includes updated test cases with successful execution
- **Peer Review**: Code reviewed and approved by teammates
- **Documentation**: Changes documented in code and README
- **Integration**: Builds successfully without breaking functionality

## Team Conventions

- **Naming**: snake_case for variables/functions, PascalCase for classes
- **File Structure**: Tests stored under `/tests/{module}`
- **Comments**: Each test includes brief description and expected result
- **Commits**: Use format `feat: add test for folder creation` or `fix: update tag validation`
- **Linting**: ESLint for code style enforcement
- **Test Naming**: `TC-{TYPE}-{NUMBER} - {Description}`
- **Architecture**: 3-layer clean architecture with functional programming

## Hooks Implementation

The project implements Jest hooks for proper test lifecycle management:

- `beforeEach()`: Setup test prerequisites if that us needed
- `afterEach()`: Cleanup test artifacts (e.g., delete created folders)

This ensures tests are isolated and don't interfere with each other.

## Contributing

1. Follow the established naming conventions
2. Implement appropriate hooks for setup/teardown
3. Add comprehensive assertions and error handling
4. Update documentation as needed
5. Ensure all tests pass before submitting

## License

MIT License - see LICENSE file for details.