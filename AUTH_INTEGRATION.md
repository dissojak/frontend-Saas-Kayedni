# Authentication Integration Guide

This document explains how the frontend authentication system is integrated with the Spring Boot backend.

## Overview

The authentication system uses JWT tokens for secure authentication and includes:
- User Registration (Signup)
- Email Activation
- User Login
- Token Management

## Backend API Endpoints

### Base URL
```
http://localhost:8088/api/v1/auth
```

### 1. Signup
**Endpoint:** `POST /v1/auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+33612345678", // optional
  "avatarUrl": "https://example.com/avatar.jpg", // optional
  "role": "CLIENT" // CLIENT, BUSINESS_OWNER, STAFF, ADMIN
}
```

**Response:**
```json
{
  "token": null,
  "refreshToken": null,
  "userId": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "CLIENT",
  "message": "Signup successful. Please check your email to activate your account."
}
```

### 2. Login
**Endpoint:** `POST /v1/auth/login`

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "CLIENT",
  "message": "Login successful"
}
```

### 3. Activate Account
**Endpoint:** `GET /v1/auth/activate?token=<uuid>`

**Response:**
```json
{
  "message": "Your account has been successfully activated. You can now log in."
}
```

## Frontend Implementation

### File Structure
```
src/app/(pages)/(auth)/
├── api/
│   └── auth.api.ts           # API service layer
├── context/
│   └── AuthContext.tsx       # Auth context provider
├── login/
│   ├── components/
│   ├── hooks/
│   │   └── useLogin.tsx      # Login hook
│   ├── utils/
│   │   └── index.ts          # Login utilities
│   └── page.tsx
├── register/
│   ├── components/
│   ├── hooks/
│   │   └── useRegister.tsx   # Register hook
│   ├── utils/
│   │   └── index.ts          # Register utilities
│   └── page.tsx
├── activate/
│   └── page.tsx              # Email activation page
├── utils/
│   └── token.utils.ts        # Token management
└── types/
    └── index.ts              # Type definitions
```

### Environment Variables

Create a `.env.local` file in the root of your frontend project:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8088/api
NEXT_PUBLIC_AUTH_URL=http://localhost:8088/api/v1/auth
```

### Role Mapping

The frontend uses lowercase role names while the backend uses uppercase:

| Frontend | Backend |
|----------|---------|
| `client` | `CLIENT` |
| `business` | `BUSINESS_OWNER` |
| `staff` | `STAFF` |
| `admin` | `ADMIN` |

### Token Storage

JWT tokens are stored in localStorage:
- **Access Token**: `accessToken` (valid for 24 hours)
- **Refresh Token**: `refreshToken` (valid for 7 days)

### Authentication Flow

#### Registration Flow
1. User fills registration form
2. Frontend sends POST request to `/v1/auth/signup`
3. Backend creates user with `PENDING` status
4. Backend sends activation email
5. User receives success message
6. User redirected to login page

#### Activation Flow
1. User clicks activation link in email
2. Frontend extracts token from URL
3. Frontend sends GET request to `/v1/auth/activate?token=<uuid>`
4. Backend activates account
5. User can now login

#### Login Flow
1. User fills login form
2. Frontend sends POST request to `/v1/auth/login`
3. Backend validates credentials
4. Backend returns JWT tokens
5. Frontend stores tokens in localStorage
6. User redirected to dashboard

### Making Authenticated Requests

To make authenticated API calls, include the JWT token in the Authorization header:

```typescript
import { getAuthHeader } from '@/(pages)/(auth)/utils/token.utils';

const response = await fetch('http://localhost:8088/api/some-endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(), // Adds: Authorization: Bearer <token>
  },
});
```

## Usage Examples

### Registration

```typescript
import { useRegister } from '@/(pages)/(auth)/register/hooks/useRegister';

function RegisterComponent() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    role, setRole,
    acceptedTerms, setAcceptedTerms,
    loading,
    error,
    onSubmit
  } = useRegister();

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {/* Form fields */}
    </form>
  );
}
```

### Login

```typescript
import { useLogin } from '@/(pages)/(auth)/login/hooks/useLogin';

function LoginComponent() {
  const {
    email, setEmail,
    password, setPassword,
    role, setRole,
    loading,
    error,
    submit
  } = useLogin();

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      {/* Form fields */}
    </form>
  );
}
```

## Error Handling

The system handles various error scenarios:

- **Invalid credentials**: "Email or password incorrect"
- **Account not activated**: "Please activate your account using the activation email sent to you"
- **Account suspended**: "Your account has been suspended. Please contact support."
- **Email already exists**: "A user with this email already exists"
- **Invalid activation token**: "Invalid activation token"
- **Expired activation token**: "The activation token has expired"

## Testing

### Prerequisites
1. Backend server running on `http://localhost:8088`
2. MySQL database configured
3. Email SMTP configured (for activation emails)

### Test Flow
1. Start backend: `cd backend-Saas_Bookify && ./mvnw spring-boot:run`
2. Start frontend: `cd frontend-bookify_saas && npm run dev`
3. Navigate to `http://localhost:3000/register`
4. Register a new user
5. Check email for activation link
6. Click activation link or visit `/activate?token=<uuid>`
7. Login with activated credentials

## Security Notes

- Passwords are encrypted with BCrypt on the backend
- JWT tokens expire after 24 hours (access) and 7 days (refresh)
- Activation tokens expire after 7 days
- All API calls should be made over HTTPS in production
- Never commit `.env.local` to version control
- Store sensitive tokens securely

## Troubleshooting

### "Failed to fetch" error
- Ensure backend is running on correct port (8088)
- Check CORS configuration in backend
- Verify `NEXT_PUBLIC_AUTH_URL` is set correctly

### Email not received
- Check spam folder
- Verify SMTP configuration in `application.properties`
- Check backend logs for email sending errors

### Token expired
- Implement token refresh logic using refresh token
- Or require user to login again

## Next Steps

1. **Implement Token Refresh**: Add automatic token refresh using refresh token
2. **Add Password Reset**: Implement forgot password flow
3. **Add Social Login**: Integrate OAuth providers (Google, Facebook, etc.)
4. **Improve Error Messages**: Add user-friendly error notifications
5. **Add Loading States**: Improve UX with skeleton loaders
6. **Add Form Validation**: Client-side validation before API calls
