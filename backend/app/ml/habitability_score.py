"""Exoplanet habitability scoring - educational approximation.

This is not a scientifically validated habitability model.
"""


def score_habitability(
    planet_radius_earth: float | None,
    planet_mass_earth: float | None,
    orbital_period_days: float | None,
    stellar_temperature: float | None,
    equilibrium_temperature: float | None,
) -> dict:
    score = 50
    reasons: list[str] = []
    missing: list[str] = []

    r = planet_radius_earth
    if r is None:
        missing.append("planet radius")
    elif 0.8 <= r <= 1.8:
        score += 20
        reasons.append(f"Earth-like radius ({r} R_earth): +20")
    elif 1.8 < r <= 2.5:
        score += 10
        reasons.append(f"Super-Earth radius ({r} R_earth): +10")
    else:
        score -= 15
        reasons.append(f"Radius outside rocky range ({r} R_earth): -15")

    m = planet_mass_earth
    if m is None:
        missing.append("planet mass")
    elif 0.5 <= m <= 5:
        score += 15
        reasons.append(f"Rocky-range mass ({m} M_earth): +15")
    elif 5 < m <= 10:
        score += 5
        reasons.append(f"Heavy mass ({m} M_earth): +5")
    else:
        score -= 15
        reasons.append(f"Mass outside rocky range ({m} M_earth): -15")

    p = orbital_period_days
    if p is None:
        missing.append("orbital period")
    elif 200 <= p <= 500:
        score += 15
        reasons.append(f"Temperate orbit ({p} d): +15")
    elif 50 <= p < 200:
        score += 5
        reasons.append(f"Warm orbit ({p} d): +5")
    elif p < 20:
        score -= 20
        reasons.append(f"Very short orbit ({p} d): -20")

    t = stellar_temperature
    if t is None:
        missing.append("stellar temperature")
    elif 4500 <= t <= 6500:
        score += 10
        reasons.append(f"Sun-like star ({t} K): +10")
    elif 3000 <= t < 4500:
        score += 5
        reasons.append(f"Cool star ({t} K): +5")
    elif t > 7500:
        score -= 10
        reasons.append(f"Hot star ({t} K): -10")

    eqt = equilibrium_temperature
    if eqt is None:
        missing.append("equilibrium temperature")
    elif 240 <= eqt <= 310:
        score += 20
        reasons.append(f"Liquid-water temperature ({eqt} K): +20")
    elif (180 <= eqt < 240) or (310 < eqt <= 350):
        score += 5
        reasons.append(f"Marginal temperature ({eqt} K): +5")
    else:
        score -= 15
        reasons.append(f"Temperature outside habitable range ({eqt} K): -15")

    score = max(0, min(100, score))

    if score <= 30:
        category = "Unlikely"
    elif score <= 60:
        category = "Possible"
    elif score <= 80:
        category = "Promising"
    else:
        category = "Strong Candidate"

    warning = None
    if missing:
        warning = "Missing data may reduce accuracy: " + ", ".join(missing) + "."

    details = "; ".join(reasons) if reasons else "No scoring inputs were provided"
    explanation = (
        f"Habitability {score}/100 ({category}). {details}. "
        "This is an educational approximation, not a scientifically validated model."
    )
    return {
        "habitability_score": score,
        "category": category,
        "explanation": explanation,
        "missing_data_warning": warning,
    }
