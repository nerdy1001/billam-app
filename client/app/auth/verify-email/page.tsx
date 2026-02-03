import SendVerificationEmailForm from "@/app/_components/auth/send-verification-email-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/auth/login')
  }

  const error = (await searchParams).error;

  if (!error) redirect(`/dashboard/${session.user.id}`);

  return (
    <>
      <SendVerificationEmailForm error={error} />
    </>
  );
}


