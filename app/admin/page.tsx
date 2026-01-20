import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Fetch visits
    const { data: visits, error } = await supabase
        .from('visitas')
        .select('*')
        .order('last_visit', { ascending: false });

    if (error) {
        console.error('Error fetching visits:', error);
    }

    return (
        <div className="min-h-screen bg-black text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">The Eye / Admin</h1>
                        <p className="text-slate-500">Visitor Tracking System</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                            {user.email}
                        </div>
                    </div>
                </header>

                {/* Glassmorphic Table Container */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-medium text-slate-400">IP Address</th>
                                    <th className="p-4 font-medium text-slate-400">Location</th>
                                    <th className="p-4 font-medium text-slate-400">Return Freq.</th>
                                    <th className="p-4 font-medium text-slate-400">Last Seen</th>
                                    <th className="p-4 font-medium text-slate-400 hidden md:table-cell">User Agent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {visits?.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-indigo-300">{visit.ip_address}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                                                {visit.country || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${Math.min(visit.visit_count * 10, 100)}%` }} // Visual bar
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">{visit.visit_count}x</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 whitespace-nowrap">
                                            {new Date(visit.last_visit).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-slate-500 text-xs hidden md:table-cell max-w-[200px] truncate" title={visit.user_agent}>
                                            {visit.user_agent}
                                        </td>
                                    </tr>
                                ))}
                                {(!visits || visits.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No visitors recorded yet. The Eye is waiting.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
