// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

test.describe('Happy Path Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-1.1: Complete Checkout Flow End-to-End', async () => {
    // 1. Verify inventory page loads successfully
    expect(page.url()).toContain('inventory.html');
    await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible();

    // 2. Add Sauce Labs Backpack ($29.99) to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');

    // 3. Add Sauce Labs Bike Light ($9.99) to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');

    // 4. Click shopping cart icon to view cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    // 5. Verify cart displays correct items and prices
    expect(page.url()).toContain('cart.html');
    await expect(page.locator('.title')).toContainText('Your Cart');
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toContainText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-price"]').first()).toContainText('$29.99');

    // 6. Click 'Checkout' button
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    // 7. Fill checkout form
    await expect(page.locator('.title')).toContainText('Checkout: Your Information');
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // 8. Click 'Continue' button
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // 9. Verify order overview displays items and calculations
    await expect(page.locator('.title')).toContainText('Checkout: Overview');
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('39.98');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('3.20');
    await expect(page.locator('[data-test="total-label"]')).toContainText('43.18');

    // 10. Verify payment and shipping information
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery');

    // 11. Click 'Finish' button
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html', { timeout: 5000 });

    // 12. Verify success message
    await expect(page.locator('.title')).toContainText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');

    // 13. Click 'Back Home' button
    await page.locator('[data-test="back-to-products"]').click();
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
    expect(page.url()).toContain('inventory.html');
  });

  test('TC-1.2: Cart Review with Multiple Items', async () => {
    // Add three items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Verify cart badge shows 3
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('3');

    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    // Verify cart page title
    await expect(page.locator('.title')).toContainText('Your Cart');

    // Verify all items appear with correct prices
    const cartItems = await page.locator('[data-test="inventory-item-name"]').count();
    expect(cartItems).toBe(3);

    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    expect(prices).toContain('$29.99');
    expect(prices).toContain('$9.99');
    expect(prices).toContain('$15.99');

    // Go to checkout and verify subtotal on overview page
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify subtotal
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('55.97');
  });

  test('TC-1.3: Continue Shopping Returns to Inventory', async () => {
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    // Click continue shopping
    await page.locator('[data-test="continue-shopping"]').click();
    await page.waitForURL('**/inventory.html', { timeout: 5000 });

    // Verify back on inventory page
    expect(page.url()).toContain('inventory.html');
    
    // Verify cart items still preserved
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');
  });

  test('TC-1.4: Checkout with Special Characters in Names', async () => {
    // Add item and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    // Fill with special characters
    await page.locator('[data-test="firstName"]').fill("O'Brien");
    await page.locator('[data-test="lastName"]').fill('Jean-Claude');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Should not show error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    expect(page.url()).toContain('checkout-step-two.html');
  });

  test('TC-1.5: Checkout with Numbers in Name Fields', async () => {
    // Add item and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    // Fill with numbers
    await page.locator('[data-test="firstName"]').fill('John123');
    await page.locator('[data-test="lastName"]').fill('Doe456');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Should not show error
    const errorVisible = await page.locator('[data-test="error"]').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Click continue
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    expect(page.url()).toContain('checkout-step-two.html');
  });
});
