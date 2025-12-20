# API Documentation

## Base URL
```
http://localhost:5000/api
https://your-deployed-api.com/api
```

## Authentication
All protected endpoints require:
- JWT token in cookies or Authorization header
- `Authorization: Bearer <token>`

---

## Auth Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "photoURL": "https://example.com/photo.jpg",
  "role": "buyer"
}

Response: 201
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

### Google OAuth
```http
POST /auth/google-login
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@gmail.com",
  "photoURL": "https://..."
}

Response: 200
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

---

## Product Endpoints

### Get All Products
```http
GET /products?page=1&limit=10&category=Shirt&search=cotton&minPrice=10&maxPrice=100

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- category: Product category filter
- search: Search in name/description
- minPrice: Minimum price filter
- maxPrice: Maximum price filter
- sortBy: 'name', 'price_asc', 'price_desc', 'newest'

Response: 200
{
  "success": true,
  "total": 50,
  "products": [ ... ]
}
```

### Get Product Details
```http
GET /products/:id

Response: 200
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Cotton T-Shirt",
    "price": 29.99,
    "description": "...",
    "images": ["url1", "url2"],
    "category": "Shirt",
    "availableQuantity": 100,
    "minimumOrderQuantity": 5,
    "paymentOptions": ["Cash on Delivery", "Online Payment"]
  }
}
```

### Create Product (Manager/Admin)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cotton T-Shirt",
  "description": "High quality cotton T-shirt",
  "category": "Shirt",
  "price": 29.99,
  "availableQuantity": 100,
  "minimumOrderQuantity": 5,
  "images": ["url1", "url2", "url3"],
  "demoVideoLink": "https://youtube.com/...",
  "paymentOptions": ["Cash on Delivery", "Online Payment"],
  "showOnHome": true
}

Response: 201
{
  "success": true,
  "data": { ... }
}
```

### Update Product (Manager/Admin)
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 34.99,
  ...
}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

### Delete Product (Manager/Admin)
```http
DELETE /products/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Product deleted"
}
```

---

## Order Endpoints

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "quantity": 10,
  "firstName": "John",
  "lastName": "Doe",
  "contactNumber": "+1234567890",
  "deliveryAddress": "123 Main St",
  "additionalNotes": "Rush delivery",
  "paymentMethod": "Cash on Delivery"
}

Response: 201
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "status": "Pending",
    "totalPrice": 299.90
  }
}
```

### Get My Orders
```http
GET /orders/user/my-orders?status=Pending&page=1&limit=10
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "orders": [ ... ],
  "total": 5
}
```

### Get All Orders (Admin)
```http
GET /orders/admin/all?status=Delivered&page=1
Authorization: Bearer <token>
(Admin only)

Response: 200
{
  "success": true,
  "orders": [ ... ]
}
```

### Approve Order (Manager)
```http
PATCH /orders/:orderId/approve
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Order approved"
}
```

### Reject Order (Manager)
```http
PATCH /orders/:orderId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Out of stock"
}

Response: 200
{
  "success": true,
  "message": "Order rejected"
}
```

### Cancel Order (Buyer)
```http
PATCH /orders/:orderId/cancel
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Order cancelled"
}
```

---

## Tracking Endpoints

### Get Order Tracking
```http
GET /tracking/:orderId
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "updates": [
      {
        "status": "Cutting",
        "location": "Factory Floor A",
        "notes": "Cutting in progress",
        "timestamp": "2024-01-10T10:30:00Z"
      },
      ...
    ]
  }
}
```

### Add Tracking Update (Manager)
```http
POST /tracking/:orderId/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Sewing",
  "location": "Sewing Department",
  "notes": "Stitching started",
  "image": "https://..."
}

Response: 200
{
  "success": true,
  "message": "Tracking updated"
}
```

---

## User Endpoints

### Get All Users (Admin)
```http
GET /users?page=1&status=pending
Authorization: Bearer <token>
(Admin only)

Response: 200
{
  "success": true,
  "users": [ ... ]
}
```

### Get Current User
```http
GET /users/current/me
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "user": { ... }
}
```

### Get User Profile
```http
GET /users/profile/:userId
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "user": { ... }
}
```

### Approve User (Admin)
```http
PATCH /users/:userId/approve
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "User approved"
}
```

### Suspend User (Admin)
```http
PATCH /users/:userId/suspend
Authorization: Bearer <token>
Content-Type: application/json

{
  "suspendReason": "Policy violation",
  "suspendFeedback": "Please contact support"
}

Response: 200
{
  "success": true,
  "message": "User suspended"
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
```http
GET /dashboard/stats
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "totalOrders": 150,
    "totalProducts": 30,
    "approvedUsers": 45
  }
}
```

### Get Recent Activity
```http
GET /dashboard/activity?limit=10
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [ ... ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "error": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Not found",
  "error": "Product not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Testing with Postman

1. Import the API collection
2. Set {{base_url}} to `http://localhost:5000/api`
3. Use pre-request scripts for auth token
4. Test each endpoint with sample data

---

## Rate Limiting

Protected endpoints: 100 requests per 15 minutes
Public endpoints: 1000 requests per 15 minutes

---

**Last Updated**: December 2025
