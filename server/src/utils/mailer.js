import nodemailer from 'nodemailer';

// Create Nodemailer transport
// Supports Ethereal test account or configured SMTP
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'demo_mailer@ethereal.email') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development / Showcase Simulated Mailer (logs to console and returns preview)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
};

// Send Official Payment Confirmation & Activation Email
export const sendPaymentActivationEmail = async ({
  to,
  candidateName,
  orderNumber,
  itemTitle,
  itemType,
  amount,
  activationDetails,
}) => {
  try {
    const mailClient = await getTransporter();

    let detailsHtml = '';
    if (itemType === 'LIBRARY_SUBSCRIPTION') {
      detailsHtml = `
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #166534;">Physical Library Access Pass Activated</h4>
          <p style="margin: 4px 0;"><strong>Membership ID:</strong> ${activationDetails.membershipId}</p>
          <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${activationDetails.timeSlot}</p>
          <p style="margin: 4px 0;"><strong>Valid Until:</strong> ${new Date(activationDetails.endDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #15803d;">Your digital QR pass is available on your student portal. Please present it at the library reception gate.</p>
        </div>
      `;
    } else if (itemType === 'COURSE') {
      detailsHtml = `
        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #1e40af;">Course Access Unlocked</h4>
          <p style="margin: 4px 0;"><strong>Course:</strong> ${itemTitle}</p>
          <p style="margin: 4px 0;"><strong>Access Period:</strong> 12 Months</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #1d4ed8;">You can now stream high-definition video lessons and access chapter-wise study materials.</p>
        </div>
      `;
    } else if (itemType === 'PDF') {
      detailsHtml = `
        <div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 15px; margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #92400e;">Study Material Notes Available</h4>
          <p style="margin: 4px 0;"><strong>Document:</strong> ${itemTitle}</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #b45309;">Your permanent digital download link is active in your Student Document Vault.</p>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment & Admission Confirmation</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: #0a2540; color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">STATE PUBLIC ACADEMY</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Institute of Civil Services & Public Digital Library</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 24px;">
            <p style="font-size: 15px; color: #334155; margin-top: 0;">Dear <strong>${candidateName}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Thank you for your payment. Your order has been verified and your admission/entitlement has been activated successfully on the official portal.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Order Reference:</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Subscribed Item:</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${itemTitle}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Amount Paid:</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #047857; font-weight: bold;">₹${amount} (INR)</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Payment Status:</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">CONFIRMED / PAID</td>
              </tr>
            </table>

            ${detailsHtml}

            <div style="text-align: center; margin-top: 25px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background: #0a2540; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
                Access Student Dashboard
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              This is a system generated notification. For inquiries, contact admissions@stateacademy.gov.in.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await mailClient.sendMail({
      from: process.env.EMAIL_FROM || '"State Public Academy" <notifications@stateacademy.gov.in>',
      to,
      subject: `Payment Confirmed & Entitlement Activated: ${orderNumber}`,
      html: htmlContent,
    });

    console.log(`[Email Dispatched] To: ${to} | Order: ${orderNumber}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Preview URL]: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('[Email Dispatch Error]:', error);
    // Don't crash transaction if email delivery encounters network issues
    return { success: false, error: error.message };
  }
};
