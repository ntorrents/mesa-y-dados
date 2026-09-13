export type FavoritePick = {
  category: string;
  gameName: string;
};

export type PersonFavorites = {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  picks: FavoritePick[];
};

export const houseFavorites: PersonFavorites[] = [
  {
    slug: "nil",
    name: "Nil",
    tagline: "Estratega de cartas y duelos a dos",
    accent: "#c4a574",
    picks: [
      { category: "Mejor para 2", gameName: "Splendor Duel" },
      { category: "Cartas", gameName: "High Society" },
      { category: "Estrategia", gameName: "Jerusalem" },
      { category: "Rápido", gameName: "Love Letter" },
      { category: "Fácil", gameName: "Manchas" },
      { category: "Familiar", gameName: "Dixit" },
    ],
  },
  {
    slug: "christine",
    name: "Christine",
    tagline: "Partidas cortas, tensión y risas",
    accent: "#7a9e87",
    picks: [
      { category: "Mejor para 2", gameName: "Jaipur" },
      { category: "Cartas", gameName: "Symbiose" },
      { category: "Estrategia", gameName: "Catan" },
      { category: "Rápido", gameName: "Exploding Kittens: Edición 2 jugadores" },
      { category: "Fácil", gameName: "Pelusas" },
      { category: "Familiar", gameName: "Azul" },
    ],
  },
];
