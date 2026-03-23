"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const headersList = await headers();

  return await auth.api.getSession({
    headers: headersList,
  });
}