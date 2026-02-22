"use server"

import { prisma } from "@/lib/prisma";
import { OnboardingFormValues } from "@/lib/validations/onboarding.validation";
import { getServerSession } from "../utils/server-session.util";

export async function createBusiness(data: OnboardingFormValues) {
    const session = await getServerSession();

    if (!session) {
        return {
            error: true,
            message: "Unauthorized Access"
        }
    }

    try {
        const business = await prisma.business.create({
            data: {
                ownerId: session.user.id,
                name: data.businessName,
                email: data.businessEmail,
                phone1: data.phoneNumber1,
                phone2: data.phoneNumber2,
                logo: data.logo as string,
                businessType: data.businessType,
                industryType: data.industry,
            }
        })

        await prisma.businessPaymentMethod.createMany({
            data: data.paymentMethods.map((pm) => ({
                businessId: business.id,
                method: pm.method,
                value: pm.value,
                label: pm.label ?? null,
            })),
        });

        return {
            success: true,
            message: "Onboarding was successful.",
            res: business.id
        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: "Something unexpected happened during the onboarding process."
        }
    }
}