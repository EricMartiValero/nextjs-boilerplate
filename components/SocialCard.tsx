'use client';

import { useState } from 'react';
import { updateNetwork, deleteNetwork, type SocialNetwork } from '@/actions/social-actions';
import { motion } from 'framer-motion';
import { Trash, Edit, Save, X, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SocialCardProps {
    network: SocialNetwork;
    isEditor: boolean;
}

export default function SocialCard({ network, isEditor }: SocialCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dynamic Icon
    const IconComponent = (Icons as any)[network.icon] || Icons.Link;

    const handleUpdate = async (formData: FormData) => {
        setLoading(true);
        await updateNetwork(network.id, formData);
        setLoading(false);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm('¿Seguro que quieres eliminar esta red?')) {
            setLoading(true);
            await deleteNetwork(network.id);
            setLoading(false);
        }
    };

    if (isEditing) {
        return (
            <motion.div layout className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full">
                <form action={handleUpdate} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input name="name" defaultValue={network.name} className="flex-1 bg-neutral-800 p-2 rounded text-white" placeholder="Nombre" required />
                        <input name="order_index" type="number" defaultValue={network.order_index} className="w-16 bg-neutral-800 p-2 rounded text-white" placeholder="Ord" />
                    </div>
                    <input name="url" defaultValue={network.url} className="w-full bg-neutral-800 p-2 rounded text-white" placeholder="URL" required />
                    <input name="icon" defaultValue={network.icon} className="w-full bg-neutral-800 p-2 rounded text-white" placeholder="Lucide Icon (e.g. Twitter)" required />

                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-neutral-800 rounded hover:bg-neutral-700 text-white">
                            <X size={18} />
                        </button>
                        <button type="submit" disabled={loading} className="p-2 bg-green-600 rounded hover:bg-green-700 text-white">
                            <Save size={18} />
                        </button>
                    </div>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            className="group relative flex items-center justify-between w-full p-4 bg-black/40 border border-white/5 hover:border-white/20 rounded-xl backdrop-blur-sm transition-all hover:bg-white/5"
        >
            <a href={network.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-neutral-800/50 rounded-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">{network.name}</span>
                <ExternalLink className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto mr-4" />
            </a>

            {isEditor && (
                <div className="flex gap-2 pl-4 border-l border-white/10">
                    <button onClick={() => setIsEditing(true)} className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                        <Edit size={16} />
                    </button>
                    <button onClick={handleDelete} className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" disabled={loading}>
                        <Trash size={16} />
                    </button>
                </div>
            )}
        </motion.div>
    );
}
