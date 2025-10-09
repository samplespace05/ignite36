import nodemailer from 'nodemailer';

export const sendLoginEmail = async (toEmail, magicLink) => {
    console.log("--- emailService: Attempting to create transporter... ---"); // DEBUG LOG
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log("DEBUG: Transporter created.");

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
                <img src="https://i.imgur.com/your-logo-image-url.png" alt="Event Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #1e3a8a;">Your Hackathon Portal Login Link</h2>
                <p>Click the button below to securely log in to your dashboard. This link will expire in 15 minutes.</p>
                <a href="${magicLink}" style="background-color: #4f46e5; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; font-weight: bold;">
                    Log In to Dashboard
                </a>
                <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
            </div>
        </div>
    `;

    try {
        console.log(`DEBUG: Attempting to send mail to ${toEmail}...`);
        let info = await transporter.sendMail({
            from: `"Ignite 36 Hackathon" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Your Magic Login Link',
            html: emailHtml,
        });
        
        console.log("✅ SUCCESS: Email sent! Message ID:", info.messageId); // SUCCESS LOG
        console.log("Full response from mail server:", info.response);

    } catch (error) {
        console.error("❌ FAILED to send email. The error is:", error); // FAILURE LOG
        throw new Error('Could not send login email due to server-side error.');
    }
};