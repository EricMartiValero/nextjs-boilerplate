'use client';

import { login } from '@/actions/auth-actions';
import { useActionState } from 'react';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await login(formData);
        if (result?.error) {
            return { error: result.error };
        }
        return { error: '' };
    }, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <form action={formAction} className="flex flex-col gap-4 p-8 border border-white/20 rounded-xl bg-neutral-900 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-4">Acceso TnMorty</h1>

                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Usuario</label>
                    <input
                        name="username"
                        id="username"
                        type="text"
                        className="p-2 rounded bg-neutral-800 border border-neutral-700 focus:border-white focus:outline-none"
                        placeholder="TnMorty"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        className="p-2 rounded bg-neutral-800 border border-neutral-700 focus:border-white focus:outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {state.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 p-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Validando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
