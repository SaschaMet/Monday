import OpenAI from 'openai';
import Qdrant from "./qdrant";
import { countHistoryTokens } from '@/utils/countHistoryTokens';
import { generateUuid } from "@/utils/generateUuid";
import { LmmSettings, ChatHistoryMessage } from "@/types";

class ChatHandler {
    private onAnswerUpdate: Function;
    private updateHistory: Function;
    private setTokens: Function;
    private llmSettings: LmmSettings;
    private qdrant: Qdrant;
    private llm: OpenAI;
    private replaceHistory: Function;
    private setModifyHistory: Function;

    constructor(onAnswerUpdate: Function, updateHistory: Function, setTokens: Function, llmSettings: LmmSettings, replaceHistory: Function, setModifyHistory: Function) {
        this.onAnswerUpdate = onAnswerUpdate;
        this.setTokens = setTokens;
        this.updateHistory = updateHistory;
        this.llmSettings = llmSettings;
        this.replaceHistory = replaceHistory;
        this.setModifyHistory = setModifyHistory;
        this.qdrant = new Qdrant(llmSettings.qdrantHost, llmSettings.qdrantPort);
        this.llm = new OpenAI({
            baseURL: this.llmSettings.chatEndpoint,
            apiKey: this.llmSettings.chatEndpointApiKey,
            dangerouslyAllowBrowser: true
        });
    }

    prepareHistory(history: ChatHistoryMessage[]) {
        let messages = [
            ...history,
        ] as ChatHistoryMessage[];

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



    async chat(query: string, history: ChatHistoryMessage[] = [], useDocuments = false, streamResponse: Boolean = false) {
        try {
            if (!query) {
                alert("Please enter a query");
                return;
            }

            const humanMessage = {
                "content": query.trim(),
                "role": "user",
                "id": generateUuid(),
            } as ChatHistoryMessage;

            // check if the history includes messages which need to be removed
            const historyWithoutRemovedMessages = history.filter((message) => !message.toBeRemoved);

            // if the history includes messages which need to be removed, update the history
            if (historyWithoutRemovedMessages.length !== history.length) {
                this.replaceHistory(historyWithoutRemovedMessages);
                this.setModifyHistory(false)
            }

            let messages = [
                ...historyWithoutRemovedMessages
            ] as ChatHistoryMessage[];

            // if the first message is not the system message, add it to the messages
            if (messages.length === 0 || messages[0].role !== "system") {
                messages = [this.llmSettings.systemMessage, ...messages];
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

            if (useDocuments) {
                const ragAnswer = await this.handleRag(query);
                const ragMessage = {
                    "content": ragAnswer,
                    "role": "user",
                    "id": generateUuid(),
                } as ChatHistoryMessage;
                messages.push(ragMessage);
            }

            // count the tokens of the history
            countHistoryTokens(messages, this.setTokens);

            const aiMessage = {
                "content": "",
                "id": generateUuid(),
                "role": "assistant",
            } as ChatHistoryMessage;

            if (streamResponse) {
                const stream = this.llm.beta.chat.completions.stream({
                    messages,
                    max_tokens: this.llmSettings.max_tokens,
                    temperature: this.llmSettings.temperature,
                    model: this.llmSettings.model,
                })

                const chunks = [];
                for await (const chunk of stream) {
                    this.onAnswerUpdate(chunk.choices[0].delta.content);
                    chunks.push(chunk.choices[0].delta.content);
                }

                aiMessage.content = chunks.join("");
            } else {
                const aiResponse = await this.llm.chat.completions.create({
                    messages,
                    max_tokens: this.llmSettings.max_tokens,
                    temperature: this.llmSettings.temperature,
                    model: this.llmSettings.model,
                })
                aiMessage.content = aiResponse.choices[0].message.content!;
            }

            countHistoryTokens([
                ...messages,
                aiMessage,
            ], this.setTokens);

            this.updateHistory(aiMessage);

            return aiMessage.content;
        } catch (err) {
            console.error(err);
        }
    };
}

export default ChatHandler;


