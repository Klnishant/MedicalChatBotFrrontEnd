import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.Mail_PASS_KEY,
    },
  });

  export async function sendVerificationEmail (
    email: string,
    username: string,
    verifycode: string
) {
    try {
        const info = await transporter.sendMail({
            from: 'mysterymessage.contact.info@gmail.com', // sender address
            to: email, // list of receivers
            subject: "MediAna Health Assistance", // Subject line
            html: `<html lang='eng' dir='ltr'>
            <head>
                <title>Verification Code</title>
                <font 
                 fontFamily='Roboto'
                 fallbackFontFamily='Verdana'
                 webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    format: 'woff2',
                  }}
                  fontWeight={400}
                  fontStyle="normal"
                 />
            </head>
            <preview>Here&apos;s your verification code: ${verifycode}</preview>
            <section>
                <row>
                    <Heading as='h2'><h2>Hello ${username}</h2>,</Heading>
                </row>
                <row>
                    <text>
                        Thank you for registering. Please use the following verification
                        code to complete your registration:
                    </text> <br />
                </row>
                <row>
                    <Text>${verifycode}</Text> <br />
                </row>
                <row>
                    <rext>
                        If you did not request this code, please ignore this email.
                    </rext>
                </row>
                
            </section>
        </html>`
        })
        
        return ({success: true,
                 message: 'verification code send successfully'});
    } catch (error) {
        console.error("Error sending verification email",error)
        
        return ({
            success: false,
            message: "failed to send verification email"
        });        
    }
}