import { DurableObject } from 'cloudflare:workers';

export class DurablePotato extends DurableObject<Env> {
	fetch(request: Request) {
		const url = new URL(request.url);
		const nickname = url.searchParams.get('nickname') ?? 'anon';
		const webSocketPair = new WebSocketPair();

		const [client, server] = Object.values(webSocketPair);

		this.ctx.acceptWebSocket(server);

		return new Response(null, { status: 101, webSocket: client });
	}

	webSocketMessage(ws: WebSocket, message: string) {
		console.log(message);
	}

	webSocketClose(ws: WebSocket) {
		console.log('someone left');
	}
}
