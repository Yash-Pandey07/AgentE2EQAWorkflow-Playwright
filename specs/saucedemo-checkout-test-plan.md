# SauceDemo E-Commerce Checkout Test Plan

## Application Overview

Comprehensive test plan for the SauceDemo e-commerce application checkout workflow covering happy path scenarios, negative test cases, edge cases, UI validation, and error handling. The application URL is https://www.saucedemo.com with test credentials (standard_user / secret_sauce). The plan includes validation of cart review, checkout information entry, order overview, order completion, and error handling across the entire checkout process.

## Test Scenarios

### 1. Happy Path Scenarios

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-1.1: Complete Checkout Flow End-to-End

**File:** `tests/saucedemo-checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Log in with standard_user / secret_sauce credentials
    - expect: Inventory page loads successfully
    - expect: User can see all products
  2. Add Sauce Labs Backpack ($29.99) to cart
    - expect: Item is added to cart
    - expect: Cart count badge shows '1'
  3. Add Sauce Labs Bike Light ($9.99) to cart
    - expect: Item is added to cart
    - expect: Cart count badge shows '2'
  4. Click shopping cart icon to view cart
    - expect: Cart page displays
    - expect: Shows page title 'Your Cart'
    - expect: Both items appear in cart table
  5. Verify cart displays correct items and prices
    - expect: Backpack shows with $29.99 price
    - expect: Bike Light shows with $9.99 price
    - expect: QTY column shows 1 for each item
  6. Click 'Checkout' button
    - expect: Checkout information page loads
    - expect: Page title shows 'Checkout: Your Information'
  7. Fill checkout form: First Name='John', Last Name='Doe', Zip Code='12345'
    - expect: All fields populate without errors
    - expect: No validation errors appear
  8. Click 'Continue' button
    - expect: Order overview page loads successfully
    - expect: Page shows 'Checkout: Overview'
  9. Verify order overview displays all items and calculations
    - expect: Both items display in table with quantities and prices
    - expect: Item total shows $39.98
    - expect: Tax calculated as approximately $3.20
    - expect: Total shows $43.18
  10. Verify payment and shipping information
    - expect: Payment Information section shows 'SauceCard #31337'
    - expect: Shipping Information shows 'Free Pony Express Delivery!'
  11. Click 'Finish' button
    - expect: Order completion page loads
    - expect: Page title shows 'Checkout: Complete!'
  12. Verify success message displays
    - expect: Heading shows 'Thank you for your order!'
    - expect: Success message shows order dispatch confirmation
    - expect: Pony express icon displays
  13. Click 'Back Home' button to return to products
    - expect: Inventory page loads
    - expect: User can see all products again
    - expect: Cart is reset for new shopping session

#### 1.2. TC-1.2: Cart Review with Multiple Items

**File:** `tests/saucedemo-checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Log in and navigate to inventory page
    - expect: Inventory page loads successfully
  2. Add three items to cart: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99)
    - expect: Cart count badge shows '3'
  3. Click shopping cart icon
    - expect: Cart page loads with title 'Your Cart'
  4. Verify cart displays all items correctly
    - expect: All 3 items appear in cart table
    - expect: QTY column shows 1 for each item
    - expect: Description column shows product names and full descriptions
    - expect: Individual prices display: $29.99, $9.99, $15.99
  5. Verify Remove buttons present for each item
    - expect: Three 'Remove' buttons visible
    - expect: Each button corresponds to correct item
  6. Calculate and verify expected total
    - expect: Subtotal is $55.97 (29.99 + 9.99 + 15.99)
    - expect: Expected tax approximately $4.48
    - expect: Expected total approximately $60.45

#### 1.3. TC-1.3: Continue Shopping Returns to Inventory

**File:** `tests/saucedemo-checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Log in and add items to cart
    - expect: Items successfully added to cart
  2. Navigate to cart page
    - expect: Cart displays items
  3. Click 'Continue Shopping' button
    - expect: User returns to inventory page
    - expect: Products display
  4. Verify cart items are preserved
    - expect: Cart count badge still shows items in cart
    - expect: Items not removed

#### 1.4. TC-1.4: Checkout with Special Characters in Names

**File:** `tests/saucedemo-checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout
    - expect: Checkout information page loads
  2. Fill form with special characters: First Name="O'Brien", Last Name="Jean-Claude", Zip Code="12345"
    - expect: Special characters (apostrophe, hyphen) accepted
    - expect: No validation errors
  3. Click 'Continue' button
    - expect: Checkout proceeds to overview page successfully

