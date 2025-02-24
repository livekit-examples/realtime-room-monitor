from typing import Generic, Type

from pydantic import BaseModel, Field
from voxant.graph.types import TState


class Context(BaseModel, Generic[TState]):

    state_schema: Type[TState] = Field(
        ..., description="The state schema of the agent executor"
    )
