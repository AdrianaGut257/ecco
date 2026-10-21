from src.core.schemas import CamelModel


class SuggestionOut(CamelModel):
    name: str
    description: str | None = None