#### 1.5. TC-1.5: Checkout with Numbers in Name Fields

**File:** `tests/saucedemo-checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Navigate to checkout information page
    - expect: Form loads with empty fields
  2. Fill form: First Name="John123", Last Name="Doe456", Zip Code="12345"
    - expect: Numbers accepted in name fields
    - expect: No validation errors
  3. Click 'Continue'
    - expect: Checkout proceeds to overview page

### 2. Negative Scenarios - Form Validation

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-2.1: Missing First Name Error

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Navigate to checkout information page with items in cart
    - expect: Checkout form displays with three empty fields
  2. Leave First Name field empty, enter Last Name='Doe', Zip Code='12345'
    - expect: Fields populate except First Name
  3. Click 'Continue' button
    - expect: Form validation triggered
    - expect: Red error banner appears
  4. Verify error message content
    - expect: Error message displays 'Error: First Name is required'
    - expect: Red banner with white text for visibility
    - expect: Red X icon next to First Name field
  5. Verify other fields show error indicators
    - expect: Red X icons appear next to empty fields
    - expect: Red underlines under fields
  6. Click X button on error banner to dismiss
    - expect: Error banner can be dismissed
    - expect: Form remains with entered data

#### 2.2. TC-2.2: Missing Last Name Error

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Navigation to checkout form with items in cart
    - expect: Form loads
  2. Fill form: First Name='John', Last Name=(empty), Zip Code='12345'
    - expect: First Name and Zip Code fields populated
  3. Click 'Continue'
    - expect: Validation error appears
  4. Verify error message
    - expect: Error banner shows 'Error: Last Name is required'
    - expect: Last Name field has red X and underline

#### 2.3. TC-2.3: Missing Zip Code Error

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Navigate to checkout form
    - expect: Form displays
  2. Fill form: First Name='John', Last Name='Doe', Zip Code=(empty)
    - expect: First Name and Last Name populated
  3. Click 'Continue'
    - expect: Validation triggered
  4. Verify error
    - expect: Error message shows 'Error: Postal Code is required'
    - expect: Zip Code field highlighted with error

#### 2.4. TC-2.4: All Fields Empty Error

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Navigate to checkout form
    - expect: Empty form displays
  2. Click 'Continue' without entering any data
    - expect: Validation triggers
  3. Verify error handling
    - expect: Error message appears (typically First Name)
    - expect: All three fields show error indicators
    - expect: Red X icons present on all fields

#### 2.5. TC-2.5: Form Cannot Submit Without All Required Fields

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Attempt various combinations of empty fields
    - expect: Each combination shows validation error
    - expect: Form blocks submission for any empty required field

### 3. Edge Cases - Input Variations

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-3.1: Very Long First Name

**File:** `tests/saucedemo-checkout/checkout-edge-cases.spec.ts`

**Steps:**
  1. Enter 50-character first name: 'JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn'
    - expect: Long input accepted without truncation error
  2. Fill remaining fields validly
    - expect: Other fields accept standard input
  3. Click 'Continue'
    - expect: Checkout proceeds with long name
    - expect: No character limit error
    - expect: Overview page displays with long name

#### 3.2. TC-3.2: Single Character Names

**File:** `tests/saucedemo-checkout/checkout-edge-cases.spec.ts`

**Steps:**
  1. Enter single character values: First Name='J', Last Name='D', Zip Code='1'
    - expect: Single characters accepted
    - expect: Not rejected as blank
    - expect: No minimum length error
  2. Click 'Continue'
    - expect: Validation passes
    - expect: Checkout proceeds to overview

#### 3.3. TC-3.3: Very Long Zip Code

**File:** `tests/saucedemo-checkout/checkout-edge-cases.spec.ts`

**Steps:**
  1. Enter 9-digit zip code: '123456789'
    - expect: Extended format accepted
    - expect: No validation error
  2. Complete checkout with valid name fields
    - expect: Checkout proceeds
    - expect: No maximum length restriction

#### 3.4. TC-3.4: Whitespace in Input Fields

**File:** `tests/saucedemo-checkout/checkout-edge-cases.spec.ts`

**Steps:**
  1. Enter fields with leading/trailing spaces: '  John  ', '  Doe  ', '  12345  '
    - expect: Whitespace accepted
    - expect: No validation error
  2. Click 'Continue'
    - expect: Checkout proceeds
    - expect: System either trims or preserves spaces

#### 3.5. TC-3.5: Space-Only Input Rejection

**File:** `tests/saucedemo-checkout/checkout-edge-cases.spec.ts`

**Steps:**
  1. Enter only spaces: '     ' in all three fields
    - expect: Either rejected as empty or accepted as content
  2. Click 'Continue'
    - expect: System validates space-only input appropriately

### 4. Navigation and Flow

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-4.1: Cancel from Checkout Information Page

**File:** `tests/saucedemo-checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Add items to cart and navigate to checkout information form
    - expect: Checkout form displays
  2. Click 'Cancel' button with back arrow
    - expect: User returns to cart page
    - expect: Cart page loads with 'Your Cart' title
  3. Verify cart items remain intact
    - expect: Cart items unchanged
    - expect: Item quantities preserved
    - expect: Cart totals same as before

