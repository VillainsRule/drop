import crypto from 'node:crypto';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import sessionStore from '$lib/stores/SessionStore';

export async function GET({ request, cookies }) {
    const query = new URL(request.url).searchParams;
    const code = query.get('code');

    const userReq = await fetch(`${env.VOAUTH_HOST}/api/v1/oauth/validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ appId: env.VOAUTH_CLIENT_ID, appSecret: env.VOAUTH_CLIENT_SECRET, code })
    });

    const userRes = await userReq.json() as { error: string } | { user: { id: number, username: string } };
    if (!('user' in userRes)) return error(401, userRes.error || 'invalid code');

    if (userRes.user.id.toString() !== env.VOAUTH_USER_ID) return error(403, 'this voauth account is not allowed to log in to this instance of drop');

    const newSession = crypto.randomBytes(32).toString('hex');
    sessionStore.add(newSession);

    cookies.set('session', newSession, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: true
    });

    return new Response(null, { status: 302, headers: { Location: '/' } });
}