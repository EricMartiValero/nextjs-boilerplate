'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'tnmorty_session';
const ADMIN_USER = 'TnMorty';
const ADMIN_PASS = 'YTmortyYT27';

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        redirect('/');
    } else {
        return { error: 'Credenciales incorrectas' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    redirect('/login');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has(AUTH_COOKIE);
}
