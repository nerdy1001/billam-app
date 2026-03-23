"use server";

import { auth } from "@/lib/auth";
import { getServerSession } from "../utils/server-session.util";
import { headers } from "next/headers";

export async function updatePassword(oldPassword: string, newPassword: string) {
    const session = await getServerSession();
    const headersList = await headers();

    if (!session) {
        return {
            error: true,
            message: "Unauthorized access"
        }
    }

    const data = await auth.api.changePassword({
        body: {
            newPassword,
            currentPassword: oldPassword,
        },
        headers: headersList
    });

    if (data) {
        return {
            success: true,
            message: "Password updated"
        }
    } else {
        return {
            error: true,
            message: "Something went wrong"
        }
    }
}