import { env } from '$env/dynamic/private';

export function GET({ request }) {
    const origin = new URL(request.url).origin;

    return new Response(null, {
        status: 302,
        headers: {
            Location: `${env.VOAUTH_HOST}/oauth/v1?client_id=${env.VOAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${origin}/oauth/complete`)}`
        }
    })
}