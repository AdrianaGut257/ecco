from src.modules.users.catalog import CATEGORY_BY_INTEREST

MUSIC = ["MusicGroup", "Person", "MusicAlbum", "MusicRecording"]

TYPES_BY_INTEREST: dict[str, list[str]] = {
    "Películas": ["Movie", "MovieSeries"],
    "Series": ["TVSeries"],
    "Cómics": ["Book", "BookSeries", "Periodical"],
    "Anime": ["TVSeries", "Movie"],
    "Videojuegos": ["VideoGame", "VideoGameSeries"],
    "Streaming": ["Person", "WebSite"],
    "Literatura": ["Book", "BookSeries", "Person"],
    "Historia": ["Event", "Person", "Place"],
    "Museos": ["Place"],
    "Teatro": ["Event", "Person"],
    "Viajes": ["Place"],
    "Moda": ["Organization", "Person"],
    "Belleza": ["Organization", "Person"],
    "Fotografía": ["Person"],
    "Dibujo": ["Person"],
    "Diseño": ["Person", "Organization"],
    "Emprendimiento": ["Organization", "Person"],
}

TYPES_BY_CATEGORY: dict[str, list[str]] = {
    "Música": MUSIC,
    "Deportes": ["SportsTeam", "Person", "Event"],
    "Actividades al aire libre": ["Place"],
}


def types_for(interest: str) -> list[str]:
    if interest in TYPES_BY_INTEREST:
        return TYPES_BY_INTEREST[interest]
    return TYPES_BY_CATEGORY.get(CATEGORY_BY_INTEREST.get(interest, ""), [])
