import dynamic from 'next/dynamic'
import { IconReload, } from "@tabler/icons-react";
import { FC, useContext, useEffect, useState, } from "react";
import { Toggle } from "@/components/Toggle";
import { SearchForm } from "@/elements/SearchForm";
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface } from "@/types";

// @ts-ignore
const VoiceRecorderElement = dynamic(() => import('@/elements/VoiceRecorder'), {
    ssr: false,
})

export const Answer: FC = () => {
    const store = useContext(StoreContext);
    const {
        setSearchDocuments,
        keepRecording,
        setKeepRecording,
        history,
        replaceHistory,
        setDone,
        setLoading,
        loading,
        answer,
        tokens,
        modifyHistory,
        setModifyHistory,
    } = store as StoreInterface;

    const [clickedHumanMessage, setClickedHumanMessage] = useState<number | undefined>(undefined);

    const onReset = () => {
        replaceHistory([]);
        setDone(false);
        setLoading(false);
    };

    const onChangeFunction = () => {
        setSearchDocuments((prev) => !prev);
    };

    const handleHumanMessageClick = (e: React.MouseEvent<HTMLPreElement, MouseEvent>) => {
        e.preventDefault();
        const target = e.target as HTMLPreElement;
        if (target && !target.classList.contains('human-message')) {
            return;
        }

        // return if it is the first message
        if (target.id === history[0].id) {
            return;
        }

        if (clickedHumanMessage !== undefined) {
            setClickedHumanMessage(undefined);
            return;
        }

        const index = history.findIndex((message) => message.id === target.id);
        setClickedHumanMessage(index);
    }

    useEffect(() => {
        // update the history when the clickedHumanMessage changes
        const newHistory = history.map((message, index) => {
            if (index >= clickedHumanMessage!) {
                return {
                    ...message,
                    toBeRemoved: true,
                };
            }
            return {
                ...message,
                toBeRemoved: false,
            };
        });

        replaceHistory(newHistory);

        if (clickedHumanMessage === undefined) {
            setModifyHistory(false);
        } else {
            setModifyHistory(true);
            // focus the search input
            const input = document.getElementById("search-input") as HTMLTextAreaElement;
            input.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickedHumanMessage]);

    useEffect(() => {
        if (!modifyHistory) {
            setClickedHumanMessage(undefined);
        }
    }, [modifyHistory]);


    return (
        <>
            <div className="chat-history">
                {history.map((message, index) => (
                    <pre
                        key={index}
                        id={message.id}
                        onClick={handleHumanMessageClick}
                        className={`chat-message ${message.role === "user" ? "human-message" : "ai-message"} ${clickedHumanMessage && clickedHumanMessage <= index && "remove-message"}`}>
                        {message.content}
                    </pre>
                ))}

                {loading && (
                    <div className="typing">
                        <div className="typing__dot"></div>
                        <div className="typing__dot"></div>
                        <div className="typing__dot"></div>
                    </div>

                )}

                {answer && (
                    <pre className="chat-message">
                        {answer}
                    </pre>
                )}
            </div>

            <div className="continue-chat-search-form">
                <div>
                    <SearchForm />
                </div>
                <div className="continue-chat-settings">
                    <div className='settings'>
                        <Toggle active={false} onChangeFunction={onChangeFunction} labelText="Search Documents" />
                        <VoiceRecorderElement keepRecording={keepRecording} setKeepRecording={setKeepRecording} />
                    </div>
                    <div>
                        <button
                            className="reset-button small outline secondary"
                            onClick={onReset}
                        >
                            <IconReload size={18} />
                            <span className="reset-button-text">Ask New Question</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="token-counter token-counter-history">
                Tokens: {tokens}
            </div>
        </>
    );
};
