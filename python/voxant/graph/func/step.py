import functools
from typing import Awaitable, Callable, Optional

from langgraph.func import task
from langgraph.pregel.call import SyncAsyncFuture
from langgraph.types import RetryPolicy
from voxant.graph.types import P, T


def step(
    *,
    name: Optional[str] = None,
    retry: Optional[RetryPolicy] = None,
):
    def step_wrapper(
        func: Callable[P, Awaitable[T]],
    ) -> Callable[P, SyncAsyncFuture[T]]:
        func_name = name if name is not None else func.__name__

        @task(name=func_name, retry=retry)
        async def step_wrapper_task(*args: P.args, **kwargs: P.kwargs) -> T:
            print("before")
            result = await func(*args, **kwargs)
            print("after")
            return result

        task_func = functools.update_wrapper(step_wrapper_task, func)
        return task_func  # type: ignore

    return step_wrapper
