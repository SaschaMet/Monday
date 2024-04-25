from enum import Enum
from typing import List, Dict, Optional, Union
from pydantic import BaseModel, Field
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage


class InputChat(BaseModel):
    """Input for the chat endpoint."""

    messages: List[Union[HumanMessage, AIMessage, SystemMessage]] = Field(
        ...,
        description="The chat messages representing the current conversation.",
    )
    use_document: bool = Field(
        False,
        description="Whether to use RAG or not.",
    )


class Document(BaseModel):
    """Document type."""

    metadata: Dict[str, str]
    content: str


class SplittingStrategy(Enum):
    """Splitting strategy type."""

    SEMANTIC = "semantic"
    RECURSIVELY = "recursively"


class QdrantSearchResponse(BaseModel):
    """Response from the Qdrant search endpoint."""

    results: List[
        Dict[str, str]
    ]  # Fix: Close the opening square bracket "[" and opening curly brace "{"


class RagInput(BaseModel):
    """Input for the RAG model."""

    query: str = Field(..., description="The query to search in the Qdrant collection.")
    collection_name: str = Field(
        "documents", description="The name of the Qdrant collection."
    )
    messages: Optional[List[Union[HumanMessage, AIMessage, SystemMessage]]] = Field(
        None,
        description="The chat messages representing the current conversation.",
    )
    boost: bool = Field(
        False,
        description="Whether to boost the search results based on the query.",
    )
    limit: int = Field(
        4,
        description="The number of search results to return.",
    )
