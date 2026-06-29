export { DurablePotato } from './do';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const stub = env.DP.getByName('default');
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
