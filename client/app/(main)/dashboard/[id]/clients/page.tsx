
import Clients from "@/app/_components/clients/clients";
import Container from "@/app/_components/dashboard/container";
import { getClientDashboardStats } from "@/app/actions/client.actions";

export default async function ClientsPage() {

  const result = await getClientDashboardStats();

  if (!result.success) throw new Error(result.error);

  const { stats } = result;

  return (
    <Container>
      <main className="flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black">
        <h1 className='text-3xl font-bold'>
          Clients
        </h1>
        <Clients stats={stats} />
      </main>
    </Container>
  );
}