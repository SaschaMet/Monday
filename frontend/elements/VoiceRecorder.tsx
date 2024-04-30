import OpenAI from 'openai';
import { useEffect } from 'react';
import { Toggle } from "@/components/Toggle";
import { IconMicrophone } from '@tabler/icons-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface, ChatHistoryMessage } from "@/types";
import { useContext } from "react";
import { generateUuid } from "@/utils/generateUuid";
import ChatHandler from '@/utils/handleChat';

interface VoiceRecorderProps {
    keepRecording: boolean;
    setKeepRecording: (value: boolean) => void;
}

const VoiceRecorder = ({ keepRecording, setKeepRecording }: VoiceRecorderProps) => {
    const store = useContext(StoreContext);
    const { llmSettings, history, updateHistory, setTokens, replaceHistory, updateAnswer, setModifyHistory, setLoading } = store as StoreInterface;
    const {
        sttEndpoint,
        tssEndpoint,
    } = llmSettings;

    const chatHandler = new ChatHandler(updateAnswer, updateHistory, setTokens, llmSettings, replaceHistory, setModifyHistory);

    const llm = new OpenAI({
        baseURL: llmSettings.chatEndpoint,
        apiKey: llmSettings.chatEndpointApiKey,
        dangerouslyAllowBrowser: true
    });

    const {
        stopRecording,
        startRecording,
        isRecording,
        recordingBlob,
        recordingTime,
    } = useAudioRecorder({
        noiseSuppression: true,
        echoCancellation: true,
    });

    function playAudio(audioBlob: Blob) {
        try {
            if (audioBlob) {
                const audio = new Audio();
                audio.src = URL.createObjectURL(audioBlob);
                audio.playbackRate = 1.6;
                audio.play();
            }
        } catch (error) {
            console.error('Error playing audio:');
            console.error(error);
        }
    }

    async function tts(audioBlob: Blob, fileType: string) {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('audio_data', audioBlob, 'file');
            formData.append('file_type', fileType);
            const response = await fetch(sttEndpoint, {
                method: 'POST',
                body: formData,
            }).then(res => res.json());

            const aiResponse = await llm.chat.completions.create({
                messages: [
                    {
                        "content": `Here is a transcription of a microphone recording. The recording might contain things like uhm, ohm, etc. and it also might not be grammatically correct. Please have a look at this transcription and convert it into a coherent, cohesive and overall correct piece of text. The resulting text should be short and to the point. You MUST return only the final piece of text and nothing else - do NOT try to answer any questions or add things to the text.

                        Here is an example:
                        <transcription>
                            uhm when ... was the mozart born actually ?
                        </transcription>

                        Output: When was Mozart born?

                        Now please convert the following transcription into a coherent, cohesive and overall correct piece of text:
                        <transcription>
                            ${response.text}
                        </transcription>

                        Output:`,
                        "role": "user",
                        "id": generateUuid(),
                    }
                ] as unknown as ChatHistoryMessage[],
                max_tokens: 128,
                temperature: 0.0,
                model: "",
            })

            const aiMessageContent = aiResponse.choices[0].message.content!;

            const sttAIMessage = await chatHandler.chat(aiMessageContent, history, false);

            const ttsResponse = await fetch(tssEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: sttAIMessage,
                }),
            }).then(res => res.blob());

            playAudio(ttsResponse as Blob);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    useEffect(() => {
        // recordingBlob will be present at this point after 'stopRecording' has been called
        if (!recordingBlob) {
            return;
        }
        if (recordingTime > 25) {
            console.error('Recording time too long');
            return;
        }
        tts(recordingBlob, 'audio/wav');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordingBlob])

    return (
        <>
            <div className='voice-recorder'>
                {/* <Toggle active={keepRecording} onChangeFunction={() => setKeepRecording(!keepRecording)} labelText="Voice Chat" /> */}
                <button
                    onClick={toggleRecording}
                    className={`outline secondary small recording-button ${isRecording && "isRecording"}`}>
                    {isRecording ? "Stop" : "Start"} Recording <IconMicrophone size={16} />
                </button>
            </div>
        </>
    )
};

export default VoiceRecorder;