import { env } from "../../config/env.js";
import { geminiClient } from "../llm/gemini.client.js";
import type { EmbeddingProvider } from "./embedding.provider.js";

/**
 * Gemini embedding provider. Uses `gemini-embedding-2` by default.
 *
 * Gemini accepts arrays in a single request, so `embedBatch` is one round-trip
 * rather than N. Be mindful of token-per-minute limits on the free tier when
 * batching very large corpora — the sync worker chunks into batches of ~50.
 */
export class GeminiEmbeddingProvider implements EmbeddingProvider {
  readonly modelName = env.GEMINI_EMBEDDING_MODEL;
  readonly dimensions = env.GEMINI_EMBEDDING_DIMENSIONS;

  async embed(text: string): Promise<number[]> {
    const [vec] = await this.embedBatch([text]);
    if (!vec) throw new Error("Empty embedding response from Gemini");
    return vec;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const res = await geminiClient.models.embedContent({
      model: this.modelName,
      contents: texts,
      config: { outputDimensionality: this.dimensions },
    });

    const out = (res.embeddings ?? []).map((e) => e.values ?? []);
    if (out.length !== texts.length) {
      throw new Error(
        `Embedding count mismatch: requested ${texts.length}, got ${out.length}`,
      );
    }
    return out;
  }
}
