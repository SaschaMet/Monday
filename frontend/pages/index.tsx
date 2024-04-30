import Head from "next/head";
import { useContext } from "react";
import { Answer } from "@/components/Answer";
import { Search } from "@/components/Search";
import { IconBookmarkAi } from "@tabler/icons-react";
import { SettingsModal } from "@/elements/SettingsModal";
import { PromptTemplateModal } from "@/elements/PromptTemplateModal";
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface } from "@/types";

export default function Home() {

    const store = useContext(StoreContext);
    const {
        showPromptTemplates,
        setShowPromptTemplates,
        showSettings,
        setShowSettings,
        answer,
        history,
        loading,
    } = store as StoreInterface;

    return (
        <>
            <Head>
                <title>Monday AI</title>
                <meta
                    name="description"
                    content="AI-powered search."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/favicon.png"
                />
            </Head>
            <div className="nav-wrapper">
                <div className="container">
                    <nav>
                        <div>
                            <IconBookmarkAi scale={12} />
                        </div>
                        <div>
                            <ul>
                                <li onClick={() => setShowPromptTemplates(true)} >Prompt Templates</li>
                                <li onClick={() => setShowSettings(true)} >Settings</li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="container">
                {Boolean(answer.length) || Boolean(history.length) || loading ? (
                    <Answer />
                ) : (
                    <Search />
                )}
            </div>
            {showSettings && (
                <SettingsModal
                    setShowSettings={setShowSettings}
                />
            )}
            {showPromptTemplates && (
                <PromptTemplateModal
                    setShowPromptTemplateModal={setShowPromptTemplates}
                    handleSave={() => console.log("Save prompt templates")}
                />
            )}
        </>
    );
}
