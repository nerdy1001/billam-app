"use client";

import { Input } from '@/components/ui/input'
import ClientStatCard from './client-stat-card'
import { ClientDashboardStats } from '@/app/actions/client.actions'
import { useEffect, useState } from 'react'
import { Client } from '@/generated/prisma'
import { useDebounce } from '@/hooks/use-debounce'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EmptyState from '../empty-states/empty';
import ClientPreviewCard from './client-preview-card';
import { ClientSummary } from '@/app/api/clients/search/route';

interface ClientsProps {
    stats: ClientDashboardStats
}

const Clients = ({
    stats
}: ClientsProps) => {

    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState("all-clients");
    const [tab, setTab] = useState("all");
    const [clients, setClients] = useState<Array<ClientSummary>>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);


    const debouncedSearch = useDebounce(search, 400);

    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        async function fetchClient() {
            try {
                const res = await axios.get(
                    `/api/clients/search?q=${debouncedSearch}&tab=${tab}`
                );
                setClients(res.data.clients);
                setTotal(res.data.total);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchClient();
    }, [debouncedSearch, tab])

    console.log(clients)
    
  return (
    <div className='flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black'>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <ClientStatCard
            label="Total Clients"
            value={stats.totalClients.count}
            subtitle={stats.totalClients.subtitle}
          />
          <ClientStatCard
            label="Total billed"
            value={`XAF ${stats.totalBilled.amount.toLocaleString()}`}
            subtitle={stats.totalBilled.subtitle}
          />
          <ClientStatCard
            label="Outstanding"
            value={`XAF ${stats.outstanding.amount.toLocaleString()}`}
            subtitle={stats.outstanding.subtitle}
          />
          <ClientStatCard
            label="Avg pay time"
            value={stats.avgPayTime.days !== null ? `${stats.avgPayTime.days}d` : "—"}
            subtitle={stats.avgPayTime.subtitle}
          />
        </div>
        <Input placeholder='Search clients...' value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 bg-white"/>
        <Tabs
            defaultValue="all"
            value={tab}
            onValueChange={(val) => setTab(val)}
        >
            <TabsList variant="line">
                <TabsTrigger value="all" className='cursor-pointer text-base'>All clients</TabsTrigger>
                <TabsTrigger value="good" className='cursor-pointer text-base'>Good payers</TabsTrigger>
                <TabsTrigger value="fair" className='cursor-pointer text-base'>Fair</TabsTrigger>
                <TabsTrigger value="at-risk" className='cursor-pointer text-base'>At risk</TabsTrigger>
                <TabsTrigger value="new" className='cursor-pointer text-base'>New</TabsTrigger>
            </TabsList>
        </Tabs>
        {clients.length === 0 ? (
          <div className="w-full">
            <EmptyState imgSrc="/undraw_void_wez2.png" title="Nothing to see here." />
          </div>
        ): (
          <div className="grid xl:md:grid-cols-3 md:grid-cols-2 gap-4 w-full">
            {clients.map((client) => (
              <div key={client.id} onClick={() => router.push(`/dashboard/${params.id}/clients/client-details/${client.id}`)}>
                <ClientPreviewCard client={client} />
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default Clients