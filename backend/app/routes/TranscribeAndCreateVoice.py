# pylint: disable= E0611 E0401 W0718
import base64
import os
from dotenv import load_dotenv
import requests
from google.cloud import texttospeech

load_dotenv()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)


class TranscribeAndCreateVoice:
    """Transcribe and Create Voice"""

    def __init__(self):

        self.tts_client_google = texttospeech.TextToSpeechClient()

    def speech_to_text(self, audio_data):
        """Transcribe Online"""
        try:
            audi_file_base_64 = None
            with open(audio_data, "rb") as f:
                audi_file_base_64 = base64.b64encode(f.read())
                audi_file_base_64 = audi_file_base_64.decode("utf-8")

            url = "https://api.runpod.ai/v2/faster-whisper/runsync"
            payload = {
                "input": {
                    "audio_base64": audi_file_base_64,
                    "model": "large-v2",
                    "transcription": "plain_text",
                    "translate": True,
                    "temperature": 0,
                    "best_of": 3,
                    "beam_size": 5,
                    "patience": 1,
                    "suppress_tokens": "-1",
                    "condition_on_previous_text": False,
                    "temperature_increment_on_fallback": 0.2,
                    "compression_ratio_threshold": 2.4,
                    "logprob_threshold": -1,
                    "no_speech_threshold": 0.6,
                    "word_timestamps": False,
                },
                "enable_vad": True,
            }
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": os.getenv("RUNPOD_API_KEY"),
            }
            response = requests.post(url, json=payload, headers=headers, timeout=180)
            resp = response.json()
            return resp["output"]["transcription"]

        except Exception as e:
            print(e)
            return "Error"

    def text_to_speech(self, text: str, file_path: str):
        """Synthesizes speech from the input string of text."""
        try:
            input_text = texttospeech.SynthesisInput(text=text)

            voice = texttospeech.VoiceSelectionParams(
                language_code="en-US",  # "de-DE",
                name="en-US-Standard-F",  # de-DE-Standard-F  # de-DE-Neural2-F
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.LINEAR16, speaking_rate=1
            )

            response = self.tts_client_google.synthesize_speech(
                request={
                    "input": input_text,
                    "voice": voice,
                    "audio_config": audio_config,
                }
            )

            # The response's audio_content is binary.
            with open(file_path, "wb") as out:
                out.write(response.audio_content)
        except Exception as e:
            print(e)
            return "Error"
