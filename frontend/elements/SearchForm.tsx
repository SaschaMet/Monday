import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { countTokens } from "@/utils/countTokens";
import ChatHandler from "@/utils/handleChat";
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface } from "@/types";

export const SearchForm: FC = () => {
    const store = useContext(StoreContext);
    const {
        loading,
        setLoading,
        updateAnswer,
        updateHistory,
        setTokens,
        llmSettings,
        history,
        query,
        setQuery,
        replaceHistory,
        setModifyHistory,
    } = store as StoreInterface;
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [queryTokens, setQueryTokens] = useState<number>(0);
    const chatHandler = new ChatHandler(updateAnswer, updateHistory, setTokens, llmSettings, replaceHistory, setModifyHistory);

    const chat = async () => {
        setLoading(true);
        setQuery("");
        const useDocuments = (document.querySelector("input[name='Search Documents']") as HTMLInputElement).checked;
        await chatHandler.chat(query, history, useDocuments, true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 1500);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            chat();
        }
    };

    useEffect(() => {
        const idleTimeout = setTimeout(() => {
            setQueryTokens(countTokens(query));
        }, 500);
        return () => clearTimeout(idleTimeout);
    }, [query, setQueryTokens]);


    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <div className="search-form">
                <IconSearch className="search-icon" />
                <textarea
                    ref={inputRef}
                    className="search-input"
                    id="search-input"
                    rows={2}
                    placeholder="Ask anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button className="search-button" id="search-button" disabled={loading} onClick={chat}>
                    <IconArrowRight className="arrow-icon" />
                </button>
            </div>
            <div className="token-counter token-counter-query">
                Tokens: {queryTokens}
            </div>
        </>
    )
};