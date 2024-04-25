# pylint: disable= E0611 E0401
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
    file_type = "wav"
    path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "audioFile." + file_type
    )
    with open(path, "wb") as buffer:
        buffer.write(audio_data)

    text = audio_processor.transcribe(path)
    os.remove(path)
    return {"text": text}


class Item(BaseModel):
    """Item model."""

    text: str
    use_cloud_voice: bool = False


@app.post("/tts")
async def text_to_speech(item: Item):
    """Transfer text to speech."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ttsFile.wav")
    if item.use_cloud_voice:
        audio_processor.text_to_speech_google(item.text, path)
    else:
        audio_processor.text_to_speech_local(item.text, path)
    with open(path, "rb") as wav_file:
        contents = wav_file.read()
    os.remove(path)
    return Response(contents, media_type="audio/wav")


# @app.post("/tts")
# async def upload_audio(audio_data: bytes = File(...), file_type: str = Form(...)):
#     """Upload audio file."""
#     filename = "audioFile." + file_type
#     target_path = "../../" + filename
#     with open(target_path, "wb") as buffer:
#         buffer.write(audio_data)
#     path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "speech.wav")
#     print("Received audio file.")
#     text = audio_processor.transcribe(target_path)
#     print("Transcribed audio file:", text)
#     messages = [
#         AIMessage(
#             content="You are an helpful AI. Please help me answer the following questions. Think step by step to make sure you provide the best answer."
#         ),
#         HumanMessage(content=text),
#     ]
#     answer = wizardlm.invoke(messages)
#     print("Generating answer:", answer.content)
#     audio_processor.text_to_speech(answer.content, path)
#     print("Returning speech.")

#     with open(path, "rb") as wav_file:
#         contents = wav_file.read()

#     os.remove(path)

#     return Response(contents, media_type="audio/wav")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("Server started at http://localhost:8000")
