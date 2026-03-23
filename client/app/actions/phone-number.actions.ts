"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "../utils/server-session.util";

export async function checkForExistingPhoneNumber() {
    const session = await getServerSession();

    if (!session) {
        return {
            error: true,
            message: "Unauthorized access"
        }
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
    })

    if (existingUser?.phoneNumber) {
        return {
            hasPhoneNumber: true,
            phoneNumber: existingUser.phoneNumber
        }
    } else {
        return {
            hasPhoneNumber: false,
        }
    }

}

export async function updatePhoneNumberAction(phoneNumber: string) {
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
            phoneNumber
        }
    })

    if (updatedUser) {
        return {
            success: true,
            message: "Phone number updated"
        }
    } else {
        return {
            error: true,
            message: "Something went wrong"
        }
    }
}