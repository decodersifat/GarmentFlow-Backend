const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePhoneNumber = (phone) => {
  // Simple validation - can be customized based on requirements
  const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
  return phoneRegex.test(phone);
};

const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return false;
  }
  return true;
};

const validateQuantity = (quantity, min, max) => {
  const qty = parseInt(quantity);
  return qty >= min && qty <= max;
};

const validateAddress = (address) => {
  return address && address.trim().length >= 10;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateName,
  validateQuantity,
  validateAddress
};
