import { createContext, useState } from "react";
import { LLMChatHistoryMessage } from "@lmstudio/sdk";
import { StoreInterface, ChatHistoryMessage } from "@/types";

const systemMessage = {
    "content": "You are a helpful AI assistant named Monday. You have a professional tone and a sarcastic attitude with dark humor. You complete every task and request as best you can. You think through every task step by step to make sure you give the best possible answer. You always end with an open-ended question to continue the chat. Always answer in English.",
    "role": "system",
    "id": 0,
} as LLMChatHistoryMessage;

export const StoreContext = createContext<StoreInterface | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [showPromptTemplates, setShowPromptTemplates] = useState<boolean>(false);
    const [searchDocuments, setSearchDocuments] = useState<boolean>(false);
    const [keepRecording, setKeepRecording] = useState<boolean>(false);
    const [modifyHistory, setModifyHistory] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [history, setHistory] = useState<ChatHistoryMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [tokens, setTokens] = useState<number>(0);
    const [done, setDone] = useState<boolean>(false);

    const [llmSettings, setLlmSettings] = useState({
        temperature: 0.1,
        max_tokens: 512,
        chatEndpoint: "http://localhost:1234/v1",
        chatEndpointApiKey: "lm-studio",
        qdrantHost: "127.0.0.1",
        qdrantPort: 6333,
        sttEndpoint: "http://localhost:8000/stt",
        tssEndpoint: "http://localhost:8000/tts",
        useCloudVoice: false,
        systemMessage: systemMessage,
    });

    function updateAnswer(value: string) {
        setAnswer((prev) => prev + value);
        setLoading(false);
    }

    const updateHistory = (message: ChatHistoryMessage) => {
        setHistory(prevHistory => [
            ...prevHistory,
            message,
        ]);
        setAnswer("");
        setDone(true);
    };

    const replaceHistory = (newHistory: ChatHistoryMessage[]) => {
        setHistory(newHistory);
    };

    return (
        <StoreContext.Provider
            value={{
                showPromptTemplates,
                setShowPromptTemplates,
                searchDocuments,
                setSearchDocuments,
                keepRecording,
                setKeepRecording,
                showSettings,
                setShowSettings,
                history,
                setHistory,
                loading,
                setLoading,
                answer,
                setAnswer,
                query,
                setQuery,
                done,
                setDone,
                updateAnswer,
                updateHistory,
                tokens,
                setTokens,
                llmSettings,
                setLlmSettings,
                modifyHistory,
                setModifyHistory,
                replaceHistory,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};