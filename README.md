# User Management System - MERN Stack

A full-stack user management system with JWT authentication, role-based access control, and profile image upload functionality.

## Features

- **Authentication**: JWT-based auth with access tokens (1h) and refresh tokens (7d)
- **Role-based Access**: Admin and User roles with protected routes
- **User CRUD**: Create, read, update, and delete users
- **Profile Images**: Upload profile pictures (JPG/PNG, max 2MB)
- **Search & Filters**: Search by name/email/phone, filter by state/city
- **Pagination**: Efficient data loading with pagination
- **Security**: Helmet, CORS, rate limiting, bcrypt password hashing
- **Validation**: Comprehensive input validation on backend and frontend

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt for password hashing
- Multer for file uploads
- express-validator for input validation
- Helmet + CORS for security
- Morgan for logging

### Frontend
- React 18 with Vite
- React Router v6
- Axios with interceptors (auto token refresh)
- Responsive CSS

## Project Structure

```
harvee/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── upload.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── utils/
│   │   └── token.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── AdminLogin.jsx
    │   │   ├── UserEdit.jsx
    │   │   ├── UsersList.jsx
    │   │   └── UserView.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```powershell
cd server
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file (copy from `.env.example`):
```powershell
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/user-management
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
CLIENT_URL=http://localhost:3000
```

5. Start the server:
```powershell
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```powershell
cd client
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

Client will run on http://localhost:3000

## Creating an Admin User

Since registration defaults to 'user' role, you need to create an admin user manually:

### Option 1: Using MongoDB Shell
```javascript
use user-management
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  phone: "1234567890",
  password: "$2b$10$YourHashedPasswordHere", // Generate using bcrypt
  state: "California",
  city: "San Francisco",
  country: "USA",
  pincode: "94102",
  role: "admin",
  created_at: new Date(),
  updated_at: new Date()
})
```

### Option 2: Register via API then update role
1. Register a user via POST `/api/auth/register`
2. Update the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 3: Use the provided script
Create a file `createAdmin.js` in the server folder:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: hashedPassword,
      state: 'California',
      city: 'San Francisco',
      country: 'USA',
      pincode: '94102',
      role: 'admin'
    });
    
    // Bypass pre-save hook by setting isModified
    admin.isModified = () => false;
    await admin.save();
    
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run it:
```powershell
node createAdmin.js
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: multipart/form-data

Fields:
- name: string (min 3 chars, alphabets & spaces only)
- email: string (valid email, unique)
- phone: string (10-15 digits, unique)
- password: string (min 6 chars, must contain digit)
- address: string (optional, max 150 chars)
- state: string (required)
- city: string (required)
- country: string (required)
- pincode: string (4-10 digits)
- profile_image: file (JPG/PNG, max 2MB)
```

Response (201):
```json
{
  "message": "User registered",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "email@example.com or phone",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}
```

Response (200):
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### User Endpoints (Protected)

#### Get All Users (Admin only)
```http
GET /api/users?page=1&limit=10&search=john&state=CA&city=LA
Authorization: Bearer <access_token>
```

#### Get User by ID (Admin or self)
```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### Update User (Admin or self)
```http
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### Delete User (Admin only)
```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

## Sample cURL Commands

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "password=pass123" \
  -F "state=California" \
  -F "city=Los Angeles" \
  -F "country=USA" \
  -F "pincode=90001" \
  -F "address=123 Main St" \
  -F "profile_image=@/path/to/image.jpg"
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@example.com","password":"pass123"}'
```

### Get users (with token):
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Validation Rules

### Registration/Update
- **Name**: Min 3 chars, alphabets and spaces only
- **Email**: Valid email format, unique
- **Phone**: 10-15 digits, unique
- **Password**: Min 6 chars, must contain at least one digit
- **Address**: Optional, max 150 chars
- **State/City/Country**: Required
- **Pincode**: 4-10 digits
- **Profile Image**: JPG/PNG only, max 2MB

## Security Features

- JWT tokens with short expiry (1h access, 7d refresh)
- Password hashing with bcrypt (10 rounds)
- Helmet middleware for HTTP headers
- CORS with credentials support
- Rate limiting on auth routes (100 req/15min)
- Input validation on all endpoints
- Sanitized responses (no password/token fields)
- Secure file upload with type and size validation

## Error Handling

All errors return consistent JSON format:

### Validation Error (400):
```json
{
  "errors": [
    { "field": "email", "msg": "Invalid email" }
  ]
}
```

### Auth Error (401):
```json
{
  "message": "Invalid credentials"
}
```

### Forbidden (403):
```json
{
  "message": "Admin access required"
}
```

## Frontend Usage

1. **Login**: Navigate to `/login` and enter admin credentials
2. **View Users**: See paginated list with search and filters
3. **View Details**: Click "View" to see full user profile
4. **Edit User**: Click "Edit" to modify user details
5. **Delete User**: Click "Delete" (admin only)
6. **Logout**: Use logout button in header

## Development Notes

- Backend uses ES modules (`type: "module"`)
- Frontend built with Vite for fast development
- Axios interceptors handle token refresh automatically
- File uploads stored in `server/uploads/` directory
- MongoDB unique constraints handle duplicate prevention

## License

ISC
