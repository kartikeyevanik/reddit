import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, name: string) {
    console.log("[EMAIL] Starting email send process");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    console.log("[EMAIL] Transporter created successfully");

    const verificationLink = `http://localhost:3000/verify-email?email=${encodeURIComponent(email)}`;

    const mailOptions = {
        from: '"My App" <no-reply@myapp.com>',
        to: email,
        subject: "Verify your email address",
        text: `Hello ${name},\n\nThank you for registering! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nRegards,\nMy App Team`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[EMAIL] Mail sent successfully:", info);
    } catch (error) {
        console.error("[EMAIL_ERROR] Failed to send email:", error);
        throw error;
    }
};
