import dynamic from 'next/dynamic'
import { IconBookmarkAi } from "@tabler/icons-react";
import { FC, useContext } from "react";
import { Toggle } from "@/components/Toggle";
import { SearchForm } from "@/elements/SearchForm";
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface } from "@/types";

// @ts-ignore
const VoiceRecorderElement = dynamic(() => import('@/elements/VoiceRecorder'), {
    ssr: false,
})

export const Search: FC = () => {
    const store = useContext(StoreContext);
    const {
        setSearchDocuments,
        keepRecording,
        setKeepRecording,
    } = store as StoreInterface;

    const onChangeFunction = () => {
        setSearchDocuments((prev) => !prev);
    };

    return (
        <div className="answer-page">
            <div className="logo">
                <IconBookmarkAi size={36} />
                <div className="brand-name">Monday</div>
            </div>
            <SearchForm />
            <div className='settings'>
                <Toggle active={false} onChangeFunction={onChangeFunction} labelText="Search Documents" />
                <VoiceRecorderElement keepRecording={keepRecording} setKeepRecording={setKeepRecording} />
            </div>
        </div>
    );
};
