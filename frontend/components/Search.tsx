import dynamic from 'next/dynamic'
import { IconBookmarkAi } from "@tabler/icons-react";
import { FC } from "react";
import { Toggle } from "@/components/Toggle";
import { SearchForm } from "@/elements/SearchForm";
import { HistoryItem, SearchQuery } from "@/types";

interface SearchProps {
    onAnswerUpdate: (answer: string) => void;
    updateHistory: (message: HistoryItem) => void;
    setSearchDocuments: () => void;
    setLoading: Function;
    keepRecording: boolean;
    setKeepRecording: (value: boolean) => void;
}

// @ts-ignore
const VoiceRecorderElement = dynamic(() => import('@/elements/VoiceRecorder'), {
    ssr: false,
})


export const Search: FC<SearchProps> = ({ onAnswerUpdate, setSearchDocuments, updateHistory, setLoading, keepRecording, setKeepRecording }) => {
    return (
        <div className="answer-page">
            <div className="logo">
                <IconBookmarkAi size={36} />
                <div className="brand-name">Monday</div>
            </div>
            <SearchForm
                onAnswerUpdate={onAnswerUpdate}
                updateHistory={updateHistory}
                setLoading={setLoading}
            />
            <div className='settings'>
                <Toggle active={false} onChangeFunction={setSearchDocuments} labelText="Search Documents" />
                <VoiceRecorderElement keepRecording={keepRecording} setKeepRecording={setKeepRecording} />
            </div>
        </div>
    );
};
