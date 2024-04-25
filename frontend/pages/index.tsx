import Head from "next/head";
import { Answer } from "@/components/Answer";
import { Search } from "@/components/Search";
import { useState } from "react";
import { HistoryItem } from "@/types";

export default function Home() {
    const [searchDocuments, setSearchDocuments] = useState<boolean>(false);
    const [keepRecording, setKeepRecording] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>("");
    const [done, setDone] = useState<boolean>(false);

    function updateAnswer(value: string) {
        setAnswer((prev) => prev + value);
        window.scrollTo(0, document.body.scrollHeight);
        setLoading(false);
    }

    const updateHistory = (message: HistoryItem) => {
        setHistory(prevHistory => [
            ...prevHistory,
            message,
        ]);
        setAnswer("");
        setDone(true);
    };


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
            <div className="container">
                {Boolean(answer.length) || Boolean(history.length) || loading ? (
                    <Answer
                        searchDocuments={searchDocuments}
                        setSearchDocuments={() => setSearchDocuments(!searchDocuments)}
                        history={history}
                        answer={answer}
                        done={done}
                        onReset={() => {
                            setHistory([]);
                            setDone(false);
                            setLoading(false);
                        }}
                        onAnswerUpdate={updateAnswer}
                        updateHistory={updateHistory}
                        setLoading={setLoading}
                        loading={loading}
                        keepRecording={keepRecording}
                        setKeepRecording={setKeepRecording}
                    />
                ) : (
                    <Search
                        setSearchDocuments={() => setSearchDocuments(!searchDocuments)}
                        onAnswerUpdate={updateAnswer}
                        updateHistory={updateHistory}
                        setLoading={setLoading}
                        keepRecording={keepRecording}
                        setKeepRecording={setKeepRecording}
                    />
                )}
            </div>
        </>
    );
}
