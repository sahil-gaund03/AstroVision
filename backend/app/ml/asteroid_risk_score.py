"""Asteroid risk scoring - educational heuristic, not an official NASA risk model."""


def score_asteroid(
    estimated_diameter_km: float | None,
    relative_velocity_kph: float | None,
    miss_distance_km: float | None,
    is_potentially_hazardous: bool | None,
) -> dict:
    score = 0
    reasons: list[str] = []

    d = estimated_diameter_km or 0.0
    if d < 0.1:
        score += 5
        reasons.append(f"Small diameter (~{d:.3f} km): +5")
    elif d < 0.5:
        score += 15
        reasons.append(f"Moderate diameter (~{d:.2f} km): +15")
    elif d <= 1.0:
        score += 25
        reasons.append(f"Large diameter (~{d:.2f} km): +25")
    else:
        score += 35
        reasons.append(f"Very large diameter (~{d:.2f} km): +35")

    v = relative_velocity_kph or 0.0
    if v < 25000:
        score += 5
        reasons.append(f"Low velocity (~{v:,.0f} kph): +5")
    elif v <= 60000:
        score += 15
        reasons.append(f"Moderate velocity (~{v:,.0f} kph): +15")
    else:
        score += 25
        reasons.append(f"High velocity (~{v:,.0f} kph): +25")

    m = miss_distance_km if miss_distance_km is not None else 1e12
    if m > 10_000_000:
        score += 5
        reasons.append(f"Distant approach (~{m:,.0f} km): +5")
    elif m >= 3_000_000:
        score += 15
        reasons.append(f"Close approach (~{m:,.0f} km): +15")
    else:
        score += 30
        reasons.append(f"Very close approach (~{m:,.0f} km): +30")

    if is_potentially_hazardous:
        score += 20
        reasons.append("NASA flags as potentially hazardous: +20")

    score = max(0, min(100, score))

    if score < 25:
        level = "Low"
    elif score < 50:
        level = "Medium"
    elif score < 75:
        level = "High"
    else:
        level = "Critical"

    explanation = (
        f"Risk {score}/100 ({level}). " + "; ".join(reasons) + ". "
        "This is an educational heuristic, not an official NASA hazard assessment."
    )
    return {"risk_score": score, "risk_level": level, "explanation": explanation}
