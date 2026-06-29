export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		console.log(request.cf?.country);
		if (url.pathname === '/') {
			const count = Number((await env.DB.get('count')) ?? 0);
			await env.DB.put('count', `${count + 1}`);
			return new Response(`Count is ${count + 1}`);
		}
		return new Response(null, { status: 400 });
	},
} satisfies ExportedHandler<Env>;
