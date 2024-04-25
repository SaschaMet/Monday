import type { NextApiRequest, NextApiResponse } from 'next'
import googleTTS from '@google-cloud/text-to-speech';
import googleSTS from '@google-cloud/speech';
import fs from 'fs';

type ResponseData = {
    message: string
}

export default async function handler(
    req: any,
    res: NextApiResponse<ResponseData>
) {
    try {

        const data = await req.formData();

        console.log('Request received. File type: ', data.file_type);

        // if (!audioData) {
        //     throw new Error('No audio data found in request');
        // }

        // // save the audio file
        // await fs.writeFileSync('output.wav', audioData, 'binary');


        // const ttsClient = new googleTTS.TextToSpeechClient({
        //     keyFilename: "/Users/saschametzger/.config/gcloud/application_default_credentials.json"
        // });
        // const sttClient = new googleSTS.SpeechClient({
        //     keyFilename: "/Users/saschametzger/.config/gcloud/application_default_credentials.json"
        // });

        // console.log('Request received');


        // const [response] = await sttClient.recognize({
        //     config: {
        //         encoding: 'LINEAR16',
        //         sampleRateHertz: 16000,
        //         languageCode: "de-DE",
        //     },
        //     audio: {
        //         content: req.body.audio_data
        //     },
        // });

        // if (!response.results) {
        //     throw new Error('No results found - STT Request');
        // }

        // const transcription = response.results
        //     .map(result => result.alternatives![0].transcript)
        //     .join('\n');
        // console.log('Transcription: ', transcription);

        // // Construct the request
        // const request = {
        //     input: { text: text },
        //     // Select the language and SSML voice gender (optional)
        //     voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        //     // select the type of audio encoding
        //     audioConfig: { audioEncoding: 'WAV' },
        // } as any;

        // const [response] = await ttsClient.synthesizeSpeech(request);

        // await fs.writeFileSync('output.wav', response.audioContent as any, 'binary');
        // console.log('Audio content written to file: output.wav');

        res.status(200).json({ message: 'Hello from Next.js!' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' })
    }
}