# Analytics Events Reference

## Custom Events

Events routed through the generic `trackEvent()` are sent to **Amplitude, LogRocket, and Hotjar/Contentsquare**. Events routed through dedicated helper functions (`trackUserLogin`, `trackAddToCart`, etc.) are sent to **Amplitude and LogRocket only**.

| Event                             | Services              | Triggered when                                                                      |
| --------------------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `Page Viewed`                     | Amplitude + LogRocket | Every call to `trackPageView()` (supplements Amplitude autocapture)                 |
| `User Login`                      | Amplitude + LogRocket | User successfully authenticates (`AuthContext`)                                     |
| `Login Attempted`                 | All                   | Login form is submitted or a dev-mode user button is clicked (`LoginPage`)          |
| `Login Failed`                    | All                   | Login throws an error (`LoginPage`)                                                 |
| `Navigated to Home`               | All                   | Home page mounts (`HomePage`)                                                       |
| `Navigated to About`              | All                   | About page mounts (`AboutPage`)                                                     |
| `Navigated to Profile`            | All                   | Profile page mounts (`ProfilePage`)                                                 |
| `Product Card Clicked`            | All                   | A product card is clicked in the product grid (`ProductCard`)                       |
| `Product Selected`                | Amplitude + LogRocket | Product detail page loads its data (`ProductDetailPage`)                            |
| `Add to Cart`                     | Amplitude + LogRocket | User clicks "Add to Cart" on a product detail page (`ProductDetailPage`)            |
| `Remove from Cart`                | Amplitude + LogRocket | An item is removed from the cart (`CartContext`)                                    |
| `Cart Quantity Updated`           | All                   | User changes an item's quantity in the cart (`CartContext`)                         |
| `Cart Cleared`                    | All                   | The entire cart is cleared (`CartContext`)                                          |
| `Cart Icon Clicked`               | All                   | User clicks the cart icon in the navigation (`AppLayout`)                           |
| `Search`                          | Amplitude + LogRocket | Search query or filter changes, debounced 300 ms, only when active (`ProductsPage`) |
| `Sort Changed`                    | All                   | User changes the sort dropdown on the products page (`ProductsPage`)                |
| `Filter Toggled`                  | All                   | A category, size, or color checkbox is checked or unchecked (`FilterSidebar`)       |
| `Filter Removed`                  | All                   | A filter badge's X button is clicked (`ProductsPage`)                               |
| `Checkout Started`                | Amplitude + LogRocket | Checkout page mounts with a non-empty cart (`CheckoutPage`)                         |
| `Checkout Form Validation Failed` | All                   | Shipping form is submitted with invalid fields (`CheckoutPage`)                     |
| `Checkout Form Submitted`         | All                   | Shipping form passes validation and user proceeds to payment (`CheckoutPage`)       |
| `Order Placed`                    | Amplitude + LogRocket | Payment is completed successfully (`PaymentPage`)                                   |
| `Theme Toggled`                   | All                   | User clicks the light/dark theme toggle in the nav (`AppLayout`)                    |

---

## Amplitude Autocapture Events

Tracked automatically — no custom code required.

| Event                         | Triggered when                         |
| ----------------------------- | -------------------------------------- |
| `[Amplitude] Page Viewed`     | Every route change                     |
| `[Amplitude] Element Clicked` | Any button, link, or clickable element |
| `[Amplitude] Form Started`    | User focuses the first field in a form |
| `[Amplitude] Form Submitted`  | Form submit action                     |
| `[Amplitude] Page Left`       | User navigates away or closes the tab  |

---

## Service-Specific Events

| Event                    | Service        | Triggered when                                                                  |
| ------------------------ | -------------- | ------------------------------------------------------------------------------- |
| `fingerprint_identified` | Hotjar only    | Fingerprint visitor ID is set at app startup (`setFingerprintId`)               |
| `user_logged_out`        | Hotjar only    | User logs out (`resetUser`)                                                     |
| Exception capture        | LogRocket only | `captureError` is called with an `Error` object (exported but currently unused) |