#### 4.2. TC-4.2: Cancel from Order Overview Page

**File:** `tests/saucedemo-checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Complete checkout information form successfully
    - expect: Order overview page loads
  2. Click 'Cancel' button
    - expect: Return to cart page
    - expect: Overview does not progress
  3. Verify order not completed
    - expect: Cart page displays
    - expect: Items remain in cart
    - expect: No confirmation email/order created

#### 4.3. TC-4.3: Back to Products from Cart

**File:** `tests/saucedemo-checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Add items to cart and view cart
    - expect: Cart page displays with items
  2. Click 'Continue Shopping' button
    - expect: Return to inventory page
  3. Verify products page displays
    - expect: All products visible
    - expect: Product listing loads correctly
    - expect: Cart items preserved

#### 4.4. TC-4.4: Return to Products After Success

**File:** `tests/saucedemo-checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Complete full checkout successfully
    - expect: Success page displays
  2. Click 'Back Home' button
    - expect: Return to inventory/products page
  3. Verify products page loads
    - expect: All products display
    - expect: New shopping session can begin

#### 4.5. TC-4.5: Consistent Page Headers

**File:** `tests/saucedemo-checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Navigate through checkout pages and verify titles
    - expect: Checkout info page shows 'Checkout: Your Information'
    - expect: Overview page shows 'Checkout: Overview'
    - expect: Success page shows 'Checkout: Complete!'
  2. Verify consistent header elements across all pages
    - expect: Swag Labs logo present on all pages
    - expect: Menu button accessible on all pages
    - expect: Cart icon visible where applicable

### 5. Calculation and Display Verification

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-5.1: Verify Accurate Tax Calculation

