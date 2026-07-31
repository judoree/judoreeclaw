import { AIChatAgent } from "@cloudflare/ai-chat";
import { getAgentByName, routeAgentRequest } from "agents";
import { embedMany } from "ai";
import { createWorkersAI } from "workers-ai-provider";

export class RAGAgent extends AIChatAgent<Env> {
  async convert(fileName: string, buffer: ArrayBuffer, fileType: string) {
    const result = await this.env.AI.toMarkdown({
      name: fileName,
      blob: new Blob([buffer], { type: fileType }),
    });
    if (result.format === "error") throw new Error("Could not convert");
    return result.data;
  }

  async embedChunks(chunks: string[]) {
    const workersAi = createWorkersAI({ binding: this.env.AI });
    const { embeddings } = await embedMany({
      model: workersAi.textEmbeddingModel("@cf/baai/bge-base-en-v1.5"),
      values: chunks,
    });
    console.log(embeddings[0].length);
  }

  async ingestPdf(buffer: ArrayBuffer, fileName: string, fileType: string) {
    const markdown = await this.convert(fileName, buffer, fileType);
    const chunks = markdown.split("\n\n\n");
    const embeddings = await this.embedChunks(chunks);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/upload") {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const buffer = await file.arrayBuffer();
      const fileName = `${Date.now()}-${file.name}`;
      await env.FILES.put(fileName, buffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });
      const stub = await getAgentByName(env.RAGAgent, "default");
      await stub.ingestPdf(buffer, fileName, file.type);
      return new Response("ok");
    }
    return (
      routeAgentRequest(request, env) ?? new Response(null, { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
