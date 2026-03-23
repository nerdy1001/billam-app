"use server";

import { BusinessDetailsFormValues, businessDetailsSchema } from "@/lib/validations/business-details.validation";
import { getServerSession } from "../utils/server-session.util";
import { prisma } from "@/lib/prisma";

type ActionResponse = {
  success: true;
  message: string;
} | {
  error: true;
  message: string;
};

export type GetBusinessResponse = {
  success: true;
  data: BusinessDetailsFormValues | null;
} | {
  error: true;
  message: string;
};

export async function updateBusinessDetails(data: BusinessDetailsFormValues): Promise<ActionResponse> {
  try {
    // Validate input data
    const validatedData = businessDetailsSchema.parse(data);

    // Get server session
    const session = await getServerSession();

    if (!session || !session.user?.id) {
      return {
        error: true,
        message: "Unauthorized access. Please log in to continue."
      };
    }

    // Find the existing business for the user
    const existingBusiness = await prisma.business.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!existingBusiness) {
      return {
        error: true,
        message: "No business found for the current user."
      };
    }

    // Update the business details
    await prisma.business.update({
      where: {
        id: existingBusiness.id,
      },
      data: {
        name: validatedData.businessName ?? existingBusiness.name,
        email: validatedData.businessEmail ?? existingBusiness.email,
        phone1: validatedData.phoneNumber1 ?? existingBusiness.phone1,
        phone2: validatedData.phoneNumber2 ?? existingBusiness.phone2,
        businessType: validatedData.businessType ?? existingBusiness.businessType,
        industryType: validatedData.industry ?? existingBusiness.industryType,
        logo: validatedData.logo ?? existingBusiness.logo,
        address: validatedData.businessAddress ?? existingBusiness.address,
      },
    });

    return {
      success: true,
      message: "Business details updated successfully."
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating business details:", error);

    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        error: true,
        message: "Invalid input data provided."
      };
    }

    // Generic error for production
    return {
      error: true,
      message: "An unexpected error occurred while updating business details. Please try again later."
    };
  }
}

export async function getBusinessDetails(): Promise<GetBusinessResponse> {
  try {
    // Get server session
    const session = await getServerSession();

    if (!session || !session.user?.id) {
      return {
        error: true,
        message: "Unauthorized access. Please log in to continue."
      };
    }

    // Find the business for the user
    const business = await prisma.business.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!business) {
      return {
        success: true,
        data: null, // No business found, return null
      };
    }

    // Map the business data to the form values
    const businessDetails: BusinessDetailsFormValues = {
      businessName: business.name,
      businessEmail: business.email || "",
      phoneNumber1: business.phone1,
      phoneNumber2: business.phone2 || undefined,
      businessType: business.businessType,
      industry: business.industryType,
      businessAddress: business.address || undefined, // Not stored in DB
      logo: business.logo || undefined,
    };

    return {
      success: true,
      data: businessDetails,
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error retrieving business details:", error);

    // Generic error for production
    return {
      error: true,
      message: "An unexpected error occurred while retrieving business details. Please try again later."
    };
  }
}