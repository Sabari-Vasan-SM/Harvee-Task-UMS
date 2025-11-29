# User Management System - Backend

Backend API for User Management System with JWT authentication.

## Quick Start

```powershell
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URI=mongodb://localhost:27017/user-management
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token

### User Routes (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin or self)
- `PUT /api/users/:id` - Update user (Admin or self)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "password=pass123" \
  -F "state=California" \
  -F "city=Los Angeles" \
  -F "country=USA" \
  -F "pincode=90001"
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@example.com","password":"pass123"}'
```

## Project Structure

```
server/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # Uploaded files
└── server.js        # Entry point
```

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcrypt - Password hashing
- jsonwebtoken - JWT tokens
- multer - File uploads
- express-validator - Input validation
- helmet - Security headers
- cors - CORS middleware
- dotenv - Environment variables
- morgan - Request logging
- express-rate-limit - Rate limiting
