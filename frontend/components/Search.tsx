import Image from 'next/image'
import dynamic from 'next/dynamic'
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
    } = store as StoreInterface;

    const onChangeFunction = () => {
        setSearchDocuments((prev) => !prev);
    };

    return (
        <div className="answer-page">
            <div className="logo">
                <Image
                    src="/favicon_package/favicon-32x32.png"
                    width={32}
                    height={32}
                    alt="Monday Logo"
                />
                <div className="brand-name">Monday AI</div>
            </div>
            <SearchForm />
            <div className='settings'>
                <Toggle active={false} onChangeFunction={onChangeFunction} labelText="Search Documents" />
                <VoiceRecorderElement />
            </div>
        </div>
    );
};
