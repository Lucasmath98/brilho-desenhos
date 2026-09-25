export type Show = {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  age: string;
  progress: number | undefined;
  source: { type: "youtube"; id: string } | { type: "video"; url: string };
};

const images = import.meta.glob("../assets/shows/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const stories = [
  { title: "O Menino na Manjedoura", description: "Maria e José recebem o menino Jesus numa noite iluminada de amor e esperança." },
  { title: "O Anjo Visita Maria", description: "O anjo Gabriel leva a Maria uma notícia muito especial enviada por Deus." },
  { title: "A Viagem para Belém", description: "Maria e José seguem juntos por uma longa estrada, confiando no cuidado de Deus." },
  { title: "Os Pastores e a Estrela", description: "Pastores deixam seus campos para conhecer o Salvador anunciado pelos anjos." },
  { title: "Os Reis Magos", description: "Três viajantes seguem uma estrela brilhante e levam presentes ao menino Jesus." },
  { title: "Jesus no Templo", description: "Ainda menino, Jesus conversa sobre Deus e surpreende os sábios no templo." },
  { title: "Jesus Acalma a Tempestade", description: "No meio do vento e das ondas, Jesus ensina seus amigos a confiar e ter fé." },
  { title: "Jesus Multiplica os Pães", description: "Cinco pães e dois peixes se tornam alimento para uma grande multidão." },
  { title: "Jesus Cura o Cego", description: "Com carinho e poder, Jesus devolve a visão e enche um coração de alegria." },
  { title: "O Primeiro Milagre", description: "Numa festa em Caná, Jesus transforma água em vinho e ajuda uma família." },
  { title: "Levanta e Anda", description: "Jesus cura um homem e mostra que a fé abre caminhos para uma vida nova." },
  { title: "Jesus Caminha sobre as Águas", description: "Sobre o mar, Jesus vai ao encontro dos discípulos e acalma seus medos." },
  { title: "A Ovelha Perdida", description: "Um bom pastor procura sua ovelhinha até encontrá-la e trazê-la para casa." },
  { title: "O Bom Samaritano", description: "Um viajante aprende que amar o próximo é cuidar de quem precisa de ajuda." },
  { title: "A Semente de Mostarda", description: "Jesus mostra como uma fé pequenina pode crescer e fazer coisas grandiosas." },
  { title: "O Filho que Voltou", description: "Um pai recebe o filho de braços abertos numa história sobre perdão e amor." },
  { title: "A Casa sobre a Rocha", description: "Duas casas enfrentam a chuva e ensinam por que devemos ouvir Jesus." },
  { title: "Deixai Vir a Mim as Criancinhas", description: "Jesus acolhe as crianças e mostra que cada uma delas é muito preciosa." },
  { title: "Zaqueu Sobe na Árvore", description: "Um homem baixinho encontra Jesus e descobre a alegria de mudar o coração." },
  { title: "Jesus Chama os Discípulos", description: "Pescadores deixam suas redes para seguir Jesus e compartilhar boas notícias." },
  { title: "Jesus Lava os Pés dos Discípulos", description: "Com humildade, Jesus ensina seus amigos a servir e cuidar uns dos outros." },
  { title: "A Entrada em Jerusalém", description: "Jesus chega à cidade enquanto famílias celebram com alegria e ramos de palmeira." },
  { title: "O Túmulo Vazio", description: "Ao nascer do sol, uma grande surpresa anuncia que a esperança venceu." },
  { title: "Jesus Vive!", description: "Jesus reencontra seus amigos e enche seus corações de paz, coragem e alegria." },
];

export const shows: Show[] = stories.map(({ title, description }, index) => {
  const image = images[`../assets/shows/show-${String(index + 1).padStart(2, "0")}.jpg`];
  if (!image) throw new Error(`Capa não encontrada para ${title}`);
  const source: Show["source"] = index === 13
    ? { type: "video", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
    : { type: "youtube", id: "M7lc1UVf-VE" };
  return {
  id: index + 1,
  title,
  description,
  image,
  duration: index > 17 ? `${3 + (index % 3)} min` : `${8 + (index % 14)} min`,
  age: "Livre",
  progress: index < 5 ? [38, 72, 19, 54, 84][index] : undefined,
  source,
  };
});

export const shelves = [
  { title: "Nascimento de Jesus", ids: [1, 2, 3, 4, 5, 6] },
  { title: "Milagres de Jesus", ids: [7, 8, 9, 10, 11, 12] },
  { title: "Parábolas de Jesus", ids: [13, 14, 15, 16, 17] },
  { title: "Jesus e as Crianças", ids: [18, 19, 8, 9] },
  { title: "Páscoa e Ressurreição", ids: [21, 22, 23, 24] },
  { title: "Discípulos de Jesus", ids: [7, 12, 20, 21, 24] },
];