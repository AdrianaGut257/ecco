INTEREST_CATEGORIES: dict[str, list[str]] = {
    "Entretenimiento": ["Películas", "Series", "Cómics", "Anime", "Videojuegos", "Podcasts", "Streaming"],
    "Música": ["Pop", "Rock", "Reguetón", "Música clásica", "Electrónica", "K-pop", "Hip hop", "Jazz", "Música latina", "Otro"],
    "Cultura": ["Historia", "Literatura", "Idiomas", "Tradiciones", "Museos", "Teatro"],
    "Cocina y gastronomía": ["Comida vegana", "Gastronomía internacional", "Comida tradicional", "Comida rápida", "Postres", "Degustación de alimentos"],
    "Bebidas": ["Café", "Té", "Vinos", "Cócteles", "Bebidas naturales", "Batidos"],
    "Deportes": ["Fútbol", "Básquetbol", "Voleibol", "Natación", "Tenis", "Golf", "Boxeo", "Artes marciales", "Atletismo", "Ciclismo"],
    "Actividades al aire libre": ["Senderismo", "Montañismo", "Escalada", "Camping", "Trekking", "Surf", "Paseos en bicicleta"],
    "Estilo de vida": ["Moda", "Belleza", "Cocina", "Repostería", "Decoración", "Jardinería", "Viajes"],
    "Bienestar": ["Ejercicio", "Yoga", "Salud", "Meditación", "Relajación", "Desarrollo personal", "Cuidado personal"],
    "Creatividad": ["Fotografía", "Escritura", "Dibujo", "Manualidades", "Diseño"],
    "Social y comunidad": ["Familia", "Amistad", "Voluntariado", "Eventos sociales", "Emprendimiento", "Mascotas"],
}

CATEGORY_BY_INTEREST: dict[str, str] = {
    item: category for category, items in INTEREST_CATEGORIES.items() for item in items
}

OTHER_CATEGORY = "Otros"

AVATAR_IDS = {"a1", "a2", "a3", "a4", "a5", "a6"}
DEFAULT_AVATAR = "a1"
MIN_INTERESTS = 3
MAX_INTERESTS = 40
