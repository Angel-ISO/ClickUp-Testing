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
   # Edit .env with your actual ClickUp API credentials
   ```

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

## Team Conventions

- **Naming**: camelCase for variables/functions, PascalCase for classes
- **File Structure**: Tests stored under `/tests/{module}`
- **Comments**: Each test includes brief description and expected result
- **Commits**: Use format `feat: add test for folder creation` or `fix: update tag validation`
- **Linting**: ESLint for code style enforcement
- **Test Naming**: `TC-{TYPE}-{NUMBER} - {Description}`

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