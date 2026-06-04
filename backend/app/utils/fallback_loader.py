import csv
import json
from io import StringIO

from app.core.config import SAMPLES_DIR
from app.core.logging import get_logger

logger = get_logger("fallback")


def load_json(filename: str) -> dict:
    path = SAMPLES_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_csv_rows(filename: str) -> list[dict]:
    path = SAMPLES_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_csv_text(text: str) -> list[dict]:
    return list(csv.DictReader(StringIO(text)))
