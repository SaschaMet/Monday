import OpenAI from 'openai';
import { useEffect, useState, useContext, use } from 'react';
import { Toggle } from "@/components/Toggle";
import { IconMicrophone } from '@tabler/icons-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface, ChatHistoryMessage } from "@/types";
import { generateUuid } from "@/utils/generateUuid";
import ChatHandler from '@/utils/handleChat';

const VoiceRecorder = () => {

    const store = useContext(StoreContext);
    const { llmSettings, history, updateHistory, setTokens, replaceHistory, updateAnswer, setModifyHistory, setLoading, keepRecording, setKeepRecording } = store as StoreInterface;
    const {
        sttEndpoint,
        tssEndpoint,
    } = llmSettings;

    const [recording, setRecording] = useState(false);

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

    const playBeep = async () => {
        const file = "/beep.mp3"
        const audio = new Audio(file);
        audio.play();
    }

    async function playAudio(audioBlob: Blob) {
        try {
            if (audioBlob) {
                const audio = new Audio();
                audio.src = URL.createObjectURL(audioBlob);
                audio.playbackRate = 1.25;
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

            await playAudio(ttsResponse as Blob);

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
        if (recordingTime > 15) {
            console.error('Recording time too long');
            return;
        }

        playBeep();
        tts(recordingBlob, 'audio/wav');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordingBlob])


    function keyHandler(event: any) {
        const inputElement = document.querySelector('input[name="Voice Chat"]') as HTMLInputElement;
        if (inputElement && inputElement.checked) {
            if (event.key === ' ') {
                inputElement.blur();
                setRecording(prevRecording => !prevRecording);
            }
        }
    }

    useEffect(() => {
        const searchInput = document.querySelector('.search-input') as HTMLTextAreaElement;
        const searchButton = document.querySelector('.search-button') as HTMLButtonElement;
        if (keepRecording) {
            searchInput.disabled = true;
            searchButton.disabled = true;
        } else {
            searchInput.disabled = false;
            searchButton.disabled = false;
        }
    }, [keepRecording]);

    useEffect(() => {
        if (recording) {
            startRecording();
        } else {
            stopRecording();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recording]);

    useEffect(() => {
        document.addEventListener('keypress', keyHandler);
        return () => {
            document.removeEventListener('keypress', keyHandler);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className='voice-recorder'>
                <Toggle active={keepRecording} onChangeFunction={() => setKeepRecording(!keepRecording)} labelText="Voice Chat" />
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