import { LLMChatHistory, LLMChatHistoryMessage } from "@lmstudio/sdk";
import { generateUuid } from "@/utils/generateUuid";
import Qdrant from "./qdrant";
import OpenAI from 'openai';

const systemMessage = {
    "content": "You are a helpful AI assistant named Monday. You have a professional tone and a sarcastic attitude with a mix of sarcasm and dark humor. You complete every task and request as best you can. You think through every task step by step to make sure you give the best possible answer. You always end with a open ended question to continue the chat.",
    "role": "system",
    "id": generateUuid(),
} as LLMChatHistoryMessage;


class SearchHandler {
    private useDocuments: boolean;
    private onAnswerUpdate: Function;
    private updateHistory: Function;
    private qdrant: Qdrant;
    private llm: OpenAI;

    constructor(onAnswerUpdate: Function, updateHistory: Function, useDocuments: boolean) {
        this.onAnswerUpdate = onAnswerUpdate;
        this.useDocuments = useDocuments;
        this.updateHistory = updateHistory;
        this.qdrant = new Qdrant();
        this.llm = new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: "lm-studio", dangerouslyAllowBrowser: true });
    }

    prepareHistory(history: LLMChatHistory) {
        let messages = [
            ...history,
        ] as LLMChatHistory;

        // make sure the messages are clean and easy to understand for the AI
        messages = messages
            .map((message) => ({
                ...message,
                content: message.content.replace(/[\n\r]/g, " "),
            }))
            .map((message) => ({
                ...message,
                content: message.content.startsWith(" ") ? message.content.slice(1) : message.content,
            }))
            .map((message) => ({
                ...message,
                content: message.content.endsWith(" ") ? message.content.slice(0, -1) : message.content,
            }));

        return messages;
    }

    async handleRag(query: string) {
        try {
            const rageResponse = await this.qdrant.search("documents", query, 4);
            if (!rageResponse) {
                throw new Error("No response from Qdrant");
            }
            const documents = rageResponse.map(res => res.payload).filter(n => n);
            const ragAnswer = documents.map(doc => doc!.content).join("\n\n");
            const prompt = `Use the following pieces of retrieved context to answer the question. If you don't know the answer or the context does not include an answer, say so. Make sure you answer the question in a way that is relevant to the context provided. Your response should answer the question fully and accurately.
<context>
    ${ragAnswer}
</context>`;
            return prompt;
        } catch (err) {
            console.error(err);
        }
    }

    async handleStream(query: string, history: LLMChatHistory = []) {
        try {
            if (!query) {
                alert("Please enter a query");
                return;
            }

            const humanMessage = {
                "content": query,
                "role": "user",
                "id": generateUuid(),
            } as LLMChatHistoryMessage;

            let messages = [
                ...history,
            ] as LLMChatHistory;

            // if the first message is not the system message, add it to the messages
            if (messages.length === 0 || messages[0].role !== "system") {
                messages = [systemMessage, ...messages];
            }

            // if the content of the human message does not end with a question mark, a period, or an exclamation mark, add a dot at the end
            if (!/[.!?]$/.test(humanMessage.content)) {
                humanMessage.content += ".";
            }
            // add \n\n to the end of the human message (this is important for the AI to understand the end of the message)
            humanMessage.content += "\n\n";

            this.updateHistory(humanMessage);

            // prepare the history for the AI
            messages = this.prepareHistory(messages);

            // add the human message to the messages
            messages.push(humanMessage);

            if (this.useDocuments) {
                const ragAnswer = await this.handleRag(query);
                const ragMessage = {
                    "content": ragAnswer,
                    "role": "user",
                    "id": generateUuid(),
                } as LLMChatHistoryMessage;
                messages.push(ragMessage);
            }

            const stream = this.llm.beta.chat.completions.stream({
                messages,
                max_tokens: 512,
                temperature: 0.1,
                model: "",
            })

            const chunks = [];
            for await (const chunk of stream) {
                this.onAnswerUpdate(chunk.choices[0].delta.content);
                chunks.push(chunk.choices[0].delta.content);
            }

            const aiMessage = {
                "content": chunks.join(""),
                "id": generateUuid(),
                "role": "assistant",
            } as LLMChatHistoryMessage;

            this.updateHistory(aiMessage);
        } catch (err) {
            console.error(err);
        }
    };
}

export default SearchHandler;


