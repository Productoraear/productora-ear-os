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

const RHYME_SETS: readonly RhymeSet[] = [
  { a: "amanecer", b: "querer" },
  { a: "corazón", b: "canción" },
  { a: "mirada", b: "enamorada" },
  { a: "destino", b: "camino" },
  { a: "verdad", b: "eternidad" },
] as const;

const VOWEL_REGEX = /[aeiouáéíóúü]/g;
const VOWEL_PAIR_REGEX = /^[aeiouáéíóúü]+$/;
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_LETTER_REGEX = /[^a-záéíóúñü]/g;

const FILLER_WORDS: readonly string[] = [
  "hoy",
  "siempre",
  "juntos",
  "al fin",
  "mi amor",
] as const;

const DEFAULT_GENRE = "balada";
const DEFAULT_PROTAGONISTS = "vosotros";
const DEFAULT_PROMISE = "bailar bajo la lluvia";
const DEFAULT_HOW_THEY_MET = "un encuentro de destino";
const DEFAULT_ANECDOTE = "una anécdota inolvidable";
const TARGET_SYLLABLES = 8;

function countSyllables(line: string): number {
  const cleaned = line
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(NON_LETTER_REGEX, "");

  if (!cleaned) return 0;

  const vowels = cleaned.match(VOWEL_REGEX) ?? [];
  let syllables = vowels.length;

  for (let i = 0; i < cleaned.length - 1; i++) {
    const pair = cleaned[i] + cleaned[i + 1];
    if (VOWEL_PAIR_REGEX.test(pair)) {
      syllables -= 1;
      i += 1;
    }
  }

  return Math.max(syllables, 1);
}

function padToEightSyllables(line: string): string {
  const syllables = countSyllables(line);
  if (syllables >= TARGET_SYLLABLES) return line;

  let result = line;
  let index = 0;
  while (countSyllables(result) < TARGET_SYLLABLES && index < FILLER_WORDS.length) {
    result = `${result} ${FILLER_WORDS[index]}`;
    index += 1;
  }

  return result;
}

function capitalize(sentence: string): string {
  const trimmed = sentence.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function buildVerse(rhyme: string, content: string): string {
  const base = content.trim();
  const padded = padToEightSyllables(base);
  return capitalize(`${padded}, ${rhyme}.`);
}

function normalizeGenre(genre: string): string {
  if (!genre) return DEFAULT_GENRE;
  return genre.toLowerCase();
}

function pickRhymeSet(genre: string): RhymeSet {
  const hash = genre
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % RHYME_SETS.length;
  return RHYME_SETS[index];
}

/**
 * Genera una letra estructurada en estrofas A/B/A/B con rima consonante,
 * versos de 8 sílabas y un estribillo memorable, a partir de la historia
 * del evento y el género musical seleccionado.
 */
export function generateStructuredLyrics(
  storyData: StoryData,
  genre: string,
): LyricsResult {
  const normalizedGenre = normalizeGenre(genre);
  const protagonists = storyData.protagonists.trim() || DEFAULT_PROTAGONISTS;
  const promise = storyData.promise.trim() || DEFAULT_PROMISE;
  const howTheyMet = storyData.howTheyMet.trim() || DEFAULT_HOW_THEY_MET;
  const anecdote = storyData.anecdote.trim() || DEFAULT_ANECDOTE;
  const dedication = storyData.dedication.trim() || `Para ${protagonists}`;

  const rhymeSet = pickRhymeSet(normalizedGenre);
  const rhymeA = rhymeSet.a;
  const rhymeB = rhymeSet.b;

  const verseOne: readonly string[] = [
    "Vosotros sois la razón",
    "de una historia sin final",
    "y en cada respiración",
    "vuestro amor es inmortal",
  ];

  const verseTwo: readonly string[] = [
    "Os conocisteis al fin",
    "como quiso el corazón",
    "y el día que os hizo unir",
    "nació esta dulce canción",
  ];

  const verseThree: readonly string[] = [
    "Aquella anécdota fiel",
    "que hoy volvemos a contar",
    "es el latido más fiel",
    "de un amor que no se va",
  ];

  const structuredVerse: readonly string[] = [
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

  const title = `${protagonists} · ${capitalize(normalizedGenre)} de Boda`;

  const verses: string[] = [
    ...verseOne,
    ...verseTwo,
    ...verseThree,
    ...structuredVerse,
  ];

  return {
    verses,
    chorus,
    title,
  };
}