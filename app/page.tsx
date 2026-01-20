import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import { Eye } from '@/components/eye';
import { Odometer } from '@/components/odometer';

export const dynamic = 'force-dynamic'; // Ensure we get real headers/IP

export default async function Home() {
    const supabase = await createClient();
    const headersList = await headers();

    // 1. IP Tracking Logic
    // x-forwarded-for format: "client-ip, proxy1, proxy2"
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const country = headersList.get('x-vercel-ip-country') || 'unknown'; // Vercel specific

    if (ip !== 'unknown') {
        try {
            await supabase.rpc('track_visit', {
                p_ip: ip,
                p_ua: userAgent,
                p_country: country
            });
        } catch (e) {
            console.error("Tracking error:", e);
        }
    }

    // 2. Fetch Visitor Count
    let uniqueCount = 0;
    try {
        const { data } = await supabase.rpc('get_unique_visitor_count');
        uniqueCount = data || 0;
    } catch (e) {
        console.error("Count error:", e);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* The Eye */}
                <Eye />

                {/* Stats Odometer */}
                <div className="flex flex-col items-center gap-2">
                    <div className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                        <Odometer value={uniqueCount} />
                    </div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-medium">
                        Unique Visitors
                    </p>
                </div>

                {/* Social / Floating Links (Placeholder for now) */}
                <div className="mt-12 flex gap-6">
                    {/* Example Button */}
                    <button className="group relative px-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <span className="relative z-10 text-slate-300 group-hover:text-white transition-colors font-medium">
                            Enter System
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
}
