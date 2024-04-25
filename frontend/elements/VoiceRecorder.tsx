import { useEffect, useState } from 'react';
import { Toggle } from "@/components/Toggle";
import { IconMicrophone } from '@tabler/icons-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';

interface VoiceRecorderProps {
    keepRecording: boolean;
    setKeepRecording: (value: boolean) => void;
}

const VoiceRecorder = ({ keepRecording, setKeepRecording }: VoiceRecorderProps) => {
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
                audio.playbackRate = 1.2;
                audio.play();
            }
        } catch (error) {
            console.error('Error playing audio:');
            console.error(error);
        }
    }

    async function tts(audioBlob: Blob, fileType: string) {
        try {
            const formData = new FormData();
            const apiUrl = "http://localhost:8000/stt";
            formData.append('audio_data', audioBlob, 'file');
            formData.append('file_type', fileType);
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            }).then(res => res.json());

            console.log('Response: ', response);

            // => get the text response, create an AI response and convert it to audio

            // const answer = await response.blob();
            // playAudio(answer as any);
        } catch (error) {
            console.error('Error tts');
            console.error(error);
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
        playAudio(recordingBlob);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordingBlob])

    return (
        <>
            <div className='voice-recorder'>
                <Toggle active={keepRecording} onChangeFunction={() => setKeepRecording(!keepRecording)} labelText="Keep Recording" />
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