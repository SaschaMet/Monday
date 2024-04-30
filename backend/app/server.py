# pylint: disable= E0611 E0401 W0718
import os
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Form
from routes import TranscribeAndCreateVoice

load_dotenv()

app = FastAPI()
audio_processor = TranscribeAndCreateVoice.TranscribeAndCreateVoice()

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.post("/stt")
async def speech_to_text(audio_data: bytes = File(...), file_type: str = Form(...)):
    """Convert speech to text."""
    try:
        file_type = "wav"
        path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "audioFile." + file_type
        )
        with open(path, "wb") as buffer:
            buffer.write(audio_data)
        text = audio_processor.speech_to_text(path)
        os.remove(path)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}


class ItemTTS(BaseModel):
    """Item model."""

    text: str


@app.post("/tts")
async def text_to_speech(item: ItemTTS):
    """Transfer text to speech."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ttsFile.wav")
    audio_processor.text_to_speech(item.text, path)
    with open(path, "rb") as wav_file:
        contents = wav_file.read()
    os.remove(path)
    return Response(contents, media_type="audio/wav")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=2122)
    print("Server started at http://localhost:2122")
