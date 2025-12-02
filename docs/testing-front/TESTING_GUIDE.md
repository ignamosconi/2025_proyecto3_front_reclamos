# Testing Guide - Password Reset Flow

## Manual Testing Steps

### 1. Test Forgot Password Page
```
URL: http://localhost:5173/forgot-password
```

**Steps:**
1. Navigate to `/forgot-password`
2. Enter a registered email (e.g., `test@example.com`)
3. Click "Continuar"
4. Check console/backend logs for the reset token
5. Verify toast success message appears
6. Verify redirect to `/sign-in` happens

**Expected Results:**
- ✓ Form validates email format
- ✓ API call to `POST /api/auth/forgot-password`
- ✓ Success toast with description
- ✓ Email sent (check logs or email)
- ✓ Redirect to sign-in page

### 2. Test Reset Password Page (Valid Token)
```
URL: http://localhost:5173/reset-password?token=YOUR_TOKEN_HERE
```

**Steps:**
1. Get a valid token from the backend (email or logs)
2. Navigate to `/reset-password?token=VALID_TOKEN`
3. Try entering different passwords to test validation:

**Test Cases:**

#### a) Too short password
```
Password: "Test1!"
Expected: Error "La contraseña debe tener al menos 8 caracteres."
```

#### b) Missing uppercase
```
Password: "test1234!"
Expected: Error "La contraseña debe contener al menos una letra mayúscula."
```

#### c) Missing lowercase
```
Password: "TEST1234!"
Expected: Error "La contraseña debe contener al menos una letra minúscula."
```

#### d) Missing number
```
Password: "TestPassword!"
Expected: Error "La contraseña debe contener al menos un número."
```

#### e) Missing special character
```
Password: "TestPass1234"
Expected: Error "La contraseña debe contener al menos un carácter especial."
```

#### f) Multiple errors at once
```
Password: "test"
Expected: Multiple errors shown together:
1. La contraseña debe tener al menos 8 caracteres.
2. La contraseña debe contener al menos una letra mayúscula.
3. La contraseña debe contener al menos un número.
4. La contraseña debe contener al menos un carácter especial.
```

#### g) Weak pattern (common password)
```
Password: "Password123!"
Expected: Error about containing common patterns
```

#### h) Password mismatch
```
Password: "ValidPass123!"
Confirm: "ValidPass123"
Expected: Error "Las contraseñas no coinciden."
```

#### i) Valid password
```
Password: "MiNuevaPass123!"
Confirm: "MiNuevaPass123!"
Expected: Success, redirect to login
```

**Expected Results:**
- ✓ Form shows info alert with requirements
- ✓ All validation errors shown together
- ✓ Multi-line error display works correctly
- ✓ API call to `POST /api/auth/reset-password` with token and password
- ✓ Success toast with description
- ✓ Automatic redirect to `/sign-in` after 1.5 seconds

### 3. Test Reset Password Page (Invalid/Missing Token)

#### a) No token in URL
```
URL: http://localhost:5173/reset-password
```
**Expected:**
- ✓ Shows alert "Enlace inválido"
- ✓ Shows error description about invalid/expired link
- ✓ Shows link to request new token

#### b) Invalid/Expired token
```
URL: http://localhost:5173/reset-password?token=INVALID_TOKEN
```
**Steps:**
1. Navigate with invalid token
2. Try to submit form
3. Should receive error from backend

**Expected:**
- ✓ Form renders
- ✓ On submit, shows error toast
- ✓ Error message mentions "expirado" or "inválido"

### 4. Test Sign Up with Enhanced Validation
```
URL: http://localhost:5173/sign-up
```

**Steps:**
1. Fill in all fields
2. Test password validation (same rules as reset-password)
3. Verify all errors show together

**Expected Results:**
- ✓ Same password validation as reset-password
- ✓ Multiple errors shown at once
- ✓ Validates against email, firstName, lastName
- ✓ Shows error if password contains personal data

**Example:**
```
Email: "john@example.com"
First Name: "John"
Password: "JohnTest123!" 
Expected: Error about containing personal data ("john")
```

## API Endpoints Used

### Forgot Password
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
Response: { "message": "Email sent successfully" }
```

### Reset Password
```
POST /api/auth/reset-password
Body: { 
  "token": "c8737d2479183629023dcd2f4e608fb5d9fc976591beb9d7b4256a4b936a0f42",
  "password": "NewPassword123!"
}
Response: { "message": "Password reset successfully" }
```

## Password Requirements Checklist

Use this to verify validation works:
- [ ] Minimum 8 characters
- [ ] At least 1 uppercase letter (A-Z)
- [ ] At least 1 lowercase letter (a-z)
- [ ] At least 1 number (0-9)
- [ ] At least 1 special character (!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`)
- [ ] Not contain common patterns (password, 123456, qwerty, etc.)
- [ ] Not contain personal data (email, first name, last name)

## Common Issues & Debugging

### Token not working
- Check backend logs for the actual token
- Verify token hasn't expired (1 hour limit)
- Check URL encoding of token in query params

### Validation not showing all errors
- Verify `whitespace-pre-line` class is on FormMessage
- Check `formatPasswordErrors` returns newline-separated string

### Email not sent
- Check backend email service configuration
- Check spam folder
- Check backend logs for email sending errors

### API errors
- Open browser DevTools > Network tab
- Check request payload
- Check response status and message
- Verify API_BASE_URL in environment variables
