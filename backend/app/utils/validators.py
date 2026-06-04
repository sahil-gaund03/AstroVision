import re
from datetime import date, datetime

_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def is_valid_date(value: str) -> bool:
    if not value or not _DATE_RE.match(value):
        return False
    try:
        d = datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return False
    return d <= date.today()


def to_float(value, default: float | None = None) -> float | None:
    try:
        if value in (None, "", "null"):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def clean_query(q: str, max_len: int = 100) -> str:
    return (q or "").strip()[:max_len]
