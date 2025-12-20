// API Response utility for consistent response formatting
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'Error', statusCode = 400, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : undefined
  });
};

const sendPaginated = (res, data, total, page = 1, limit = 10, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / limit),
    data
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
