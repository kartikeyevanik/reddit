const nodemailer = require("nodemailer");

async function testEmail() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "prsntchaudhary2002@gmail.com",
            pass: "pqozvlrkzddiooob",  // Your correct App Password
        },
    });

    const info = await transporter.sendMail({
        from: '"Test" <no-reply@test.com>',
        to: "prsntchaudhary67@gmail.com",
        subject: "Test email",
        text: "This is a test.",
    });

    console.log("Mail sent successfully:", info);
}

testEmail().catch(console.error);
