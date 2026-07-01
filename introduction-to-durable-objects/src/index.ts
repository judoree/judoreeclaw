export { DurablePotato } from './do';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const nickname = searchParams.get('nickname') ?? 'anon';
		if (pathname === '/') {
			const dp = env.DP.getByName(nickname);
			return new Response(await dp.increase());
		}
		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
