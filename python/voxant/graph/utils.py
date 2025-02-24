from typing import Any, Dict

from langchain_core.runnables import RunnableConfig


def make_config(configurable: Dict[str, Any]) -> RunnableConfig:
    return {"configurable": configurable}
