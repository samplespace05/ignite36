import sgMail from '@sendgrid/mail';

// Set the API key from your environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendLoginEmail = async (toEmail, magicLink) => {
    console.log("--- emailService (SendGrid): Attempting to send mail... ---");

    // This should be the email you verified on SendGrid
    const fromEmail = process.env.VERIFIED_SENDER_EMAIL; 

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
                <h2 style="color: #1e3a8a;">Your Hackathon Portal Login Link</h2>
                <p>Click the button below to log in. This link will expire in 15 minutes.</p>
                <a href="${magicLink}" style="background-color: #4f46e5; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; font-weight: bold;">
                    Log In to Dashboard
                </a>
            </div>
        </div>
    `;

    const msg = {
        to: toEmail,
        from: fromEmail, 
        subject: 'Your Magic Login Link',
        html: emailHtml,
    };

    try {
        await sgMail.send(msg);
        console.log("✅ SUCCESS: Email sent successfully via SendGrid!");
    } catch (error) {
        console.error("❌ FAILED to send email via SendGrid. The error is:", error);
        if (error.response) {
            console.error(error.response.body)
        }
        throw new Error('Could not send login email due to a server-side error.');
    }
};