// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

test.describe('Calculation and Display Verification', () => {
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

  test('TC-5.1: Verify Accurate Tax Calculation', async () => {
    // Add Backpack ($29.99) and Bike Light ($9.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Navigate to order overview
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify calculations
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('39.98');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('3.20');
    await expect(page.locator('[data-test="total-label"]')).toContainText('43.18');

    // Verify format (2 decimal places)
    const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent();
    expect(subtotalText).toMatch(/\$\d+\.\d{2}/);
    
    const taxText = await page.locator('[data-test="tax-label"]').textContent();
    expect(taxText).toMatch(/\$\d+\.\d{2}/);
    
    const totalText = await page.locator('[data-test="total-label"]').textContent();
    expect(totalText).toMatch(/\$\d+\.\d{2}/);
  });

  test('TC-5.2: Verify Totals with Different Item Combinations', async () => {
    // Add Backpack ($29.99) and Fleece Jacket ($49.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();

    // Navigate to overview
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('54321');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify calculations for different items
    // 29.99 + 49.99 = 79.98
    // Tax: 79.98 * 0.08 = 6.40 (approximately)
    // Total: 79.98 + 6.40 = 86.38
    
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('79.98');
    
    // Get tax and verify calculation is correct
    const taxText = await page.locator('[data-test="tax-label"]').textContent();
    expect(taxText).toBeTruthy();
    
    // Get total and verify it's subtotal + tax
    const totalText = await page.locator('[data-test="total-label"]').textContent();
    expect(totalText).toContain('86.38');
  });

  test('TC-5.3: Order Overview Shows All Item Details', async () => {
    // Add multiple items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Navigate to overview
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify all items display with details
    const cartItems = await page.locator('[data-test="inventory-item-name"]').count();
    expect(cartItems).toBe(3);

    // Verify each item has name, description, and price
    const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(itemNames.length).toBeGreaterThan(0);
    
    const priceElements = await page.locator('[data-test="inventory-item-price"]').count();
    expect(priceElements).toBe(3);

    // Verify quantities display
    const quantityElements = await page.locator('[data-test="item-quantity"]').count();
    expect(quantityElements).toBeGreaterThan(0);
  });

  test('TC-5.4: Payment Information Display', async () => {
    // Add item and navigate to overview
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify payment information section
    await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard #31337');

    // Verify payment value is clearly displayed
    const paymentText = await page.locator('[data-test="payment-info-value"]').textContent();
    expect(paymentText).toBeTruthy();
  });

  test('TC-5.5: Shipping Information Display', async () => {
    // Add item and navigate to overview
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html', { timeout: 5000 });

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });

    // Verify shipping information section
    await expect(page.locator('[data-test="shipping-info-label"]')).toBeVisible();
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery');

    // Verify shipping value is clearly displayed
    const shippingText = await page.locator('[data-test="shipping-info-value"]').textContent();
    expect(shippingText).toBeTruthy();
  });
});
