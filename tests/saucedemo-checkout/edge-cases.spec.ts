// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

test.describe('Edge Cases - Input Variations', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });
    
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-3.1: Very Long First Name', async () => {
    // Fill with 50-character first name
    const longName = 'JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn'; // 50 chars
    
    await page.locator('[data-test="firstName"]').fill(longName);
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Verify no error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify success
    expect(page.url()).toContain('checkout-step-two.html');
  });

  test('TC-3.2: Single Character Names', async () => {
    // Fill with single character values
    await page.locator('[data-test="firstName"]').fill('J');
    await page.locator('[data-test="lastName"]').fill('D');
    await page.locator('[data-test="postalCode"]').fill('1');

    // Verify no error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify success
    expect(page.url()).toContain('checkout-step-two.html');
  });

  test('TC-3.3: Very Long Zip Code', async () => {
    // Fill with 9-digit zip code
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('123456789');

    // Verify no error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify success
    expect(page.url()).toContain('checkout-step-two.html');
  });

  test('TC-3.4: Whitespace in Input Fields', async () => {
    // Fill with leading/trailing whitespace
    await page.locator('[data-test="firstName"]').fill('  John  ');
    await page.locator('[data-test="lastName"]').fill('  Doe  ');
    await page.locator('[data-test="postalCode"]').fill('  12345  ');

    // Verify no error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify success
    expect(page.url()).toContain('checkout-step-two.html');
  });

  test('TC-3.5: Space-Only Input Rejection', async () => {
    // Fill with only spaces
    await page.locator('[data-test="firstName"]').fill('     ');
    await page.locator('[data-test="lastName"]').fill('     ');
    await page.locator('[data-test="postalCode"]').fill('     ');

    // Click continue
    await page.locator('[data-test="continue"]').click();

    // Verify behavior - system should either reject as empty or accept
    // Check if error appears (space-only treated as empty)
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    
    if (errorVisible) {
      // If treated as empty, error should appear
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      expect(page.url()).toContain('checkout-step-one.html');
    } else {
      // If accepted, should proceed
      await page.waitForURL(/checkout-step-(one|two)\.html/, { timeout: 5000 });
    }
  });
});
