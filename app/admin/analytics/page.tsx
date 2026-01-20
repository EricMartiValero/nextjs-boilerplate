import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/actions/auth-actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
        redirect('/login');
    }

    const { data: visits } = await supabase
        .from('visitas')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Panel de Control de IPs</h1>
                    <a href="/" className="px-4 py-2 bg-neutral-900 rounded hover:bg-neutral-800">Volver a Web</a>
                </div>

                <div className="border border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="bg-neutral-900 text-neutral-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4">País</th>
                                <th className="px-6 py-4">Dispositivo / UA</th>
                                <th className="px-6 py-4">Fecha / Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {visits?.map((visit) => (
                                <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-white">{visit.ip}</td>
                                    <td className="px-6 py-4">{visit.country || 'Desconocido'}</td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={visit.device}>
                                        {visit.device}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(visit.visited_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {(!visits || visits.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-600">
                                        No hay visitas registradas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
