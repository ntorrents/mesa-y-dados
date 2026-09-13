/**
 * Contenido editorial mejorado para la colección.
 * Categorías canónicas: Abstracto, Familiar, Estrategia, Party, Cooperativo,
 * Cartas, Subasta, Comercio, Reflejos, Aventura, Deducción, Bluff, Construcción
 */
export type ContentPatch = {
  name: string;
  description: string;
  review: string;
  categories: string[];
  difficulty: "Fácil" | "Medio" | "Difícil";
  pros: string[];
  cons: string[];
  featured?: boolean;
  rulesSummary?: string;
};

export const contentPatches: ContentPatch[] = [
  {
    name: "Azul",
    description:
      "Drafting de azulejos para completar un mural portugués: bonito, táctico y perfecto de gateway.",
    review:
      "Azul brilla por lo limpio: en cada turno coges azulejos de una fábrica y los encajas en tu muro. Las reglas se explican en cinco minutos, pero cada elección duele (¿completo yo o te dejo basura?). Los componentes de resina elevan la mesa y escala bien de 2 a 4. En casa es el “vamos a jugar algo bonito sin pelearnos con el manual”.",
    categories: ["Abstracto", "Familiar", "Estrategia"],
    difficulty: "Fácil",
    featured: true,
    pros: [
      "Componentes premium",
      "Reglas claras, decisiones jugosas",
      "Escala muy bien",
      "Partidas de 30–45 min",
    ],
    cons: ["Puede frustrar si te dejan mal", "Temática abstracta"],
    rulesSummary:
      "Por turnos: elige una fábrica o el centro, coge todos los azulejos de un color y coloca el resto en el centro. Encájalos en tu patrón; al final de ronda pásalos al muro y anota puntos por adyacencias. Pierdes puntos por azulejos que no quepan. Gana quien más puntos tenga tras completar una fila horizontal (o al acabar la ronda en la que alguien lo haga).",
  },
  {
    name: "Pandemic",
    description:
      "Cooperativo tenso: curad enfermedades y encontrad las vacunas antes de que el mundo colapse.",
    review:
      "Pandemic sigue siendo el cooperativo de referencia. Cada rol empuja un estilo distinto y la mesa se siente unida contra el reloj. La tensión de los brotes es perfecta para noches en las que queréis ganar (o perder) juntos. Ojo al “quarterback”: acordad hablar y decidir en grupo.",
    categories: ["Cooperativo", "Estrategia", "Aventura"],
    difficulty: "Medio",
    featured: true,
    pros: [
      "Cooperación real",
      "Roles asimétricos",
      "Curva de tensión excelente",
      "Muy rejugable",
    ],
    cons: ["Un jugador puede dirigir demasiado", "Temática intensa"],
    rulesSummary:
      "En tu turno: hasta 4 acciones (mover, construir, tratar, compartir conocimiento, descubrir cura), luego robas cartas de jugador y resuelves infecciones. Curad las 4 enfermedades antes de que se agoten los brotes, las cartas o el tablero se sature.",
  },
  {
    name: "Código Secreto",
    description:
      "Party de palabras: un espía da pistas y su equipo adivina agentes… sin tocar al asesino.",
    review:
      "Código Secreto (Codenames) no es cooperativo puro: son dos equipos compitiendo. La magia está en una sola palabra que apunta a varias cartas. Con grupos grandes es imparable; genera risas y momentos “¿cómo no lo viste?”. Ideal de sobremesa.",
    categories: ["Party", "Deducción", "Cartas"],
    difficulty: "Fácil",
    featured: true,
    pros: [
      "Ideal para 6–8",
      "Se explica en 2 minutos",
      "Rejugabilidad infinita",
      "Momentos memorables",
    ],
    cons: ["Depende del idioma", "Menos interesante a 2–3"],
    rulesSummary:
      "Dos equipos. Cada espía maestro ve qué palabras son suyas. Da una pista: una palabra + un número. El equipo toca esa cantidad de cartas. Acertar suma; fallar pasa el turno. Quien toque al asesino pierde al instante.",
  },
  {
    name: "Aventureros al tren",
    description:
      "Colecciona vagones y reclama rutas por el mapa: el gateway familiar por excelencia.",
    review:
      "Ticket to Ride enseña a cualquier mesa qué es un euro ligero. Completar destinos da esa satisfacción de puzzle, y el bloqueo de rutas mete tensión sin volverse agresivo. En casa funciona genial con visitas o con quien “no juega a juegos de mesa”.",
    categories: ["Familiar", "Estrategia"],
    difficulty: "Fácil",
    pros: [
      "Reglas accesibles",
      "Mapa atractivo",
      "Tensión creciente",
      "Bueno en familia",
    ],
    cons: ["Bloqueos pueden molestar", "Algo de suerte en el mazo"],
  },
  {
    name: "7 Wonders",
    description:
      "Drafting simultáneo de civilizaciones: hasta 7 jugadores sin alargar la partida.",
    review:
      "7 Wonders es el rey del “muchos jugadores, poco tiempo”. Drafting a la vez, maravillas asimétricas y varias vías de puntuación. La iconografía intimida el primer día; al segundo fluye solo. Perfecto si sois cinco o más y no queréis un party caótico.",
    categories: ["Estrategia", "Cartas", "Familiar"],
    difficulty: "Medio",
    pros: [
      "Escala hasta 7",
      "Duración estable",
      "Varias estrategias",
      "Civilizaciones distintas",
    ],
    cons: ["Iconos densos al inicio", "Interacción más indirecta"],
  },
  {
    name: "7 Wonders Duel",
    description:
      "Duelo a dos: drafting tenso, condiciones de victoria múltiples y cero tiempo muerto.",
    review:
      "Si Azul es elegante, Duel es afilado. Cada carta que coges (o niegas) importa, y puedes ganar por militar, ciencia o puntos. Es el “vamos tú y yo” de estrategia corta de la estantería.",
    categories: ["Estrategia", "Cartas"],
    difficulty: "Medio",
    featured: true,
    pros: [
      "Diseñado para 2",
      "Decisiones densas",
      "Varias formas de ganar",
      "Partidas de ~30 min",
    ],
    cons: ["Menos temático que el original", "Castiga errores tempranos"],
  },
  {
    name: "Catan",
    description:
      "Coloniza, comercia y construye: el clásico que metió a media humanidad en los juegos modernos.",
    review:
      "Catan sigue siendo conversación y negociación. Los dados meten varianza; el comercio arregla (o rompe) partidas. En casa lo sacamos cuando queremos algo social y reconocible, no cuando buscamos un euro preciso.",
    categories: ["Familiar", "Estrategia", "Comercio"],
    difficulty: "Medio",
    pros: [
      "Muy social",
      "Fácil de enseñar",
      "Nostalgia garantizada",
      "Buen ritmo a 3–4",
    ],
    cons: ["La suerte de dados pesa", "Puede alargarse"],
  },
  {
    name: "Catan (cartas)",
    description:
      "Catan condensado a dos: desarrollo y combos sin tablero hexagonal.",
    review:
      "La versión de cartas mantiene el espíritu de recursos y progreso en un formato íntimo. Menos espectáculo visual que el tablero, más duelo directo. Buena opción si sois dos y os apetece “algo Catan” sin montar la isla.",
    categories: ["Cartas", "Estrategia"],
    difficulty: "Medio",
    pros: ["Hecho para 2", "Setup rápido", "Decisiones de desarrollo"],
    cons: ["Menos iconicidad", "Puede sentirse seco"],
  },
  {
    name: "Ciudadelas",
    description:
      "Elige un rol secreto, construye tu ciudad y sabotea al resto: bluff ligero con cartas.",
    review:
      "Ciudadelas es faroleo amable. Robar el personaje correcto (asesino, ladrón, rey…) cambia la ronda. Escala bien y funciona en sobremesas donde queréis interacción sin un war-game. La construcción de ciudad da un arco claro de puntos.",
    categories: ["Cartas", "Bluff", "Construcción"],
    difficulty: "Medio",
    pros: [
      "Roles memorables",
      "Buena interacción",
      "Escala 2–8 (mejor 4–6)",
      "Partidas vivas",
    ],
    cons: ["Algo de caos con muchos", "Suerte en el draft de roles"],
  },
  {
    name: "Coloretto",
    description:
      "Colecciona colores… pero solo puntúan tres: tentación y castigo en cada carta.",
    review:
      "Coloretto es filler inteligente. La fila de cartas te invita a ser codicioso y luego te castiga. Se enseña en un minuto y deja esa sonrisa de “otra ronda”. Ideal entre platos o para abrir la noche.",
    categories: ["Cartas", "Familiar"],
    difficulty: "Fácil",
    pros: ["Ultraligero", "Decisiones limpias", "Perfecto filler"],
    cons: ["Profundidad limitada", "Suerte del mazo"],
  },
  {
    name: "Cortex",
    description:
      "Rondas de retos mentales: memoria, lógica, laberintos y percepción a toda pastilla.",
    review:
      "Cortex es un party cerebral. Cada desafío es distinto y corto; ideal con niños mayores o adultos que disfruten competir “con la cabeza”. No es un euro: es energía y risas. La rejugabilidad baja cuando conocéis todos los tipos de prueba.",
    categories: ["Familiar", "Reflejos", "Party"],
    difficulty: "Fácil",
    pros: ["Muy dinámico", "Variedad de retos", "Inclusivo"],
    cons: ["Se repite con el tiempo", "Poco “juego de mesa” clásico"],
  },
  {
    name: "Blind Business",
    description:
      "Negociáis a ciegas: faroleo rápido, risas y cero información perfecta.",
    review:
      "Blind Business es caos controlado de party. No ver tus cartas fuerza lecturas de mesa y mentiras creativas. No busquéis profundidad estratégica: buscad ruido bueno y partidas cortas.",
    categories: ["Party", "Cartas", "Bluff"],
    difficulty: "Fácil",
    pros: ["Muy social", "Setup nulo", "Rondas rápidas"],
    cons: ["Poco estratégico", "Depende del grupo"],
  },
  {
    name: "Deep Sea Adventure",
    description:
      "Bajad a por tesoros compartiendo oxígeno: codicia cooperativa… hasta que alguien se pasa.",
    review:
      "Deep Sea Adventure es push-your-luck brillante. El oxígeno común crea drama colectivo aunque cada cual puntúa por su cuenta. Partidas de 30 minutos, mesa pequeña, tensión enorme. Un diamante de la estantería.",
    categories: ["Familiar", "Estrategia"],
    difficulty: "Fácil",
    featured: true,
    pros: [
      "Tensión brutal",
      "Reglas mínimas",
      "Caja pequeña",
      "Muy rejugable",
    ],
    cons: ["Puede frustrar si “os ahogáis”", "Menos control puro"],
    rulesSummary:
      "Todos bajáis por la misma ruta de tesoros. En tu turno tiras dados de movimiento (menos tu carga). Al volver a submarino sumas puntos; si el oxígeno llega a 0 antes, quien no haya vuelto pierde lo cogido. El oxígeno baja según el número de fichas que llevéis.",
  },
  {
    name: "Desierto Prohibido",
    description:
      "Cooperativo de supervivencia: recuperad piezas de la nave antes de que la arena os trague.",
    review:
      "Hermano espiritual de Pandemic en el desierto. Roles claros, tormentas que remueven el tablero y una carrera contra el tiempo. Excelente si os gusta ganar o perder juntos con más aventura y menos “mapa de enfermedades”.",
    categories: ["Cooperativo", "Aventura", "Estrategia"],
    difficulty: "Medio",
    pros: [
      "Cooperativo temático",
      "Tablero vivo",
      "Buena dificultad",
      "Roles útiles",
    ],
    cons: ["Puede sentirse injusto", "Setup algo más largo"],
  },
  {
    name: "Exploding Kittens",
    description:
      "Mazo letal de gatos bomba: roba, esquiva, sabotea… y procura no explotar.",
    review:
      "Exploding Kittens es party de cartas sin filtro. Las ilustraciones y el humor llevan la experiencia; la estrategia es ligera. Ideal para romper el hielo o cerrar la noche con risas, no para una sesión “seria”.",
    categories: ["Party", "Cartas"],
    difficulty: "Fácil",
    pros: ["Humor inmediato", "Reglas simples", "Partidas cortas"],
    cons: ["Mucha suerte", "Poca profundidad"],
  },
  {
    name: "Exploding Kittens: Edición 2 jugadores",
    description:
      "El caos de Exploding Kittens afinado para duelos a dos.",
    review:
      "La edición a 2 mantiene el tono absurdo con un mazo más cerrado. Funciona como filler rápido en pareja; no sustituye a un duelo estratégico tipo Jaipur o Splendor Duel.",
    categories: ["Party", "Cartas"],
    difficulty: "Fácil",
    pros: ["Pensado para 2", "Muy rápido", "Mismo humor"],
    cons: ["Sigue siendo muy random", "Se agota pronto"],
  },
  {
    name: "Fantasma Blitz",
    description:
      "Objetos de colores que no cuadran: el más rápido en agarrar el correcto gana.",
    review:
      "Fantasma Blitz (Ghost Blitz) es reflejos puros. Las cartas mienten a propósito y la mesa estalla en risas. Perfecto con niños y adultos competitivos; cero downtime. En casa es el “una más” eterno.",
    categories: ["Party", "Reflejos", "Familiar"],
    difficulty: "Fácil",
    pros: ["Instantáneo", "Muy divertido", "Caja pequeña"],
    cons: ["Requiere buena vista", "Caos con muchos jugadores"],
    rulesSummary:
      "Se revela una carta con objetos/colores. Agarra el objeto físico que coincide exactamente, o el que no aparece si ninguno cuadra (regla del “objeto ausente” según la carta). Quien acierta se queda la carta. Más cartas al final gana.",
  },
  {
    name: "High Society",
    description:
      "Subastas de lujo: gasta con estilo… pero el más pobre al final queda fuera.",
    review:
      "High Society es un joya de Reiner Knizia: subasta limpia, lectura de rivales y un twist cruel (el más pobre no puntúa). En 20 minutos decide quién tiene sangre fría. Favorito de cartas de estrategia corta.",
    categories: ["Subasta", "Estrategia", "Cartas"],
    difficulty: "Medio",
    featured: true,
    pros: [
      "Reglas quirúrgicas",
      "Decisiones duras",
      "Partidas relámpago",
      "Muy elegante",
    ],
    cons: ["Menos temático", "Castiga errores de cálculo"],
  },
  {
    name: "Jaipur",
    description:
      "Comercio de camelidos y gemas: el mejor duelo corto de la estantería.",
    review:
      "Jaipur es ritmo, timing y lectura del rival. Cambiar el mercado, cerrar sets y no quedarte con camellos de más. En casa es el “¿una partida rápida?” por defecto a dos.",
    categories: ["Comercio", "Cartas", "Estrategia"],
    difficulty: "Fácil",
    featured: true,
    pros: [
      "Diseño perfecto a 2",
      "Partidas de 20–30 min",
      "Alta rejugabilidad",
      "Enseñable al momento",
    ],
    cons: ["Solo 2 jugadores", "Algo de suerte en el mazo"],
  },
  {
    name: "Jerusalem",
    description:
      "Estrategia densa ambientada en la ciudad: control, timing y partidas largas de mesa seria.",
    review:
      "Jerusalem es el plato fuerte cuando queréis una sesión larga y con peso. Pide atención, premia planificar y castiga el piloto automático. No es para abrir la noche con visitas: es para cuando Nil saca el modo estratega. Si venís de fillers, subid la dificultad con calma.",
    categories: ["Estrategia"],
    difficulty: "Difícil",
    featured: true,
    pros: [
      "Profundidad alta",
      "Partida memorable",
      "Satisfacción de “euro serio”",
      "Buen desafío a 2–4",
    ],
    cons: [
      "Curva de aprendizaje",
      "Duración larga (~90 min)",
      "Menos accesible para novatos",
    ],
    rulesSummary:
      "Partida de estrategia por rondas: gestionad recursos e influencia para marcaros objetivos en el tablero. Priorizad el timing de acciones frente a rivales; la puntuación suele llegar al final por mayorías y objetivos cumplidos. Explicad por fases la primera vez (preparación → acciones → puntuación intermedia si aplica → final).",
  },
  {
    name: "Manchas",
    description:
      "Patrones de color y colocación: abstracto familiar ligero para cualquier edad.",
    review:
      "Manchas es amable, visual y rápido. No revolucionará a jugones duros, pero brilla como introducción o partida corta en familia. Buen contraste con juegos más agresivos de la colección.",
    categories: ["Abstracto", "Familiar"],
    difficulty: "Fácil",
    pros: ["Muy accesible", "Bonito en mesa", "Partidas cortas"],
    cons: ["Poca profundidad", "Se queda corto para expertos"],
  },
  {
    name: "Pelusas",
    description:
      "Observación y velocidad con bichitos de colores: filler familiar con risas.",
    review:
      "Pelusas funciona como Fantasma Blitz en espíritu más “cute”. Ideal con niños o para desconectar el cerebro. No esperéis capas estratégicas: esperad gritos buenos.",
    categories: ["Party", "Familiar", "Reflejos"],
    difficulty: "Fácil",
    pros: ["Divertido", "Rápido", "Familiar"],
    cons: ["Poca estrategia", "Depende de reflejos"],
  },
  {
    name: "Splendor Duel",
    description:
      "Lujo y motor de gemas a dos: el Splendor que de verdad brilla en duelo.",
    review:
      "Splendor Duel añade objetivos y tensión que al original a veces le faltan a dos. Construir el motor, bloquear al rival y cerrar condiciones de victoria. Uno de los mejores “euro cortos” de la casa.",
    categories: ["Estrategia", "Cartas"],
    difficulty: "Medio",
    featured: true,
    pros: [
      "Excelente a 2",
      "Decisiones densas",
      "Componentes atractivos",
      "~30–40 min",
    ],
    cons: ["Menos “multi” que el Splendor clásico", "Puede castigar un mal inicio"],
  },
  {
    name: "Symbiose",
    description:
      "Colocación y equilibrio de ecosistemas: abstracto orgánico con decisiones limpias.",
    review:
      "Symbiose premia mirar el tablero como un puzzle vivo. No es party ni filler puro: pide concentración amable. Buena opción cuando queréis algo distinto a cartas y subastas.",
    categories: ["Abstracto", "Estrategia", "Familiar"],
    difficulty: "Medio",
    pros: ["Sensación fresca", "Bonito concepto", "Decisiones espaciales"],
    cons: ["Menos conocido", "Puede sentirse abstracto de más"],
  },
  {
    name: "Trio",
    description:
      "Buscad tríos de números: memoria, faroleo ligero y partidas que vuelan.",
    review:
      "Trio es clever y corto. Preguntar, recordar y arriesgar a cerrar el trío. Funciona en familia y con amigos; no abruma y deja buen sabor de “otra”.",
    categories: ["Party", "Familiar", "Cartas"],
    difficulty: "Fácil",
    pros: ["Muy rápido", "Reglas mínimas", "Divertido en grupo"],
    cons: ["Memoria ayuda mucho", "Profundidad baja"],
  },
  {
    name: "¡Toma 6!",
    description:
      "Jugad cartas a la vez y evitad ser el sexto en la fila: tensión colectiva en cada ronda.",
    review:
      "¡Toma 6! (6 Nimmt!) es puro “todos pensamos lo mismo… o no”. Simultáneo, cruel de forma justa y perfecto con mucha gente. Un clásico que nunca sobra en la estantería.",
    categories: ["Party", "Cartas", "Familiar"],
    difficulty: "Fácil",
    pros: [
      "Escala hasta 10",
      "Reglas inmediatas",
      "Tensión constante",
      "Barato de enseñar",
    ],
    cons: ["Mucha lectura de mesa / suerte", "Puede frustrar al principiante"],
  },
];
