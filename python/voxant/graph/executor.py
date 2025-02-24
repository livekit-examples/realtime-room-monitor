from typing import Generic, List, Type, TypeVar

from pydantic import BaseModel, Field
from voxant.graph.func import BackgroundTask, Workflow

TState = TypeVar("TState", bound=BaseModel)


class Executor(BaseModel, Generic[TState]):

    state: Type[TState] = Field(
        ..., description="The state schema of the agent executor"
    )

    workflow: Workflow = Field(..., description="The main workflow of the agent")

    background: List[BackgroundTask] = Field(
        default_factory=list, description="The background running tasks of the agent"
    )

    def start(self): ...

    def stop(self): ...

    def trigger(self): ...

    def send(self): ...

    def recv(self): ...

    def emit(self): ...

    def mutate(self): ...
