import { SignOutButton } from "@/app/_components/auth/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

// 1. Define params as a Promise in the type
type Props = {
  params: Promise<{ id: string }>;
};

export default async function DashboardPage({ params }: Props) {

  const headersList = await headers();

  // console.log(headersList)

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");


  // const { id } = await params;

  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })

  // // 4. Security: If no session, go to login
  // if (!session) {
  //   redirect("/auth/login");
  // }

  // if (id === "undefined") {
  //   notFound()
  // }

  // // Check if the URL ID matches the Logged-in Session ID
  // if (id !== session?.user.id) {
  //   // If they don't match, send them to THEIR own dashboard
  //   redirect(`/dashboard/${session?.user.id}`);
  // }

  // if (!session) {
  //   redirect('/auth/login')
  // }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>
        Dashboard Page
      </p>
      <SignOutButton />
    </div>
  );
}