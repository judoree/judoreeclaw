import { DurableObject } from 'cloudflare:workers';

export class DurablePotato extends DurableObject<Env> {
	fetch(request: Request): Response | Promise<Response> {
		return new Response('hello');
	}
}
