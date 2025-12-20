const validateProductInput = (req, res, next) => {
  const { name, price, availableQuantity, minimumOrderQuantity } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!price || price <= 0) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (!availableQuantity || availableQuantity < 0) {
    return res.status(400).json({ message: 'Available quantity must be non-negative' });
  }

  if (!minimumOrderQuantity || minimumOrderQuantity <= 0) {
    return res.status(400).json({ message: 'Minimum order quantity must be greater than 0' });
  }

  if (minimumOrderQuantity > availableQuantity) {
    return res.status(400).json({ message: 'Minimum order quantity cannot exceed available quantity' });
  }

  next();
};

const validateOrderInput = (req, res, next) => {
  const { quantity, firstName, lastName, contactNumber, deliveryAddress } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  if (!firstName || firstName.trim() === '') {
    return res.status(400).json({ message: 'First name is required' });
  }

  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({ message: 'Last name is required' });
  }

  if (!contactNumber || contactNumber.trim() === '') {
    return res.status(400).json({ message: 'Contact number is required' });
  }

  if (!deliveryAddress || deliveryAddress.trim() === '') {
    return res.status(400).json({ message: 'Delivery address is required' });
  }

  next();
};

module.exports = { validateProductInput, validateOrderInput };
