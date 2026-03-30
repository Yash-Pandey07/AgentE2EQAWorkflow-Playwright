# End-to-End QA Workflow with Natural Language

## Workflow Overview
This workflow guides you through a complete **7-step QA automation process** using MCP servers and AI agents.  
The goal is to move from a **user story → test plan → automated Playwright tests → committed code**.

---

# STEP 1: Read User Story

## Prompt

I need to start a new testing workflow.

Please read the user story from the following file:

```
user-stories/SCRUM-101-ecommerce-checkout.md
```

Then summarize the key requirements, acceptance criteria, and testing scope.

## Expected Output

- Summary of the user story
- List of acceptance criteria
- Application URL
- Test credentials
- Key features that need to be tested

---

# STEP 2: Create Test Plan

## Prompt

Based on the user story **SCRUM-101** that we just reviewed, use the **playwright-test-planner** agent to perform the following tasks:

1. Read the **application URL** and **test credentials** from the user story.
2. Explore the application and understand all workflows mentioned in the **acceptance criteria**.
3. Create a **comprehensive test plan** that covers all acceptance criteria.

The test plan should include:

### Test Coverage

- Happy path scenarios
- Negative test scenarios
- Edge cases
- UI validation
- API validation (if applicable)
- Data validation

### Test Plan Output

The final test plan should contain:

- Test suite name
- Test case descriptions
- Steps to execute each test
- Expected results
- Priority of test cases
- Tags or categories for grouping tests

---

# STEP 3: Generate Test Cases

## Prompt

Using the test plan created in Step 2:

1. Generate detailed **manual test cases**.
2. Ensure every **acceptance criterion** is covered.
3. Organize test cases into logical **test suites**.

Each test case should include:

- Test case ID
- Test description
- Preconditions
- Test steps
- Expected result
- Priority
- Tags

---

# STEP 4: Generate Playwright Test Scripts

## Prompt

Using the generated test cases:

1. Convert the test cases into **Playwright automated tests**.
2. Use **JavaScript or TypeScript**.
3. Follow **Playwright best practices**.

### Requirements

- Use Page Object Model (POM) if applicable
- Add proper test descriptions
- Use meaningful selectors
- Include assertions for validation
- Add reusable helper functions

---

# STEP 5: Run and Validate Tests

## Prompt

Execute the generated Playwright test suite.

Verify:

- All tests run successfully
- Failures are properly logged
- Screenshots are captured on failure
- Reports are generated

### Expected Output

- Test execution results
- Failure analysis
- Logs and screenshots
- Playwright test report

---

# STEP 6: Fix Issues and Improve Tests

## Prompt

If tests fail:

1. Analyze the failure logs
2. Identify whether the issue is due to:
   - Application bug
   - Incorrect selector
   - Timing issue
   - Test logic issue
3. Update and improve the test scripts accordingly.

---

# STEP 7: Commit and Push Tests

## Prompt

Once tests are stable:

1. Format the code
2. Add clear commit messages
3. Push the test scripts to the repository

### Commit Example

```
feat: add automated Playwright tests for SCRUM-101 checkout flow
```

### Repository Structure Example

```
tests/
pages/
fixtures/
utils/
playwright.config.js
```

---

# Final Outcome

By the end of this workflow you should have:

- Fully understood the **user story**
- A **complete test plan**
- Well-defined **test cases**
- **Automated Playwright tests**
- Executed and validated tests
- Tests committed to the **repository**

---

# Tools Used

- Playwright
- MCP Servers
- AI Test Agents
- Git
- CI/CD pipeline (optional)

---

# Goal

Transform **natural language requirements → reliable automated QA tests** efficiently.
