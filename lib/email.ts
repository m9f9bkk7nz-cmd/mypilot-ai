/**
 * Email service utilities using Resend
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // If no API key is configured, log to console (development mode)
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Email would be sent (no API key configured):", {
      to: options.to,
      subject: options.subject,
    });
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "MyPilot <onboarding@resend.dev>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log("✅ Email sent successfully to:", options.to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  const text = `
    Password Reset Request
    
    You requested to reset your password. Click the link below to reset it:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset Request - MyPilot",
    html,
    text,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to MyPilot!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with MyPilot. We're excited to have you on board!</p>
      <p>You can now browse our products and start shopping.</p>
      <p>
        <a href="${process.env.NEXTAUTH_URL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Shopping
        </a>
      </p>
    </div>
  `;

  const text = `
    Welcome to MyPilot!
    
    Hi ${name},
    
    Thank you for registering with MyPilot. We're excited to have you on board!
    
    You can now browse our products and start shopping.
    
    Visit: ${process.env.NEXTAUTH_URL}
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to MyPilot!",
    html,
    text,
  });
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: OrderEmailData
): Promise<void> {
  const itemsHtml = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${orderData.currency} ${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Hi ${orderData.customerName},</p>
      <p>Thank you for your order! We've received your order and will process it shortly.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order #${orderData.orderNumber}</h3>
      </div>

      <h3>Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p style="margin: 5px 0;"><strong>Subtotal:</strong> ${orderData.currency} ${orderData.subtotal.toFixed(2)}</p>
        <p style="margin: 5px 0;"><strong>Shipping:</strong> ${orderData.currency} ${orderData.shipping.toFixed(2)}</p>
        <p style="margin: 5px 0;"><strong>Tax:</strong> ${orderData.currency} ${orderData.tax.toFixed(2)}</p>
        <p style="margin: 10px 0; font-size: 18px;"><strong>Total:</strong> ${orderData.currency} ${orderData.total.toFixed(2)}</p>
      </div>

      <h3>Shipping Address</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p style="margin: 5px 0;">${orderData.shippingAddress.fullName}</p>
        <p style="margin: 5px 0;">${orderData.shippingAddress.addressLine1}</p>
        ${orderData.shippingAddress.addressLine2 ? `<p style="margin: 5px 0;">${orderData.shippingAddress.addressLine2}</p>` : ""}
        <p style="margin: 5px 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}</p>
        <p style="margin: 5px 0;">${orderData.shippingAddress.country}</p>
      </div>

      <p style="margin-top: 30px;">
        <a href="${process.env.NEXTAUTH_URL}/account/orders" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Order Details
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  const itemsText = orderData.items
    .map((item) => `${item.name} x${item.quantity} - ${orderData.currency} ${item.price.toFixed(2)}`)
    .join("\n");

  const text = `
Order Confirmation

Hi ${orderData.customerName},

Thank you for your order! We've received your order and will process it shortly.

Order #${orderData.orderNumber}

Order Items:
${itemsText}

Subtotal: ${orderData.currency} ${orderData.subtotal.toFixed(2)}
Shipping: ${orderData.currency} ${orderData.shipping.toFixed(2)}
Tax: ${orderData.currency} ${orderData.tax.toFixed(2)}
Total: ${orderData.currency} ${orderData.total.toFixed(2)}

Shipping Address:
${orderData.shippingAddress.fullName}
${orderData.shippingAddress.addressLine1}
${orderData.shippingAddress.addressLine2 || ""}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}
${orderData.shippingAddress.country}

View your order: ${process.env.NEXTAUTH_URL}/account/orders

If you have any questions, please contact our support team.
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html,
    text,
  });
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  status: string,
  trackingNumber?: string
): Promise<void> {
  const statusMessages: Record<string, { title: string; message: string }> = {
    PROCESSING: {
      title: "Order is Being Processed",
      message: "We're preparing your order for shipment.",
    },
    SHIPPED: {
      title: "Order Has Been Shipped",
      message: "Your order is on its way!",
    },
    DELIVERED: {
      title: "Order Delivered",
      message: "Your order has been delivered. We hope you enjoy your purchase!",
    },
    CANCELLED: {
      title: "Order Cancelled",
      message: "Your order has been cancelled. If you have any questions, please contact support.",
    },
  };

  const statusInfo = statusMessages[status] || {
    title: "Order Status Updated",
    message: `Your order status has been updated to: ${status}`,
  };

  const trackingHtml = trackingNumber
    ? `
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Tracking Information</h3>
      <p style="font-size: 18px; margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
    </div>
  `
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">${statusInfo.title}</h2>
      <p>Hi ${customerName},</p>
      <p>${statusInfo.message}</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order #${orderNumber}</h3>
        <p style="margin: 0;"><strong>Status:</strong> ${status}</p>
      </div>

      ${trackingHtml}

      <p style="margin-top: 30px;">
        <a href="${process.env.NEXTAUTH_URL}/account/orders" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Order Details
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  const trackingText = trackingNumber ? `\nTracking Number: ${trackingNumber}` : "";

  const text = `
${statusInfo.title}

Hi ${customerName},

${statusInfo.message}

Order #${orderNumber}
Status: ${status}${trackingText}

View your order: ${process.env.NEXTAUTH_URL}/account/orders

If you have any questions, please contact our support team.
  `;

  await sendEmail({
    to: email,
    subject: `Order Update - ${orderNumber}`,
    html,
    text,
  });
}
