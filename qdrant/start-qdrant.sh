docker pull qdrant/qdrant:v1.8.4
if [ $(docker ps -aq -f name=qdrant) ]; then
    # if the container exists, start it
    docker start qdrant
else
    # if the container does not exist, create and start it
    docker run -p 6333:6333 -p 6334:6334 \
        -v $(pwd)/qdrant_storage:/qdrant/storage:z \
        -e QDRANT__TELEMETRY_DISABLED=true \
        --name qdrant \
        qdrant/qdrant
fi