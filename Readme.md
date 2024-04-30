# Local-AI

## Important URLs

- [Frontend](http://localhost:3000)
- [Backend](http://localhost:8000/docs)
- [Qdrant DB](http://localhost:6333/dashboard)

- [Ollama Chat Playground](http://localhost:8000/ollama/playground/)
- [Cohere Chat Playground](http://localhost:8000/ollama/playground/)

## Prerequisites

1. Install Python 3.11
2. Install Node and NPM
3. Install Docker
4. Install LMStudio and start a local server
5. For Text-To-Speech install: https://huggingface.co/parler-tts/parler_tts_mini_v0.1

## Start

```bash
    cd ./frontend && npm run build && npm run start & \
    cd .. && cd ./qdrant && sh ./start-qdrant.sh & \
    cd .. && cd ./backend && cd ./app && uvicorn server:app --port 2122
```

or

```bash
    # Terminal 1
    cd ./frontend && npm run build && npm run start
    # Terminal 2
    cd ./backend && cd ./app && uvicorn server:app --port 2122
    # Terminal 3
    cd ./qdrant && sh ./start-qdrant.sh
```

or for development

```bash
    # Terminal 1
    cd ./frontend && npm run dev
    # Terminal 2
    cd ./backend && cd ./app && uvicorn server:app --reload --port 2122
    # Terminal 3
    cd ./qdrant && sh ./start-qdrant.sh
```
