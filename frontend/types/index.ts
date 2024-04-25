import { LLMChatHistoryRole } from "@lmstudio/sdk";

export type Source = {
    url: string;
    text: string;
};

export type SearchQuery = {
    query: string;
};

export type HistoryItem = {
    "content": string,
    "id"?: string,
    "role": "user" | "assistant" | "system",
};