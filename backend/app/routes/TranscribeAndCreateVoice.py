import os
import torch
import soundfile as sf
from google.cloud import texttospeech
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import (
    AutoModelForSpeechSeq2Seq,
    AutoProcessor,
    AutoTokenizer,
    pipeline,
)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
    "/Users/saschametzger/.config/gcloud/application_default_credentials.json"
)


class TranscribeAndCreateVoice:
    """Transcribe and Create Voice"""

    def __init__(self):
        self.device = "cpu"
        self.torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        self.stt_model_id = "distil-whisper/distil-large-v3"
        self.whisper_model = AutoModelForSpeechSeq2Seq.from_pretrained(
            self.stt_model_id,
            torch_dtype=self.torch_dtype,
            use_safetensors=True,
        ).to(self.device)
        self.whisper_processor = AutoProcessor.from_pretrained(
            self.stt_model_id,
        )
        self.tts_client_google = texttospeech.TextToSpeechClient()
        self.tts_model = ParlerTTSForConditionalGeneration.from_pretrained(
            "parler-tts/parler_tts_mini_v0.1"
        ).to(self.device)
        self.tts_tokenizer = AutoTokenizer.from_pretrained(
            "parler-tts/parler_tts_mini_v0.1"
        )

    def transcribe(self, audio_file):
        """Transcribe"""
        whisper_pipe = pipeline(
            "automatic-speech-recognition",
            model=self.whisper_model,
            tokenizer=self.whisper_processor.tokenizer,
            feature_extractor=self.whisper_processor.feature_extractor,
            max_new_tokens=386,
            chunk_length_s=30,
            batch_size=16,
            return_timestamps=True,
            torch_dtype=self.torch_dtype,
            device=self.device,
        )
        return whisper_pipe(audio_file)["text"]

    def text_to_speech_google(self, text: str, file_path: str):
        """Synthesizes speech from the input string of text."""
        input_text = texttospeech.SynthesisInput(text=text)

        voice = texttospeech.VoiceSelectionParams(
            language_code="de-DE", name="de-DE-Standard-F"  # de-DE-Neural2-F
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.LINEAR16, speaking_rate=1
        )

        response = self.tts_client_google.synthesize_speech(
            request={"input": input_text, "voice": voice, "audio_config": audio_config}
        )

        # The response's audio_content is binary.
        with open(file_path, "wb") as out:
            out.write(response.audio_content)
            print("Audio content written to file.")

    def text_to_speech_local(self, text: str, file_path: str):
        """Text to Speech Local"""
        description = "A female speaker with a slightly low-pitched voice delivers her words strong and expressively, in a very confined sounding environment with clear audio quality."

        input_ids = self.tts_tokenizer(description, return_tensors="pt").input_ids.to(
            self.device
        )
        prompt_input_ids = self.tts_tokenizer(text, return_tensors="pt").input_ids.to(
            self.device
        )

        generation = self.tts_model.generate(
            input_ids=input_ids, prompt_input_ids=prompt_input_ids
        )
        audio_arr = generation.cpu().numpy().squeeze()
        sf.write(file_path, audio_arr, self.tts_model.config.sampling_rate)
