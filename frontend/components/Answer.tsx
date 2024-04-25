import dynamic from 'next/dynamic'
import { IconReload } from "@tabler/icons-react";
import { FC } from "react";
import { Toggle } from "@/components/Toggle";
import { SearchForm } from "@/elements/SearchForm";
import { HistoryItem } from "@/types";

// @ts-ignore
const VoiceRecorderElement = dynamic(() => import('@/elements/VoiceRecorder'), {
    ssr: false,
})

interface AnswerProps {
    answer: string | null;
    history: HistoryItem[];
    done: boolean;
    searchDocuments: boolean;
    onReset: () => void;
    setSearchDocuments: () => void;
    onAnswerUpdate: (answer: string) => void;
    updateHistory: (message: HistoryItem) => void;
    setLoading: Function;
    loading: boolean;
    keepRecording: boolean;
    setKeepRecording: (value: boolean) => void;
}

export const Answer: FC<AnswerProps> = ({
    history,
    answer,
    done,
    onReset,
    searchDocuments,
    setSearchDocuments,
    onAnswerUpdate,
    updateHistory,
    setLoading,
    loading,
    keepRecording,
    setKeepRecording
}) => {
    return (

        <>
            <div className="chat-history">
                {history.map((message, index) => (
                    <pre key={index} className={`chat-message ${message.role === "user" ? "human-message" : "ai-message"}`}>{message.content}</pre>
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
                <div className="">
                    <SearchForm
                        onAnswerUpdate={onAnswerUpdate}
                        updateHistory={updateHistory}
                        setLoading={setLoading}
                        disabled={loading || !done}
                        history={history}
                    />
                </div>
                <div className="continue-chat-settings">
                    <div className='settings'>
                        <Toggle active={false} onChangeFunction={setSearchDocuments} labelText="Search Documents" />
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
        </>
    );
};
