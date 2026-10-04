import dropStore from '$lib/stores/DropStore';

const notFoundPage = () => '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>drop not found</title><style>body{font-family:monospace;background:oklch(0.145 0 0);display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh}h1{color:#f44;font-size:4rem;margin:0}p{color:#888}</style></head><body><h1>404</h1><p>drop not found</p></body></html>\n';

export const GET = async ({ params }: { params: { file: string } }) => {
    const content = dropStore.get(params.file);
    if (content !== null) return new Response(content, { headers: { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' } });
    else return new Response(notFoundPage(), { status: 404, headers: { 'Content-Type': 'text/html' } });
};