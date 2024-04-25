import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import SearchHandler from "@/utils/handleSearch";
import { LLMChatHistoryMessage } from "@lmstudio/sdk";
import { HistoryItem } from "@/types";

interface SearchFormProps {
    onAnswerUpdate: (answer: string) => void;
    updateHistory: (message: HistoryItem) => void;
    setLoading: Function;
    disabled?: boolean;
    history?: HistoryItem[];
}

export const SearchForm: FC<SearchFormProps> = ({
    onAnswerUpdate,
    updateHistory,
    setLoading,
    disabled = false,
    history = [],
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<string>("");

    const handleSearch = async () => {
        setLoading(true);
        const useDocuments = (document.querySelector("input[name='Search Documents']") as HTMLInputElement).checked;
        const searchHandler = new SearchHandler(onAnswerUpdate, updateHistory, useDocuments);
        await searchHandler.handleStream(query, history as LLMChatHistoryMessage[]);
        setQuery("");
        setTimeout(() => {
            inputRef.current?.focus();
        }, 350);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="search-form">
            <IconSearch className="search-icon" />
            <input
                ref={inputRef}
                className="search-input"
                id="search-input"
                type="text"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />
            <button className="search-button" disabled={disabled}>
                <IconArrowRight
                    onClick={handleSearch}
                    className="arrow-icon"
                />
            </button>
        </div>
    )
};