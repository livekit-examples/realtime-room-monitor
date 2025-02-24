import asyncio
from typing import Generic, List, Optional

from langgraph.pregel import Pregel
from pydantic import BaseModel, PrivateAttr
from voxant.graph.context import Context
from voxant.graph.func import BackgroundTask
from voxant.graph.types import TConfig, TState, TTopic
from voxant.graph.utils import make_config


class Executor(BaseModel, Generic[TState, TConfig, TTopic]):

    _context: Context[TState] = PrivateAttr()

    _workflow: Pregel = PrivateAttr()

    _background_tasks: List[BackgroundTask] = PrivateAttr(default_factory=list)

    class Config:
        arbitrary_types_allowed = True

    def __init__(
        self,
        *,
        context: Context[TState],
        workflow: Pregel,
        background: Optional[List[BackgroundTask]] = None,
    ):
        self._context = context
        self._workflow = workflow
        self._background_tasks = background or []

    def start(self): ...

    def stop(self): ...

    def execute(self, config: TConfig):
        asyncio.create_task(self._execute_workflow(config))

    async def _execute_workflow(self, config: TConfig):
        async for part in self._workflow.astream(
            input=0,
            config=make_config(config.model_dump()),
            stream_mode=["updates", "custom"],
        ):
            print(part)

    def recv(self, topic: TTopic): ...
