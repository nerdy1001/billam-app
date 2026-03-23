"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "../utils/server-session.util";

export async function updateUsernameAction(username: string) {
    const session = await getServerSession();

    if (!session) {
        return {
            error: true,
            message: "Unauthorized access"
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            name: username
        }
    });

    if (updatedUser) {
        return {
            success: true,
            message: "Username updated"
        }
    }
    else {
        return {
            error: true,
            message: "Something went wrong"
        }
    }
}