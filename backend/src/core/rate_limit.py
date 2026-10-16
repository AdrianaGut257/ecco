import time
from collections import defaultdict, deque

from src.core.errors import TooManyRequests


class RateLimiter:
    def __init__(self, limit: int, window_seconds: int):
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> None:
        now = time.monotonic()
        hits = self._hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.limit:
            raise TooManyRequests()
        hits.append(now)

    def reset(self) -> None:
        self._hits.clear()


login_limiter = RateLimiter(limit=10, window_seconds=300)
reset_limiter = RateLimiter(limit=5, window_seconds=900)
