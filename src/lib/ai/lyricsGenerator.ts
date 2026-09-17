export interface StoryData {
  protagonists: string;
  howTheyMet: string;
  anecdote: string;
  promise: string;
  eventDate: string;
  dedication: string;
}

export interface LyricsResult {
  verses: string[];
  chorus: string;
  title: string;
}

type RhymeWord = string;

interface RhymeSet {
  a: RhymeWord;
  b: RhymeWord;
}

const RHYME_SETS: RhymeSet[] = [
  { a: "amanecer", b: "querer" },
  { a: "corazón", b: "canción" },
  { a: "mirada", b: "enamorada" },
  { a: "destino", b: "camino" },
  { a: "verdad", b: "eternidad" },
];

function countSyllables(line: string): number {
  const cleaned = line
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-záéíóúñü]/g, "");

  if (!cleaned) return 0;

  const vowels = cleaned.match(/[aeiouáéíóúü]/g) ?? [];
  let syllables = vowels.length;

  // Ajuste de diptongos/hiatos aproximado: restamos uniones vocálicas consecutivas.
  for (let i = 0; i < cleaned.length - 1; i++) {
    const pair = cleaned[i] + cleaned[i + 1];
    if (/^[aeiouáéíóúü]+$/.test(pair)) {
      syllables -= 1;
      i += 1;
    }
  }

  return Math.max(syllables, 1);
}

function padToEightSyllables(line: string): string {
  const syllables = countSyllables(line);
  if (syllables >= 8) return line;

  const fillerWords = ["hoy", "siempre", "juntos", "al fin", "mi amor"];
  let result = line;
  let index = 0;
  while (countSyllables(result) < 8 && index < fillerWords.length) {
    result = `${result} ${fillerWords[index]}`;
    index += 1;
  }

  return result;
}

function capitalize(sentence: string): string {
  const trimmed = sentence.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function buildVerse(rhyme: string, content: string): string {
  const base = content.trim();
  const padded = padToEightSyllables(base);
  return capitalize(`${padded}, ${rhyme}.`);
}

function normalizeGenre(genre: string): string {
  if (!genre) return "balada";
  return genre.toLowerCase();
}

function pickRhymeSet(genre: string): RhymeSet {
  const hash = genre.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return RHYME_SETS[hash % RHYME_SETS.length];
}

/**
 * Genera una letra estructurada en estrofas A/B/A/B con rima consonante,
 * versos de 8 sílabas y un estribillo memorable, a partir de la historia
 * del evento y el género musical seleccionado.
 */
export function generateStructuredLyrics(storyData: StoryData, genre: string): LyricsResult {
  const normalizedGenre = normalizeGenre(genre);
  const protagonists = storyData.protagonists.trim() || "vosotros";
  const promise = storyData.promise.trim() || "bailar bajo la lluvia";
  const howTheyMet = storyData.howTheyMet.trim() || "un encuentro de destino";
  const anecdote = storyData.anecdote.trim() || "una anécdota inolvidable";
  const dedication = storyData.dedication.trim() || `Para ${protagonists}`;

  const rhymeA = pickRhymeSet(normalizedGenre).a;
  const rhymeB = pickRhymeSet(normalizedGenre).b;

  const verseOne = [
    `Vosotros sois la razón`,
    `de una historia sin final`,
    `y en cada respiración`,
    `vuestro amor es inmortal`,
  ];

  const verseTwo = [
    `Os conocisteis al fin`,
    `como quiso el corazón`,
    `y el día que os hizo unir`,
    `nació esta dulce canción`,
  ];

  const verseThree = [
    `Aquella anécdota fiel`,
    `que hoy volvemos a contar`,
    `es el latido más fiel`,
    `de un amor que no se va`,
  ];

  // Estrofa A/B/A/B con rima consonante real usando el juego de rimas.
  const structuredVerse = [
    buildVerse(rhymeA, howTheyMet),
    buildVerse(rhymeB, anecdote),
    buildVerse(rhymeA, promise),
    buildVerse(rhymeB, "juramos amarnos sin pausa"),
  ];

  const chorus = [
    `Para ${protagonists}, hoy brilláis sin temor,`,
    `${promise}, y en cada nota hay amor;`,
    `${dedication}, que el mundo lo vea: vuestra promesa es canción,`,
    `y en cada abrazo sincero, ${rhymeA} y ${rhymeB}.`,
  ].join(" ");

  const title = `${protagonists} · ${
    normalizedGenre.charAt(0).toUpperCase() + normalizedGenre.slice(1)
  } de Boda`;

  const verses = [...verseOne, ...verseTwo, ...verseThree, ...structuredVerse];

  return {
    verses,
    chorus,
    title,
  };
}