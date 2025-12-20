const nodemailer = require('nodemailer');

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const templates = {
  orderConfirmation: (orderData) => `
    <h2>Order Confirmation</h2>
    <p>Your order has been received!</p>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>Product:</strong> ${orderData.productName}</p>
    <p><strong>Quantity:</strong> ${orderData.quantity}</p>
    <p><strong>Total Amount:</strong> $${orderData.totalPrice}</p>
    <p>You will receive updates on your order status soon.</p>
  `,
  
  orderApproval: (orderData) => `
    <h2>Order Approved</h2>
    <p>Good news! Your order has been approved and is now in production.</p>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p>You can track your order progress in your dashboard.</p>
  `,
  
  trackingUpdate: (orderData, trackingInfo) => `
    <h2>Order Update</h2>
    <p>Your order is on its way!</p>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>Current Status:</strong> ${trackingInfo.status}</p>
    <p><strong>Location:</strong> ${trackingInfo.location}</p>
    <p><strong>Notes:</strong> ${trackingInfo.notes}</p>
  `,
  
  userApproval: () => `
    <h2>Account Approved</h2>
    <p>Congratulations! Your account has been approved.</p>
    <p>You can now place orders and access all features of GarmentFlow.</p>
  `,
  
  userSuspension: (reason, feedback) => `
    <h2>Account Suspension Notice</h2>
    <p><strong>Reason:</strong> ${reason}</p>
    <p><strong>Feedback:</strong> ${feedback}</p>
    <p>If you believe this is an error, please contact our support team.</p>
  `
};

// Send email utility
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return false;
  }
};

// Order confirmation email
const sendOrderConfirmation = async (email, orderData) => {
  const subject = `Order Confirmation - ${orderData.orderId}`;
  const html = templates.orderConfirmation(orderData);
  return sendEmail(email, subject, html);
};

// Order approval email
const sendOrderApprovalEmail = async (email, orderData) => {
  const subject = `Order Approved - ${orderData.orderId}`;
  const html = templates.orderApproval(orderData);
  return sendEmail(email, subject, html);
};

// Tracking update email
const sendTrackingUpdate = async (email, orderData, trackingInfo) => {
  const subject = `Order Update - ${orderData.orderId}`;
  const html = templates.trackingUpdate(orderData, trackingInfo);
  return sendEmail(email, subject, html);
};

// User approval email
const sendUserApprovalEmail = async (email) => {
  const subject = 'Account Approved - GarmentFlow';
  const html = templates.userApproval();
  return sendEmail(email, subject, html);
};

// User suspension email
const sendUserSuspensionEmail = async (email, reason, feedback) => {
  const subject = 'Account Suspension - GarmentFlow';
  const html = templates.userSuspension(reason, feedback);
  return sendEmail(email, subject, html);
};

module.exports = {
  sendOrderConfirmation,
  sendOrderApprovalEmail,
  sendTrackingUpdate,
  sendUserApprovalEmail,
  sendUserSuspensionEmail,
  sendEmail
};
