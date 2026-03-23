"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/app/utils/server-session.util";
import { z } from "zod";
import { businessPaymentMethodSchema } from "@/lib/validations/onboarding.validation";
import type { BusinessPaymentMethod } from "@/generated/prisma";

export type GetPaymentMethodsResponse =
  | { success: true; data: BusinessPaymentMethod[] }
  | { error: true; message: string };

export type ActionResponse =
  | { success: true; message: string }
  | { error: true; message: string };

/**
 * Fetch all stored payment methods for the currently authenticated user's business.
 *
 * - ensures the user is logged in
 * - gracefully handles missing business or payment methods
 * - catches and logs unexpected errors for production
 */
export async function getBusinessPaymentMethods(): Promise<GetPaymentMethodsResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.id) {
      return {
        error: true,
        message: "Unauthorized access. Please log in to continue.",
      };
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      // User has no business yet. Return empty list rather than an error.
      return { success: true, data: [] };
    }

    const paymentMethods = await prisma.businessPaymentMethod.findMany({
      where: { businessId: business.id },
    });

    return { success: true, data: paymentMethods };
  } catch (error) {
    console.error("Error fetching payment methods:", error);

    // Avoid leaking internal details to clients
    return {
      error: true,
      message: "An unexpected error occurred while retrieving payment methods. Please try again later.",
    };
  }
}

/**
 * Replace the existing payment methods for the user's business.
 *
 * This completely wipes the previous records and inserts the provided list. The
 * input is strictly validated using the same schema employed during onboarding.
 */
export async function updateBusinessPaymentMethods(
  methods: Array<z.infer<typeof businessPaymentMethodSchema>>
): Promise<ActionResponse> {
  try {
    // Validate the payload
    const validatedMethods = z
      .array(businessPaymentMethodSchema)
      .min(1, "You must provide at least one payment method")
      .parse(methods);

    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return {
        error: true,
        message: "Unauthorized access. Please log in to continue.",
      };
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return {
        error: true,
        message: "No business found for the current user.",
      };
    }

    // transaction to clear and insert new methods
    await prisma.$transaction([
      prisma.businessPaymentMethod.deleteMany({
        where: { businessId: business.id },
      }),
      prisma.businessPaymentMethod.createMany({
        data: validatedMethods.map((m) => ({
          ...m,
          businessId: business.id,
        })),
      }),
    ]);

    return {
      success: true,
      message: "Payment methods updated successfully.",
    };
  } catch (error) {
    console.error("Error updating payment methods:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        error: true,
        message: "Invalid payment method data provided.",
      };
    }

    return {
      error: true,
      message: "An unexpected error occurred while updating payment methods. Please try again later.",
    };
  }
}


