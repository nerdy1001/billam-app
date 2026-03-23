"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "./server-session.util";

export async function getBusinessPaymentMethods () {
    const session = await getServerSession();

    const business = await prisma.business.findFirst({
        where: {
            ownerId: session?.user.id
        }
    })

    const paymentMethods = await prisma.businessPaymentMethod.findMany({
        where: {
            businessId: business?.id
        }
    })

    return paymentMethods;
}