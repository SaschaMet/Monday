import { QdrantClient } from '@qdrant/js-client-rest';
import { CohereClient } from "cohere-ai";

class Qdrant {
    private client: QdrantClient;
    private co: CohereClient;

    constructor(host: string, port: number) {
        this.client = new QdrantClient({ host, port });
        this.co = new CohereClient({
            token: "",
        });
    }

    async reCreateCollection(collection: string) {
        await this.client.recreateCollection(collection, {
            vectors: {
                size: 1024,
                distance: 'Cosine',
            }
        });
    }

    async createQueryVector(query: string) {
        const queryVector = await this.co.embed({
            texts: [query],
            model: 'embed-multilingual-v3.0',
            inputType: 'search_query',
        }).then((res: any) => {
            return res.embeddings[0];
        });
        return queryVector;
    }

    async search(collection: string, query: string, limit: number = 5) {
        const queryVector = await this.createQueryVector(query);
        return await this.client.search(collection, {
            vector: queryVector,
            limit,
        });
    }
}

export default Qdrant;