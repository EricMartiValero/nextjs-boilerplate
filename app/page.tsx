import { headers } from 'next/headers';
import { getNetworks } from '@/actions/social-actions';
import { isAuthenticated } from '@/actions/auth-actions';
import SocialCard from '@/components/SocialCard';
import { addNetwork } from '@/actions/social-actions';
import { Eye } from '@/components/eye';
import { Odometer } from '@/components/odometer';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const networks = await getNetworks();
    const isEditor = await isAuthenticated();

    // Placeholder visitor count (can be hooked up to real stats later if needed distinct from `visitas` table)
    // For now, let's keep the odometer static or simple since we changed the analytics focus.
    const uniqueCount = 1337; // Todo: Real count

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-2xl px-4">
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

                {/* Social Networks Grid */}
                <div className="w-full flex flex-col gap-4">
                    {networks.map((network) => (
                        <SocialCard key={network.id} network={network} isEditor={isEditor} />
                    ))}
                </div>

                {/* Add Network Button (Admin Only) */}
                {isEditor && (
                    <div className="w-full pt-4 border-t border-white/10">
                        <form action={addNetwork} className="flex gap-2">
                            <input name="name" type="hidden" value="Nueva Red" />
                            <input name="url" type="hidden" value="#" />
                            <input name="icon" type="hidden" value="Link" />
                            <button type="submit" className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/50 transition-all flex items-center justify-center gap-2">
                                <span>+ Añadir Red Social</span>
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <a href="/admin/analytics" className="text-sm text-neutral-500 hover:text-white underline">
                                Ir al Panel de Analytics
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
