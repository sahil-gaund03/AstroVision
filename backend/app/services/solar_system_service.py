from app.utils import fallback_loader


def get_planets() -> dict:
    data = fallback_loader.load_json("solar_system_planets.json")
    # Curated dataset; fallback flag false since this is the canonical source.
    data["fallback"] = False
    return data
