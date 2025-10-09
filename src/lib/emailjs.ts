import emailjs from "@emailjs/browser";

interface EmailOptions {
  to: string;
  toName: string;
  subject: string;
  message: string;
  htmlContent?: string;
}

interface ApprovalEmailData {
  to: string;
  toName: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

interface RejectionEmailData {
  to: string;
  toName: string;
  reason: string;
}

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_APPROVAL_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_APPROVAL_TEMPLATE_ID || "";
const EMAILJS_REJECTION_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_REJECTION_TEMPLATE_ID || "";

if (typeof window !== "undefined" && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export async function sendApprovalEmail(data: ApprovalEmailData) {
  try {
    const templateParams = {
      user_email: data.to,
      to_name: data.toName,
      temporary_password: data.temporaryPassword,
      login_url: data.loginUrl,
      subject: "Registration Approved - Access Granted",
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_APPROVAL_TEMPLATE_ID,
      templateParams
    );

    console.log("Approval email sent successfully:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    throw new Error("Failed to send approval email");
  }
}

export async function sendRejectionEmail(data: RejectionEmailData) {
  try {
    const templateParams = {
      user_email: data.to,
      to_name: data.toName,
      rejection_reason: data.reason,
      subject: "Registration Request - Update",
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_REJECTION_TEMPLATE_ID,
      templateParams
    );

    console.log("Rejection email sent successfully:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    throw new Error("Failed to send rejection email");
  }
}

export async function sendEmail(options: EmailOptions) {
  try {
    const templateParams = {
      to_email: options.to,
      to_name: options.toName,
      subject: options.subject,
      message: options.message,
      html_content: options.htmlContent || options.message,
    };

    const GENERIC_TEMPLATE_ID =
      process.env.NEXT_PUBLIC_EMAILJS_GENERIC_TEMPLATE_ID || "";

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      GENERIC_TEMPLATE_ID,
      templateParams
    );

    console.log("Email sent successfully:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}
