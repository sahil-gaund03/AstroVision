"""In-memory favorites store (demo). Swap for DATABASE_URL-backed storage later."""
import uuid

_STORE: dict[str, dict] = {}


def list_favorites() -> list[dict]:
    return list(_STORE.values())


def add_favorite(item: dict) -> dict:
    fid = str(uuid.uuid4())
    record = {"id": fid, **item}
    _STORE[fid] = record
    return record


def delete_favorite(fid: str) -> bool:
    return _STORE.pop(fid, None) is not None
