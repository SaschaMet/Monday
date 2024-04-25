# pylint: disable= E0611 E0401 W0718
import os
import uuid
from typing import List

import cohere
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_core.documents import Document
from langchain_experimental.text_splitter import SemanticChunker
from qdrant_client import QdrantClient, models
from qdrant_client.models import Distance, Filter, VectorParams
from tqdm import tqdm

from ..typeClasses import Document, QdrantSearchResponse, SplittingStrategy


class Qdrant:
    """Qdrant client."""

    def __init__(self):
        """Initialize the Qdrant client."""
        self.qdrant = QdrantClient(url="http://localhost:6333")
        self.co = cohere.Client(os.getenv("COHERE_API_KEY"))

    def recreate_collection(self, collection_name: str):
        """Create a collection with the given name and vector size."""
        self.qdrant.recreate_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=1024,
                distance=Distance.COSINE,
            ),
        )

    def create_cohere_embeddings(self, texts: List[str], input_type: str):
        """Create embeddings for the collection using the Cohere model.
        input_type can be "search_document" or "search_query"

        """
        embeddings = self.co.embed(
            texts=texts,
            model="embed-multilingual-v3.0",
            input_type=input_type,
        ).embeddings
        return embeddings

    def upload_documents(
        self,
        collection_name: str,
        documents: List[Document],
        splitting_strategy: SplittingStrategy = SplittingStrategy.RECURSIVELY,
    ):
        """Upload documents to the collection."""
        try:
            # throw an error if there are not documents or the document have not the Document type
            if not documents:
                raise ValueError("No documents to upload")

            if not all(isinstance(document, Document) for document in documents):
                raise ValueError("All documents should be of type Document")

            # check if the collection exists - if not, create it
            if collection_name not in self.qdrant.get_collections():
                self.recreate_collection(collection_name)

            metadata_list = []
            content_list = []  # list of lists of strings

            print("adding ", len(documents), " documents")

            for document in documents:
                content = None
                metadata = []

                if splitting_strategy == SplittingStrategy.SEMANTIC:
                    text_splitter = SemanticChunker(
                        FastEmbedEmbeddings(
                            model_name="sentence-transformers/all-MiniLM-L6-v2",
                        ),
                        breakpoint_threshold_type="percentile",
                    )
                elif splitting_strategy == SplittingStrategy.RECURSIVELY:
                    text_splitter = CharacterTextSplitter(
                        chunk_size=500,
                        chunk_overlap=50,
                    )

                file_type = document.metadata["fileType"]

                # if the document is a pdf, save the text content
                if "pdf" in file_type:
                    raise NotImplementedError("PDF parsing is not implemented yet.")

                else:
                    content = text_splitter.split_text(document.content)

                for _ in content:
                    metadata.append(document.metadata)

                content_list.append(content)
                metadata_list.append(metadata)

            assert len(metadata_list) == len(content_list)
            assert len(metadata_list[0]) == len(content_list[0])

            print("adding ", len(content_list), " chunks")

            if len(content_list) > 99:
                raise ValueError(
                    "Too many chunks to add at once. Max is 99 - current is ",
                    len(content_list),
                )

            embeddings = self.create_cohere_embeddings(
                texts=content_list,
                input_type="search_document",
            )

            for i, _ in enumerate(tqdm(range(len(embeddings)))):
                self.qdrant.upsert(
                    collection_name=collection_name,
                    points=[
                        models.PointStruct(
                            id=uuid.uuid4(),
                            payload={
                                **metadata[i],
                            },
                            vector=embeddings,
                        ),
                    ],
                )

        except Exception as e:
            print("Error: ", e)

    def search_text(
        self,
        collection_name: str,
        query: str,
        qdrant_filter: Filter = None,
        limit: int = 10,
    ) -> QdrantSearchResponse:
        """Search for the query in the collection.

        returns:
            [{
                "name":str,
                "document":str,
                "description":str,
                "type":str,
            }]

        """
        results = self.qdrant.query(
            collection_name=collection_name,
            query_text=query,
            limit=limit,
            query_filter=qdrant_filter,
        )

        formatted_results = []
        for result in results:
            formatted_results.append(result.metadata)

        return formatted_results

    def search(self, query: str, collection_name: str, limit: int = 10):
        """Search for the query in the collection."""
        query_embedding = self.create_cohere_embeddings(
            texts=[query],
            input_type="search_query",
        )[0]

        results = self.qdrant.search(
            collection_name=collection_name,
            query_vector=query_embedding,
            limit=limit,
        )

        formatted_results = []
        for result in results:
            formatted_results.append(result.payload)

        return formatted_results
