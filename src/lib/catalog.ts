export type Show = {
  id: number;
  title: string;
  image: string;
  duration: string;
  age: string;
  progress: number | undefined;
  source: { type: "youtube"; id: string } | { type: "video"; url: string };
};

const images = import.meta.glob("../assets/shows/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const titles = [
  "O Foguete do Formiguinha", "A Ilha dos Bichinhos", "Pilotos das Nuvens", "O Jardim da Lua",
  "Mergulho Colorido", "Draguinho da Floresta", "O Urso e o Livro Mágico", "Detetives do Bosque",
  "A Banda dos Pinguins", "Turma da Fazendinha", "Robôs que Contam", "A Escola dos Planetas",
  "Bia, a Baleinha", "Confeitaria da Mimi", "Orquestra da Selva", "O Trenzinho de Madeira",
  "Histórias da Vovó Lili", "Os Três Porquinhos", "A Luz do Vagalume", "O Bolo da Coelhinha",
  "Bebês Dinossauros", "A Dança da Chuva", "A Raposa e o Girassol", "Estrelinhas Sonolentas",
];

export const shows: Show[] = titles.map((title, index) => {
  const image = images[`../assets/shows/show-${String(index + 1).padStart(2, "0")}.jpg`];
  if (!image) throw new Error(`Capa não encontrada para ${title}`);
  const source: Show["source"] = index === 13
    ? { type: "video", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
    : { type: "youtube", id: "M7lc1UVf-VE" };
  return {
  id: index + 1,
  title,
  image,
  duration: index > 17 ? `${3 + (index % 3)} min` : `${8 + (index % 14)} min`,
  age: "Livre",
  progress: index < 5 ? [38, 72, 19, 54, 84][index] : undefined,
  source,
  };
});

export const shelves = [
  { title: "Continue Assistindo", ids: [1, 4, 8, 13, 17] },
  { title: "Desenhos em Alta", ids: [2, 6, 9, 12, 15, 21] },
  { title: "Aventura", ids: [1, 3, 5, 6, 12, 21] },
  { title: "Educativo", ids: [7, 11, 12, 17, 22] },
  { title: "Bichinhos e Animais", ids: [2, 8, 10, 13, 14, 15, 23] },
  { title: "Clássicos", ids: [16, 17, 18, 7, 10] },
  { title: "Curtinhas (até 5 min)", ids: [19, 20, 21, 22, 23, 24] },
];