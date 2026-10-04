import keyStore from '$lib/stores/KeyStore';
import sessionStore from '$lib/stores/SessionStore';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({ cookies }) => {
    const session = cookies.get('session');
    if (!session || !sessionStore.has(session)) return new Response(JSON.stringify({ ok: false, message: 'unauthorized' }), { status: 401 });

    return new Response(JSON.stringify({ ok: true, key: keyStore.generate() }), { headers: { 'Content-Type': 'application/json' } });
};
