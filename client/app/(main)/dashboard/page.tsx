// app/dashboard/page.tsx
import { getCurrentBusiness } from "@/app/utils/get-current-business.util";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const business = await getCurrentBusiness();

  if (!business) {
    redirect("/onboarding/steps");
  }

  // Redirect to the actual ID-based route
  redirect(`/dashboard/${business.id}`);
}