'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from './auth-actions';

export type SocialNetwork = {
    id: string;
    name: string;
    url: string;
    icon: string;
    order_index: number;
};

export async function getNetworks() {
    const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching networks:', error);
        return [];
    }

    return data as SocialNetwork[];
}

export async function addNetwork(formData: FormData) {
    const isAuth = await isAuthenticated();
    if (!isAuth) return { error: 'No autorizado' };

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0');

    const { error } = await supabase
        .from('social_networks')
        .insert([{ name, url, icon, order_index }]);

    if (error) return { error: error.message };
    revalidatePath('/');
    return { success: true };
}

export async function updateNetwork(id: string, formData: FormData) {
    const isAuth = await isAuthenticated();
    if (!isAuth) return { error: 'No autorizado' };

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0');

    const { error } = await supabase
        .from('social_networks')
        .update({ name, url, icon, order_index })
        .eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/');
    return { success: true };
}

export async function deleteNetwork(id: string) {
    const isAuth = await isAuthenticated();
    if (!isAuth) return { error: 'No autorizado' };

    const { error } = await supabase
        .from('social_networks')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/');
    return { success: true };
}
