import { LLMChatHistoryMessage } from "@lmstudio/sdk";

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

export interface LmmSettings {
    temperature: number;
    max_tokens: number;
    chatEndpoint: string;
    chatEndpointApiKey: string;
    qdrantHost: string;
    qdrantPort: number;
    sttEndpoint: string;
    tssEndpoint: string;
    useCloudVoice: boolean;
    systemMessage: HistoryItem;
};

export interface StoreInterface {
    showPromptTemplates: boolean;
    setShowPromptTemplates: React.Dispatch<React.SetStateAction<boolean>>;

    searchDocuments: boolean;
    setSearchDocuments: React.Dispatch<React.SetStateAction<boolean>>;

    keepRecording: boolean;
    setKeepRecording: React.Dispatch<React.SetStateAction<boolean>>;

    showSettings: boolean;
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;

    history: HistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
    updateHistory: (message: HistoryItem) => void;

    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;

    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;

    answer: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
    updateAnswer: (value: string) => void;

    done: boolean;
    setDone: React.Dispatch<React.SetStateAction<boolean>>;

    tokens: number;
    setTokens: React.Dispatch<React.SetStateAction<number>>;

    llmSettings: LmmSettings;
    setLlmSettings: React.Dispatch<React.SetStateAction<LmmSettings>>;

    modifyHistory: boolean;
    setModifyHistory: React.Dispatch<React.SetStateAction<boolean>>;

    replaceHistory: (newHistory: HistoryItem[]) => void;
}


export interface ChatHistoryMessage extends LLMChatHistoryMessage {
    toBeRemoved?: boolean;
}