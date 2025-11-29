# User Management System - Frontend

React frontend for User Management System with admin dashboard.

## Quick Start

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at http://localhost:3000

## Features

- Admin login with JWT authentication
- User list with search and filters
- User details view
- User edit with profile image upload
- Automatic token refresh
- Protected routes

## Environment

The frontend is configured to connect to the backend at `http://localhost:5000`.

To change this, edit `src/api.js` and update the `API_BASE_URL` constant.

## Usage

1. **Login**: Use admin credentials at `/login`
2. **View Users**: Browse paginated user list
3. **Search**: Filter by name, email, phone, state, or city
4. **View Details**: Click "View" button
5. **Edit User**: Click "Edit" button
6. **Delete User**: Click "Delete" button (requires confirmation)

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── api.js           # Axios configuration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
└── vite.config.js
```

## Default Admin Credentials

After creating an admin user in the backend (see main README), use those credentials to login.

Example:
- Email: `admin@example.com`
- Password: `admin123`

## API Integration

The `src/api.js` file configures axios with:
- Base URL pointing to backend
- Request interceptor to attach JWT tokens
- Response interceptor for automatic token refresh
- Error handling for expired tokens
