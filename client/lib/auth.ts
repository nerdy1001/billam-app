import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from './prisma';
import { hashPassword, verifyPassword } from './argon2';
import { sendEMailAction } from '@/app/actions/send-mail.action';
import { verifyEmailTemplate } from '@/app/emails/verification-template';
import { resetPasswordTemplate } from '@/app/emails/reset-template';
import { customSession } from 'better-auth/plugins';

const options = {
    database: prismaAdapter(prisma, {
       provider: 'mongodb' 
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 8,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEMailAction({
                to: user.email,
                subject: 'Reset your password',
                html: resetPasswordTemplate({ resetPasswordUrl: String(url) })
            })
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        expiresIn: 60 * 60,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const link = new URL(url);
            link.searchParams.set("callbackURL", "/auth/verify-email");

            await sendEMailAction({
                to: user.email,
                subject: "Verify your email",
                html: verifyEmailTemplate({ verifyUrl: String(link) }),
            });
        },
        
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: 'select_account'
        }
    },
} satisfies BetterAuthOptions

export const auth = betterAuth({
    ...options,
    // plugins: [
    //     customSession(async ({ session }) => {
    //     return {
    //         session: {
    //             expiresAt: session.expiresAt,
    //             token: session.token,
    //             userAgent: session.userAgent,
    //         },
    //     };
    //     }, options),
    // ]
    // advanced: {
    //     database: {
    //         generateId: false
    //     }
    // }
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN"
