import { DurableObject } from 'cloudflare:workers';

export class DurablePotato extends DurableObject<Env> {
	fetch(request: Request) {
		const url = new URL(request.url);
		const nickname = url.searchParams.get('nickname') ?? 'anon';
		const webSocketPair = new WebSocketPair();

		const [client, server] = Object.values(webSocketPair);

		this.ctx.acceptWebSocket(server);

		server.serializeAttachment({ nickname });

		return new Response(null, { status: 101, webSocket: client });
	}

	broadcast(message: string, exclude?: WebSocket) {
		for (const socket of this.ctx.getWebSockets()) {
			if (socket !== exclude) {
				socket.send(message);
			}
		}
	}

	webSocketMessage(ws: WebSocket, message: string) {
		const { nickname } = ws.deserializeAttachment() as { nickname: string };
		this.broadcast(`${nickname} said: ${message}`, ws);
	}

	webSocketClose(ws: WebSocket) {
		const { nickname } = ws.deserializeAttachment() as { nickname: string };
		this.broadcast(`${nickname} has left the building.`);
	}
}
