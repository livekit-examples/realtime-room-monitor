import asyncio
from typing import Generic, List

from langgraph.pregel import Pregel
from pydantic import BaseModel, Field
from voxant.graph.context import Context
from voxant.graph.func import BackgroundTask
from voxant.graph.types import TConfig, TState, TTopic
from voxant.graph.utils import make_config


class Executor(BaseModel, Generic[TState, TConfig, TTopic]):

    context: Context[TState] = Field(
        ..., description="The context of the agent executor"
    )

    workflow: Pregel = Field(..., description="The main workflow of the agent")

    background: List[BackgroundTask] = Field(
        default_factory=list, description="The background running tasks of the agent"
    )

    class Config:
        arbitrary_types_allowed = True

    def start(self): ...

    def stop(self): ...

    def execute(self, config: TConfig):
        asyncio.create_task(self._execute_workflow(config))

    async def _execute_workflow(self, config: TConfig):
        async for part in self.workflow.astream(
            input=0,
            config=make_config(config.model_dump()),
            stream_mode=["updates", "custom"],
        ):
            print(part)

    def recv(self, topic: TTopic): ...
