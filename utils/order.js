const { ORDER_STATUS, TRACKING_STATUS } = require('./constants');

const calculateOrderTotal = (price, quantity) => {
  return parseFloat((price * quantity).toFixed(2));
};

const isValidOrderStatus = (status) => {
  return Object.values(ORDER_STATUS).includes(status);
};

const isValidTrackingStatus = (status) => {
  return TRACKING_STATUS.includes(status);
};

const getNextTrackingStatus = (currentStatus) => {
  const index = TRACKING_STATUS.indexOf(currentStatus);
  if (index === -1 || index === TRACKING_STATUS.length - 1) {
    return null;
  }
  return TRACKING_STATUS[index + 1];
};

const canUpdateOrderStatus = (currentStatus, newStatus) => {
  const statusFlow = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.APPROVED, ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.APPROVED]: [ORDER_STATUS.CUTTING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CUTTING]: [ORDER_STATUS.SEWING],
    [ORDER_STATUS.SEWING]: [ORDER_STATUS.QUALITY_CHECK],
    [ORDER_STATUS.QUALITY_CHECK]: [ORDER_STATUS.SHIPPED],
    [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.IN_DELIVERY],
    [ORDER_STATUS.IN_DELIVERY]: [ORDER_STATUS.DELIVERED]
  };

  return statusFlow[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
  calculateOrderTotal,
  isValidOrderStatus,
  isValidTrackingStatus,
  getNextTrackingStatus,
  canUpdateOrderStatus
};
