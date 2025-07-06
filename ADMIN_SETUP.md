# Admin Setup Guide

## Overview

This application implements a role-based authentication system where:

- ✅ **Only users can register** (sign up) - Regular users and NGOs can create accounts
- ✅ **Admin accounts cannot be self-created** - Only login with credentials provided by head admin
- ✅ **Different routes/views for user and admin** - Separate dashboards and functionality

## Admin Account Creation

Since admin accounts cannot be created through the registration form, they must be created manually using the provided script.

### Step 1: Create Admin User

Run the following command in the server directory:

```bash
cd server
npm run create-admin
```

This will create an admin user with the following default credentials:
- **Email**: admin@ecocycle.com
- **Password**: admin123456
- **Role**: admin

### Step 2: Change Default Password

⚠️ **IMPORTANT**: After first login, immediately change the default password through the profile settings.

### Step 3: Create Additional Admins (Optional)

To create additional admin users, you can:

1. Modify the `server/scripts/createAdmin.js` file with new admin details
2. Run the script again, or
3. Use the admin dashboard to create new admin accounts (if implemented)

## Role-Based Access

### User Roles

1. **user** - Regular users who can:
   - Schedule pickups
   - View their own pickup history
   - Access marketplace
   - Update their profile

2. **ngo** - NGO/Recycler users who can:
   - All user permissions
   - View and manage pickup requests
   - Update pickup statuses

3. **admin** - System administrators who can:
   - All NGO permissions
   - Manage all users
   - Access admin dashboard
   - View system statistics
   - Assign pickups to NGOs

### Route Protection

- `/dashboard` - Available to all authenticated users
- `/admin/dashboard` - Admin only
- `/admin/users` - Admin only
- `/admin/pickups` - Admin and NGO
- `/qr-scanner` - Admin and NGO

## Admin Dashboard Features

The admin dashboard provides:

- **Statistics Overview**: Total users, pickups, pending requests, completed pickups, products
- **Quick Actions**: Links to manage users, pickups, and QR scanner
- **Recent Pickups**: Table showing latest pickup requests with status
- **User Management**: View, edit, and manage user accounts
- **Pickup Management**: View and manage all pickup requests

## Security Notes

1. **Admin Registration Disabled**: The registration form no longer includes admin as an option
2. **Server-Side Validation**: The server validates that only 'user' and 'ngo' roles can be created through registration
3. **Role-Based Routing**: Different routes are protected based on user roles
4. **Manual Admin Creation**: Admin accounts must be created manually using the script

## Troubleshooting

### Admin Login Issues

If you cannot log in as admin:

1. Verify the admin user was created successfully
2. Check the MongoDB connection
3. Ensure the correct email and password are being used
4. Check if the user account is active

### Permission Issues

If you're getting permission errors:

1. Verify your user role is set to 'admin' in the database
2. Check that the JWT token is valid
3. Ensure you're accessing the correct routes for your role

## Database Schema

The User model includes:

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'ngo', 'admin']),
  phone: String,
  address: Object,
  organization: String,
  isActive: Boolean
}
```

## API Endpoints

### Admin-Only Endpoints

- `GET /admin/dashboard/stats` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `PATCH /admin/users/:id/toggle-status` - Toggle user active status

### Admin/NGO Endpoints

- `GET /admin/pickups` - Get all pickup requests
- `PATCH /admin/pickups/:id/status` - Update pickup status
- `PATCH /admin/pickups/:id/assign` - Assign pickup to NGO (admin only) 