// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

test.describe('Negative Scenarios - Form Validation', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    
    // Add an item to cart for checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });
    
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-2.1: Missing First Name Error', async () => {
    // Leave First Name empty and fill others
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Click continue
    await page.locator('[data-test="continue"]').click();

    // Verify error message appears
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');

    // Verify we're still on checkout page
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('TC-2.2: Missing Last Name Error', async () => {
    // Fill First Name and Postal Code, leave Last Name empty
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Click continue
    await page.locator('[data-test="continue"]').click();

    // Verify error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');

    // Verify we're still on checkout page
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('TC-2.3: Missing Zip Code Error', async () => {
    // Fill First Name and Last Name, leave Zip Code empty
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');

    // Click continue
    await page.locator('[data-test="continue"]').click();

    // Verify error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');

    // Verify we're still on checkout page
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('TC-2.4: All Fields Empty Error', async () => {
    // Don't fill any fields, click continue
    await page.locator('[data-test="continue"]').click();

    // Verify error appears
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // Error message should indicate missing field(s)
    const errorText = await page.locator('[data-test="error"]').textContent();
    expect(errorText).toBeTruthy();

    // Verify we're still on checkout page
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('TC-2.5: Form Cannot Submit Without All Required Fields', async () => {
    // Test multiple combinations of empty fields

    // Test 1: Only First Name filled
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    expect(page.url()).toContain('checkout-step-one.html');

    // Clear and test 2: Only Last Name filled
    await page.locator('[data-test="firstName"]').fill('');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    expect(page.url()).toContain('checkout-step-one.html');

    // Clear and test 3: Only Postal Code filled
    await page.locator('[data-test="firstName"]').fill('');
    await page.locator('[data-test="lastName"]').fill('');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    expect(page.url()).toContain('checkout-step-one.html');
  });
});