**File:** `tests/saucedemo-checkout/checkout-calculations.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack ($29.99) and Bike Light ($9.99) to cart
    - expect: Items added to cart
  2. Complete checkout form and navigate to overview
    - expect: Order overview page loads
  3. Verify order summary calculations
    - expect: Item total shows $39.98 (29.99 + 9.99)
    - expect: Tax calculated as $3.20 (approximately 8%)
    - expect: Total shows $43.18 (39.98 + 3.20)
  4. Verify calculation accuracy to 2 decimal places
    - expect: All amounts shown with .XX format
    - expect: No rounding errors visible

#### 5.2. TC-5.2: Verify Totals with Different Item Combinations

**File:** `tests/saucedemo-checkout/checkout-calculations.spec.ts`

**Steps:**
  1. Add Backpack ($29.99) and Fleece Jacket ($49.99) to cart
    - expect: Items added
  2. Navigate to order overview
    - expect: Overview page displays
  3. Verify calculations
    - expect: Subtotal = $79.98 (29.99 + 49.99)
    - expect: Tax calculated correctly on $79.98
    - expect: Total calculations accurate

#### 5.3. TC-5.3: Order Overview Shows All Item Details

**File:** `tests/saucedemo-checkout/checkout-calculations.spec.ts`

**Steps:**
  1. Add multiple items to cart and complete checkout form
    - expect: Checkout proceeds to overview
  2. Verify each item displays:
    - expect: Quantity shown for each item
    - expect: Product name visible and correct
    - expect: Full product description displays
    - expect: Individual item price shows
  3. Verify item descriptions match inventory
    - expect: Descriptions are complete and accurate

#### 5.4. TC-5.4: Payment Information Display

**File:** `tests/saucedemo-checkout/checkout-calculations.spec.ts`

**Steps:**
  1. Complete checkout and navigate to overview
    - expect: Overview page loads
  2. Locate Payment Information section
    - expect: Payment Info section visible on page
  3. Verify payment method displays
    - expect: Shows 'SauceCard #31337'
    - expect: Information clearly formatted and visible

#### 5.5. TC-5.5: Shipping Information Display

**File:** `tests/saucedemo-checkout/checkout-calculations.spec.ts`

**Steps:**
  1. Complete checkout and view order overview
    - expect: Overview page displays
  2. Locate Shipping Information section
    - expect: Shipping Info section visible
  3. Verify shipping details
    - expect: Shows 'Free Pony Express Delivery!'
    - expect: Information clearly formatted

### 6. UI Validation and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-6.1: Form Labels and Placeholders

**File:** `tests/saucedemo-checkout/checkout-ui-validation.spec.ts`

**Steps:**
  1. Navigate to checkout information page
    - expect: Form displays with all fields visible
  2. Verify First Name field has label/placeholder 'First Name'
    - expect: Label or placeholder text clearly shows 'First Name'
  3. Verify Last Name field has label/placeholder 'Last Name'
    - expect: Label or placeholder shows 'Last Name'
  4. Verify Zip Code field has label/placeholder 'Zip/Postal Code'
    - expect: Label shows 'Zip/Postal Code'
  5. Verify field grouping and alignment
    - expect: Fields properly grouped and organized
    - expect: Fields aligned vertically
    - expect: Clear visual separation between fields

#### 6.2. TC-6.2: Error Message Display and Position

**File:** `tests/saucedemo-checkout/checkout-ui-validation.spec.ts`

**Steps:**
  1. Trigger form validation error by submitting empty form
    - expect: Error message appears
  2. Verify error banner positioning
    - expect: Error banner appears below form title
    - expect: Position is visible without scrolling
  3. Verify error message styling
    - expect: Red background for error
    - expect: White text for contrast
    - expect: High visibility red color
  4. Verify error icons next to fields
    - expect: Red X icons next to all required fields
    - expect: Icons clearly indicate error state
  5. Verify error can be dismissed
    - expect: X button on error banner is clickable
    - expect: Error banner dismisses when clicked

#### 6.3. TC-6.3: Button States and Clarity

**File:** `tests/saucedemo-checkout/checkout-ui-validation.spec.ts`

**Steps:**
  1. Navigate to checkout information page
    - expect: Page displays with two buttons
  2. Verify Primary button styling
    - expect: 'Continue' button has prominent green color
    - expect: Button text is clear and reads 'Continue'
  3. Verify Secondary button styling
    - expect: 'Cancel' button is less prominent
    - expect: Button text reads 'Cancel'
    - expect: Has back arrow icon
  4. Navigate to overview page and verify buttons
    - expect: 'Finish' button is green and prominent
    - expect: 'Cancel' button is secondary style

#### 6.4. TC-6.4: Form Layout and Responsiveness

**File:** `tests/saucedemo-checkout/checkout-ui-validation.spec.ts`

**Steps:**
  1. Observe checkout form layout
    - expect: Input fields stack vertically (one per row)
  2. Verify spacing between elements
    - expect: Consistent spacing between fields
    - expect: Proper padding around form
    - expect: Adequate whitespace
  3. Verify button positioning
    - expect: Buttons positioned at bottom of form
    - expect: Buttons horizontally aligned
    - expect: Cancel on left, Continue on right
  4. Verify form centering
    - expect: Form centered on page
    - expect: No overlapping elements
    - expect: Clear visual hierarchy

#### 6.5. TC-6.5: Page Header and Navigation Consistency

**File:** `tests/saucedemo-checkout/checkout-ui-validation.spec.ts`

**Steps:**
  1. Navigate through all checkout pages and verify headers
    - expect: Each page has descriptive title
    - expect: Titles clearly indicate current step
  2. Verify logo consistency
    - expect: Swag Labs logo present on all pages
    - expect: Logo styling consistent
  3. Verify menu accessibility
    - expect: Menu icon accessible on all checkout pages
    - expect: Menu toggle functions properly
  4. Verify cart icon where applicable
    - expect: Cart icon visible on inventory page
    - expect: Cart counter shows current item count
