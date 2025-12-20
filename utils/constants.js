// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  BUYER: 'buyer'
};

// User statuses
const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended'
};

// Order statuses
const ORDER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  CUTTING: 'Cutting',
  SEWING: 'Sewing',
  QUALITY_CHECK: 'Quality Check',
  SHIPPED: 'Shipped',
  IN_DELIVERY: 'In Delivery',
  DELIVERED: 'Delivered'
};

// Tracking statuses
const TRACKING_STATUS = [
  'Cutting',
  'Sewing',
  'Quality Check',
  'Shipped',
  'In Delivery',
  'Delivered'
];

// Payment methods
const PAYMENT_METHODS = {
  CASH: 'Cash on Delivery',
  ONLINE: 'Online Payment',
  BANK_TRANSFER: 'Bank Transfer'
};

// Product categories
const CATEGORIES = [
  'Shirt',
  'Pant',
  'Jacket',
  'Accessories',
  'Dress',
  'Sweater'
];

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  ORDER_STATUS,
  TRACKING_STATUS,
  PAYMENT_METHODS,
  CATEGORIES,
  HTTP_STATUS
};
