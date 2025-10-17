import dotenv from "dotenv";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, emailOTP, openAPI } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { expo } from "@better-auth/expo";

dotenv.config();

import { db } from "./drizzle";

async function sendEmail(message: {
  to: string;
  subject: string;
  text: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailersend.net",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  try {
    const response = await transporter.sendMail({
      from: "kyleh <MS_BmTRRD@test-z0vklo6pq2pl7qrx.mlsender.net>",
      ...message,
    });

    if (!response) {
      return false;
    }

    if (response) {
      console.log(`message sent to ${message.to} successfully`);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const auth = betterAuth({
  trustedOrigins: ["my-recipe-app://"],
  plugins: [
    apiKey(),
    admin(),
    openAPI(),
    expo(),
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
          const success = await sendEmail({
            to: email,
            subject: "Log in to your account",
            text: `Your verification code is ${otp}`,
          });
          console.log("sign-in success: ", success);
        } else if (type === "email-verification") {
          // Send the OTP for email verification
          const success = await sendEmail({
            to: email,
            subject: "Verify your email address",
            text: `Your verification code is ${otp}`,
          });
          console.log("email-verification success: ", success);
        } else {
          // Send the OTP for password reset
          const success = await sendEmail({
            to: email,
            subject: "Reset your password",
            text: `Your verification code is ${otp}`,
          });
          console.log("password-reset success: ", success);
        }
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const success = await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
      console.log("sendResetPassword success: ", success);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    requireEmailVerification: true,
    autoSignInAfterVerification: true,
    // sendVerificationEmail: async ({ user, url, token }, request) => {
    //   const success = await sendEmail({
    //     to: user.email,
    //     subject: "Verify your email address",
    //     text: `Click the link to verify your email: ${url}`,
    //   });
    // },
    afterEmailVerification: async (user, request) => {
      console.log(`${user.email} has been successfully verified!`);
      return Promise.resolve();
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
