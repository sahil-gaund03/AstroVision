from pydantic import BaseModel


class APOD(BaseModel):
    date: str
    title: str
    explanation: str
    media_type: str
    url: str
    hdurl: str | None = None
    copyright: str | None = None
    fallback: bool = False


class MarsPhoto(BaseModel):
    id: int | str
    img_src: str
    earth_date: str
    rover: str
    camera: str


class MarsRoverResponse(BaseModel):
    rover: str
    photos: list[MarsPhoto]
    fallback: bool = False


class NASAImage(BaseModel):
    nasa_id: str
    title: str
    description: str
    date_created: str
    media_type: str
    thumbnail: str
    image: str


class NASAImageSearchResponse(BaseModel):
    query: str
    items: list[NASAImage]
    fallback: bool = False
