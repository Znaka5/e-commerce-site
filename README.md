# E-Commerce SPA - "Items 4 Trade"

**Angular SoftUni Exam Project | July 2025**

This project is a **Single Page Application (SPA)** built with **Angular**, designed as an e-commerce platform called **"Items 4 Trade"**. The app allows users to browse a catalog of products, view best sellers, manage profiles, handle shopping carts, place orders, rate products, and more—all in a responsive, intuitive interface.

---

## Features

### 1. Catalog
- Browse all available products.
- Filter and search products by category, name, price, or rating.
- Pagination support for large catalogs.
- Quick view and "Add to Cart" directly from catalog items.

### 2. Best Sellers
- Highlights the most popular products.
- Dynamic updates based on user interactions and purchases.

### 3. Product Details
- Detailed product pages with multiple images, descriptions, price, and ratings.
- Add, update, or remove product reviews.
- "Add to Cart" functionality directly from product pages.

### 4. Shopping Cart & Ordering
- Add, remove, and adjust quantities of products.
- Display total price dynamically.
- Persist cart items per user session.
- Place orders and receive confirmation.
- Track past orders in the user profile.

### 5. User Profile & Authentication
- **Register / Login** system for personalized experience.
- View and edit user profile details.
- Update password and contact information.
- Track order history and saved items.

### 6. Product Management (for admins or sellers)
- Add new items to the catalog.
- Edit existing items (name, price, description, images).
- Delete items from the catalog.
- Manage item availability and stock.

### 7. Ratings & Reviews
- Users can rate products from 1 to 5 stars.
- Leave reviews and comments on products.
- Display average ratings on catalog and product pages.

### 8. Search Functionality
- Quick and advanced search across catalog.
- Filter results by category, price, rating, or best-seller status.

---

## Project Structure

The app is organized into multiple Angular components for modularity and reusability:

- **CatalogComponent** – displays the product catalog.
- **BestSellersComponent** – showcases top-selling items.
- **ProductDetailComponent** – shows detailed product information.
- **CartComponent** – manages shopping cart actions.
- **ProfileComponent** – user profile and order history management.
- **LoginComponent** – authentication for users.
- **RegisterComponent** – new user registration.
- **SearchComponent** – search bar and filter handling.
- **NavbarComponent** – navigation across the SPA.
- **ItemFormComponent** – add/edit products (for admins or sellers).
- **ReviewComponent** – submit and display ratings/reviews.
- **OrderComponent** – review and confirm orders.

---

## Motivation & Inspiration

"Items 4 Trade" is designed to simulate a **full-featured e-commerce experience** for learning purposes. The project focuses on:

- Practicing **Angular SPA development**.
- Building modular, reusable components.
- Implementing state management, routing, and authentication.
- Enhancing UI/UX with responsive and interactive design.