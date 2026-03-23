"use server"

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentBusiness() {

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) return null;

  const business = await prisma.business.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });

  return business;
}