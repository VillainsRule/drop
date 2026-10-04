import dropStore, { validId } from '$lib/stores/DropStore';
import keyStore from '$lib/stores/KeyStore';
import sessionStore from '$lib/stores/SessionStore';
import type { RequestHandler } from '@sveltejs/kit';

const reservedPaths = ['api', 'oauth', 'r'];

const json = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: RequestHandler = async ({ request, cookies, url }) => {
    const session = cookies.get('session');
    const bearer = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];

    const authorized = (session && sessionStore.has(session)) || (bearer && keyStore.has(bearer));
    if (!authorized) return json({ ok: false, message: 'unauthorized' }, 401);

    const customPath = url.searchParams.get('path');
    const override = ['true', '1'].includes(url.searchParams.get('override') ?? '');

    if (customPath !== null && (!validId(customPath) || reservedPaths.includes(customPath))) return json({ ok: false, message: 'invalid path' }, 400);

    const id = dropStore.create(await request.text(), customPath ?? undefined, override);
    if (id === null) return json({ ok: false, message: 'path already taken' }, 409);

    return json({ ok: true, path: id });
};