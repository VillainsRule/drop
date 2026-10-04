import sessionStore from '$lib/stores/SessionStore';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = ({ cookies }) => {
    const sessionCookie = cookies.get('session');
    if (sessionCookie) return { loggedIn: sessionStore.has(sessionCookie) };
    else return { loggedIn: false };
};
