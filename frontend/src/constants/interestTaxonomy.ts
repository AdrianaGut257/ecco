export const GENERAL = "general";

export interface InterestTaxonomy {
  subtopicLabel: string;
  subtopics: string[];
  examplesLabel: string;
  placeholder: string;
}

const t = (
  subtopicLabel: string,
  subtopics: string[],
  examplesLabel: string,
  placeholder: string,
): InterestTaxonomy => ({ subtopicLabel, subtopics, examplesLabel, placeholder });

const MUSIC_EXAMPLES = "Artistas o canciones que te gustan";

export const INTEREST_TAXONOMY: Record<string, InterestTaxonomy> = {
  Películas: t("Géneros", ["Acción", "Comedia", "Drama", "Terror", "Ciencia ficción", "Animación", "Romance", "Documental", "Fantasía", "Suspenso"], "Películas que te gustan", "Ej: Iron Man 2, Coco…"),
  Series: t("Géneros", ["Comedia", "Drama", "Crimen", "Fantasía", "Ciencia ficción", "Terror", "Romance", "Documental", "Reality"], "Series que te gustan", "Ej: Dark, Friends…"),
  Cómics: t("Estilos", ["Superhéroes", "Manga", "Novela gráfica", "Webtoon", "Humor", "Europeo"], "Cómics o personajes", "Ej: Spider-Man, Mafalda…"),
  Anime: t("Géneros", ["Shōnen", "Shōjo", "Seinen", "Isekai", "Slice of life", "Mecha", "Deportes", "Romance"], "Animes que te gustan", "Ej: One Piece, Haikyuu…"),
  Videojuegos: t("Géneros", ["Acción", "Aventura", "RPG", "Estrategia", "Shooter", "Deportes", "Terror", "Indie", "Multijugador", "Simulación"], "Juegos que te gustan", "Ej: Minecraft, Hollow Knight…"),
  Podcasts: t("Temas", ["Humor", "Historias reales", "Ciencia", "Crimen", "Salud mental", "Tecnología", "Cultura pop"], "Podcasts que escuchas", "Ej: Nadie Sabe Nada…"),
  Streaming: t("Contenido", ["Gaming", "Charlas", "Música en vivo", "Arte en vivo", "Cocina", "Deportes"], "Creadores que sigues", "Ej: Ibai, AuronPlay…"),

  Pop: t("Estilos", ["Pop latino", "Pop en inglés", "Dance pop", "Indie pop", "Baladas"], MUSIC_EXAMPLES, "Ej: Taylor Swift, Shakira…"),
  Rock: t("Estilos", ["Rock and roll", "Rock clásico", "Hard rock", "Rock alternativo", "Rock en español", "Metal", "Punk"], MUSIC_EXAMPLES, "Ej: Queen, Soda Stereo…"),
  Reguetón: t("Estilos", ["Reguetón clásico", "Reguetón actual", "Trap latino", "Dembow"], MUSIC_EXAMPLES, "Ej: Bad Bunny, Daddy Yankee…"),
  "Música clásica": t("Épocas", ["Barroco", "Clasicismo", "Romanticismo", "Contemporánea", "Ópera", "Bandas sonoras"], "Compositores u obras", "Ej: Vivaldi, Beethoven…"),
  Electrónica: t("Estilos", ["House", "Techno", "EDM", "Lo-fi", "Trance", "Drum and bass"], MUSIC_EXAMPLES, "Ej: Daft Punk, Avicii…"),
  "K-pop": t("Estilos", ["Grupos de chicos", "Grupos de chicas", "Solistas", "K-drama OST"], MUSIC_EXAMPLES, "Ej: BTS, BLACKPINK…"),
  "Hip hop": t("Estilos", ["Rap en español", "Rap en inglés", "Trap", "Old school", "Freestyle"], MUSIC_EXAMPLES, "Ej: Canserbero, Kendrick Lamar…"),
  Jazz: t("Estilos", ["Swing", "Bebop", "Jazz latino", "Smooth jazz", "Fusión"], MUSIC_EXAMPLES, "Ej: Miles Davis, Norah Jones…"),
  "Música latina": t("Estilos", ["Salsa", "Cumbia", "Bachata", "Folklore", "Morenada", "Caporales", "Bolero"], MUSIC_EXAMPLES, "Ej: Kjarkas, Marc Anthony…"),
  Otro: t("Estilos", ["Indie", "R&B", "Country", "Reggae", "Bandas sonoras", "Lo-fi"], MUSIC_EXAMPLES, "Ej: Arctic Monkeys…"),

  Historia: t("Épocas", ["Antigua", "Medieval", "Moderna", "Contemporánea", "Historia de Bolivia", "Mitología"], "Temas o personajes", "Ej: Imperio inca, Roma…"),
  Literatura: t("Géneros", ["Novela", "Fantasía", "Ciencia ficción", "Misterio", "Poesía", "Romance", "Autoayuda", "Clásicos"], "Libros o autores", "Ej: Cien años de soledad…"),
  Idiomas: t("Idiomas", ["Inglés", "Portugués", "Francés", "Japonés", "Coreano", "Alemán", "Quechua", "Aymara"], "Lo que te gusta aprender", "Ej: series en inglés…"),
  Tradiciones: t("Tipos", ["Fiestas populares", "Danzas", "Gastronomía típica", "Artesanía", "Leyendas"], "Tradiciones que te gustan", "Ej: Carnaval de Oruro…"),
  Museos: t("Tipos", ["Arte", "Historia", "Ciencia", "Arqueología", "Arte moderno"], "Museos que te gustaron", "Ej: Museo del Prado…"),
  Teatro: t("Tipos", ["Comedia", "Drama", "Musicales", "Improvisación", "Danza"], "Obras o artistas", "Ej: El fantasma de la ópera…"),

  "Comida vegana": t("Tipos", ["Platos fuertes", "Postres", "Snacks", "Proteínas vegetales"], "Platos favoritos", "Ej: hamburguesa de lentejas…"),
  "Gastronomía internacional": t("Cocinas", ["Italiana", "Japonesa", "Mexicana", "Peruana", "Coreana", "China", "India", "Árabe"], "Platos favoritos", "Ej: ramen, tacos…"),
  "Comida tradicional": t("Tipos", ["Boliviana", "Andina", "Del oriente", "Del valle", "Callejera"], "Platos favoritos", "Ej: salteñas, pique macho…"),
  "Comida rápida": t("Tipos", ["Hamburguesas", "Pizza", "Pollo frito", "Sándwiches", "Hot dogs"], "Tus favoritos", "Ej: pizza de pepperoni…"),
  Postres: t("Tipos", ["Pasteles", "Helados", "Galletas", "Chocolate", "Postres tradicionales"], "Postres favoritos", "Ej: helado de canela…"),
  "Degustación de alimentos": t("Tipos", ["Quesos", "Café de especialidad", "Chocolates", "Street food", "Cocina de autor"], "Lugares o sabores", "Ej: chocolate amargo…"),

  Café: t("Preparaciones", ["Espresso", "Capuchino", "Latte", "Filtrado", "Frío", "De especialidad"], "Cafés o lugares favoritos", "Ej: café de los Yungas…"),
  Té: t("Tipos", ["Verde", "Negro", "Matcha", "Infusiones", "Chai", "Bubble tea"], "Tus favoritos", "Ej: té de manzanilla…"),
  Vinos: t("Tipos", ["Tinto", "Blanco", "Rosado", "Espumante", "Singani"], "Tus favoritos", "Ej: vinos de Tarija…"),
  Cócteles: t("Tipos", ["Clásicos", "Tropicales", "Sin alcohol", "De autor"], "Tus favoritos", "Ej: chuflay, mojito…"),
  "Bebidas naturales": t("Tipos", ["Jugos", "Refrescos tradicionales", "Kombucha", "Aguas saborizadas"], "Tus favoritas", "Ej: mocochinchi, api…"),
  Batidos: t("Tipos", ["De frutas", "Proteicos", "Smoothies verdes", "De chocolate"], "Tus favoritos", "Ej: batido de plátano…"),

  Fútbol: t("Ligas", ["Liga boliviana", "Champions League", "LaLiga", "Premier League", "Selecciones", "Fútbol femenino"], "Equipos o jugadores", "Ej: Bolívar, Messi…"),
  Básquetbol: t("Ligas", ["NBA", "WNBA", "Liga local", "Selecciones"], "Equipos o jugadores", "Ej: Lakers, LeBron James…"),
  Voleibol: t("Modalidades", ["Sala", "Playa", "Liga local", "Selecciones"], "Equipos o jugadores", "Ej: Brasil…"),
  Natación: t("Estilos", ["Libre", "Espalda", "Pecho", "Mariposa", "Aguas abiertas"], "Nadadores o lugares", "Ej: Michael Phelps…"),
  Tenis: t("Torneos", ["Wimbledon", "Roland Garros", "US Open", "Australian Open", "Pádel"], "Jugadores favoritos", "Ej: Nadal, Alcaraz…"),
  Golf: t("Torneos", ["PGA Tour", "Masters", "Ryder Cup", "Minigolf"], "Jugadores favoritos", "Ej: Tiger Woods…"),
  Boxeo: t("Categorías", ["Peso pesado", "Peso medio", "Peso ligero", "Boxeo femenino"], "Boxeadores favoritos", "Ej: Muhammad Ali…"),
  "Artes marciales": t("Disciplinas", ["Karate", "Taekwondo", "Judo", "Jiu-jitsu", "Kung fu", "MMA"], "Lo que practicas o sigues", "Ej: Bruce Lee…"),
  Atletismo: t("Pruebas", ["Velocidad", "Fondo", "Maratón", "Saltos", "Lanzamientos"], "Atletas o carreras", "Ej: Usain Bolt…"),
  Ciclismo: t("Modalidades", ["Ruta", "Montaña", "BMX", "Urbano", "Pista"], "Rutas o ciclistas", "Ej: Tour de Francia…"),

  Senderismo: t("Tipos", ["Montaña", "Bosque", "Río", "Rutas cortas", "Travesías"], "Rutas o lugares favoritos", "Ej: Parque Tunari…"),
  Montañismo: t("Tipos", ["Alta montaña", "Nevados", "Cumbres", "Expediciones"], "Montañas o lugares", "Ej: Huayna Potosí…"),
  Escalada: t("Tipos", ["Boulder", "Deportiva", "En roca", "En muro"], "Lugares favoritos", "Ej: …"),
  Camping: t("Tipos", ["Con carpa", "En montaña", "Junto al río", "Glamping"], "Lugares favoritos", "Ej: Toro Toro…"),
  Trekking: t("Tipos", ["Un día", "Varios días", "Alta montaña", "Selva"], "Rutas favoritas", "Ej: Camino del Choro…"),
  Surf: t("Tipos", ["Olas", "Bodyboard", "Paddle", "Kitesurf"], "Playas favoritas", "Ej: Máncora…"),
  "Paseos en bicicleta": t("Tipos", ["Ciudad", "Parques", "Montaña", "Rutas largas"], "Rutas favoritas", "Ej: …"),

  Moda: t("Estilos", ["Casual", "Streetwear", "Vintage", "Elegante", "Alternativa", "Sostenible"], "Marcas o referentes", "Ej: …"),
  Belleza: t("Áreas", ["Maquillaje", "Skincare", "Cabello", "Uñas", "Perfumes"], "Marcas o productos", "Ej: …"),
  Cocina: t("Tipos", ["Casera", "Saludable", "Internacional", "Rápida", "Parrilla"], "Recetas favoritas", "Ej: lasaña casera…"),
  Repostería: t("Tipos", ["Tortas", "Galletas", "Pan", "Postres fríos", "Decoración"], "Recetas favoritas", "Ej: brownies…"),
  Decoración: t("Estilos", ["Minimalista", "Bohemio", "Nórdico", "Vintage", "Plantas"], "Ideas o referentes", "Ej: …"),
  Jardinería: t("Tipos", ["Huerto", "Suculentas", "Plantas de interior", "Flores", "Bonsái"], "Plantas favoritas", "Ej: monstera…"),
  Viajes: t("Tipos", ["Playa", "Montaña", "Ciudades", "Mochilero", "Naturaleza", "Gastronómico"], "Lugares que amas o quieres conocer", "Ej: Uyuni, Japón…"),

  Ejercicio: t("Tipos", ["Gimnasio", "Funcional", "Crossfit", "Calistenia", "Baile", "Correr"], "Rutinas o lugares", "Ej: …"),
  Yoga: t("Estilos", ["Hatha", "Vinyasa", "Yin", "Restaurativo", "Meditativo"], "Lo que más disfrutas", "Ej: saludo al sol…"),
  Salud: t("Temas", ["Nutrición", "Sueño", "Salud mental", "Hábitos", "Prevención"], "Lo que te interesa", "Ej: dormir mejor…"),
  Meditación: t("Tipos", ["Guiada", "Mindfulness", "Respiración", "Gratitud"], "Apps o prácticas", "Ej: …"),
  Relajación: t("Tipos", ["Música tranquila", "Naturaleza", "Lectura", "Baños largos", "Siestas"], "Lo que te relaja", "Ej: lluvia de fondo…"),
  "Desarrollo personal": t("Temas", ["Hábitos", "Productividad", "Autoestima", "Finanzas", "Liderazgo"], "Libros o referentes", "Ej: Hábitos atómicos…"),
  "Cuidado personal": t("Tipos", ["Rutinas", "Descanso", "Autocuidado emocional", "Skincare"], "Lo que más te ayuda", "Ej: …"),

  Fotografía: t("Estilos", ["Paisaje", "Retrato", "Callejera", "Celular", "Analógica", "Naturaleza"], "Fotógrafos o referentes", "Ej: …"),
  Escritura: t("Tipos", ["Poesía", "Cuentos", "Novela", "Guion", "Diario personal", "Fanfic"], "Lo que escribes o lees", "Ej: …"),
  Dibujo: t("Estilos", ["Lápiz", "Acuarela", "Digital", "Manga", "Ilustración", "Tatuajes"], "Artistas favoritos", "Ej: …"),
  Manualidades: t("Tipos", ["Tejido", "Bordado", "Cerámica", "Reciclaje", "Origami"], "Lo que te gusta hacer", "Ej: …"),
  Diseño: t("Áreas", ["Gráfico", "UX/UI", "Interiores", "Moda", "3D"], "Referentes o herramientas", "Ej: Figma…"),

  Familia: t("Momentos", ["Comidas juntos", "Viajes", "Juegos", "Tradiciones", "Hermanos"], "Lo que más disfrutas", "Ej: domingos de almuerzo…"),
  Amistad: t("Planes", ["Salir", "Conversar", "Juegos", "Viajes", "Deporte"], "Planes favoritos", "Ej: noche de juegos…"),
  Voluntariado: t("Causas", ["Animales", "Medio ambiente", "Niñez", "Educación", "Adultos mayores"], "Organizaciones o proyectos", "Ej: …"),
  "Eventos sociales": t("Tipos", ["Conciertos", "Ferias", "Festivales", "Fiestas", "Encuentros culturales"], "Eventos favoritos", "Ej: …"),
  Emprendimiento: t("Áreas", ["Tecnología", "Comida", "Moda", "Social", "Arte"], "Proyectos o referentes", "Ej: …"),
  Mascotas: t("Tipos", ["Perros", "Gatos", "Aves", "Peces", "Exóticas"], "Tus mascotas o razas favoritas", "Ej: golden retriever…"),
};

export const taxonomyFor = (interest: string): InterestTaxonomy =>
  INTEREST_TAXONOMY[interest] ??
  t("Subtemas", [], "Ejemplos que te gustan", "Cuéntanos un poco más…");
