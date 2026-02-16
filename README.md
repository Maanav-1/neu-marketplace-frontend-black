# NEU Marketplace

A minimalist, community-driven marketplace built for Northeastern University students to buy and sell items. This is an independent student project and is not affiliated with the university.

## Features

### User & Authentication

* **Secure Auth**: Traditional email/password signup with a 6-digit verification code system.
* **Google OAuth**: Integration for quick sign-in via Google.
* **Account Management**: Profile updates, password changes, and specialized views for "My Listings" and "Saved Items".

### Marketplace Features

* **Browsing**: Search and filter items by category, price range, and condition.
* **Listings**: Support for up to 5 images per post, markdown descriptions, and automated expiry dates.
* **Communication**: Real-time chat interface (polling-based) allowing buyers and sellers to coordinate directly.
* **Seller Tools**: "Bump" functionality to renew posts and a simple "Mark as Sold" toggle.

### Admin & Moderation

* **Dashboard**: High-level overview of user growth, listing statistics, and category breakdowns.
* **User Management**: Ability for admins to block/unblock accounts or promote users to admin roles.
* **Content Moderation**: A dedicated reporting system for users to flag prohibited items, with an admin queue for resolution.

## Tech Stack

* **Framework**: React 18 with Vite
* **Language**: TypeScript
* **State Management**: Zustand (for Authentication)
* **Styling**: Tailwind CSS with Shadcn/UI components
* **Icons & Animation**: Lucide React and Framer Motion
* **API Client**: Axios with interceptors for JWT handling

## Setup

1. **Clone and Install**:
```bash
npm install

```


2. **Environment Variables**:
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_backend_api_url
VITE_AUTH_URL=your_auth_server_url

```


3. **Development**:
```bash
npm run dev

```



## Project Structure

* `src/api/`: Axios client configuration and interceptors.
* `src/components/`: Reusable UI components including Shadcn primitives.
* `src/hooks/`: Custom hooks for toasts and UI state.
* `src/pages/`: Main application views and Admin sub-directory.
* `src/store/`: Zustand store for global authentication state.
* `src/types/`: TypeScript interfaces for listings, users, and chat.
