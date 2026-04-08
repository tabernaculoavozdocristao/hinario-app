export interface BibleBook {
  id: string;
  name: string;
  abbrev: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleSearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'genesis', name: 'Genesis', abbrev: 'Gn', chapters: 50, testament: 'old' },
  { id: 'exodus', name: 'Exodo', abbrev: 'Ex', chapters: 40, testament: 'old' },
  { id: 'leviticus', name: 'Levitico', abbrev: 'Lv', chapters: 27, testament: 'old' },
  { id: 'numbers', name: 'Numeros', abbrev: 'Nm', chapters: 36, testament: 'old' },
  { id: 'deuteronomy', name: 'Deuteronomio', abbrev: 'Dt', chapters: 34, testament: 'old' },
  { id: 'joshua', name: 'Josue', abbrev: 'Js', chapters: 24, testament: 'old' },
  { id: 'judges', name: 'Juizes', abbrev: 'Jz', chapters: 21, testament: 'old' },
  { id: 'ruth', name: 'Rute', abbrev: 'Rt', chapters: 4, testament: 'old' },
  { id: '1samuel', name: '1 Samuel', abbrev: '1Sm', chapters: 31, testament: 'old' },
  { id: '2samuel', name: '2 Samuel', abbrev: '2Sm', chapters: 24, testament: 'old' },
  { id: '1kings', name: '1 Reis', abbrev: '1Rs', chapters: 22, testament: 'old' },
  { id: '2kings', name: '2 Reis', abbrev: '2Rs', chapters: 25, testament: 'old' },
  { id: '1chronicles', name: '1 Cronicas', abbrev: '1Cr', chapters: 29, testament: 'old' },
  { id: '2chronicles', name: '2 Cronicas', abbrev: '2Cr', chapters: 36, testament: 'old' },
  { id: 'ezra', name: 'Esdras', abbrev: 'Ed', chapters: 10, testament: 'old' },
  { id: 'nehemiah', name: 'Neemias', abbrev: 'Ne', chapters: 13, testament: 'old' },
  { id: 'esther', name: 'Ester', abbrev: 'Et', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Jo', abbrev: 'Jo', chapters: 42, testament: 'old' },
  { id: 'psalms', name: 'Salmos', abbrev: 'Sl', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Proverbios', abbrev: 'Pv', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Eclesiastes', abbrev: 'Ec', chapters: 12, testament: 'old' },
  { id: 'song-of-solomon', name: 'Canticos', abbrev: 'Ct', chapters: 8, testament: 'old' },
  { id: 'isaiah', name: 'Isaias', abbrev: 'Is', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremias', abbrev: 'Jr', chapters: 52, testament: 'old' },
  { id: 'lamentations', name: 'Lamentacoes', abbrev: 'Lm', chapters: 5, testament: 'old' },
  { id: 'ezekiel', name: 'Ezequiel', abbrev: 'Ez', chapters: 48, testament: 'old' },
  { id: 'daniel', name: 'Daniel', abbrev: 'Dn', chapters: 12, testament: 'old' },
  { id: 'hosea', name: 'Oseias', abbrev: 'Os', chapters: 14, testament: 'old' },
  { id: 'joel', name: 'Joel', abbrev: 'Jl', chapters: 3, testament: 'old' },
  { id: 'amos', name: 'Amos', abbrev: 'Am', chapters: 9, testament: 'old' },
  { id: 'obadiah', name: 'Obadias', abbrev: 'Ob', chapters: 1, testament: 'old' },
  { id: 'jonah', name: 'Jonas', abbrev: 'Jn', chapters: 4, testament: 'old' },
  { id: 'micah', name: 'Miqueias', abbrev: 'Mq', chapters: 7, testament: 'old' },
  { id: 'nahum', name: 'Naum', abbrev: 'Na', chapters: 3, testament: 'old' },
  { id: 'habakkuk', name: 'Habacuque', abbrev: 'Hc', chapters: 3, testament: 'old' },
  { id: 'zephaniah', name: 'Sofonias', abbrev: 'Sf', chapters: 3, testament: 'old' },
  { id: 'haggai', name: 'Ageu', abbrev: 'Ag', chapters: 2, testament: 'old' },
  { id: 'zechariah', name: 'Zacarias', abbrev: 'Zc', chapters: 14, testament: 'old' },
  { id: 'malachi', name: 'Malaquias', abbrev: 'Ml', chapters: 4, testament: 'old' },
  { id: 'matthew', name: 'Mateus', abbrev: 'Mt', chapters: 28, testament: 'new' },
  { id: 'mark', name: 'Marcos', abbrev: 'Mc', chapters: 16, testament: 'new' },
  { id: 'luke', name: 'Lucas', abbrev: 'Lc', chapters: 24, testament: 'new' },
  { id: 'john', name: 'Joao', abbrev: 'Jo', chapters: 21, testament: 'new' },
  { id: 'acts', name: 'Atos', abbrev: 'At', chapters: 28, testament: 'new' },
  { id: 'romans', name: 'Romanos', abbrev: 'Rm', chapters: 16, testament: 'new' },
  { id: '1corinthians', name: '1 Corintios', abbrev: '1Co', chapters: 16, testament: 'new' },
  { id: '2corinthians', name: '2 Corintios', abbrev: '2Co', chapters: 13, testament: 'new' },
  { id: 'galatians', name: 'Galatas', abbrev: 'Gl', chapters: 6, testament: 'new' },
  { id: 'ephesians', name: 'Efesios', abbrev: 'Ef', chapters: 6, testament: 'new' },
  { id: 'philippians', name: 'Filipenses', abbrev: 'Fp', chapters: 4, testament: 'new' },
  { id: 'colossians', name: 'Colossenses', abbrev: 'Cl', chapters: 4, testament: 'new' },
  { id: '1thessalonians', name: '1 Tessalonicenses', abbrev: '1Ts', chapters: 5, testament: 'new' },
  { id: '2thessalonians', name: '2 Tessalonicenses', abbrev: '2Ts', chapters: 3, testament: 'new' },
  { id: '1timothy', name: '1 Timoteo', abbrev: '1Tm', chapters: 6, testament: 'new' },
  { id: '2timothy', name: '2 Timoteo', abbrev: '2Tm', chapters: 4, testament: 'new' },
  { id: 'titus', name: 'Tito', abbrev: 'Tt', chapters: 3, testament: 'new' },
  { id: 'philemon', name: 'Filemom', abbrev: 'Fm', chapters: 1, testament: 'new' },
  { id: 'hebrews', name: 'Hebreus', abbrev: 'Hb', chapters: 13, testament: 'new' },
  { id: 'james', name: 'Tiago', abbrev: 'Tg', chapters: 5, testament: 'new' },
  { id: '1peter', name: '1 Pedro', abbrev: '1Pe', chapters: 5, testament: 'new' },
  { id: '2peter', name: '2 Pedro', abbrev: '2Pe', chapters: 3, testament: 'new' },
  { id: '1john', name: '1 Joao', abbrev: '1Jo', chapters: 5, testament: 'new' },
  { id: '2john', name: '2 Joao', abbrev: '2Jo', chapters: 1, testament: 'new' },
  { id: '3john', name: '3 Joao', abbrev: '3Jo', chapters: 1, testament: 'new' },
  { id: 'jude', name: 'Judas', abbrev: 'Jd', chapters: 1, testament: 'new' },
  { id: 'revelation', name: 'Apocalipse', abbrev: 'Ap', chapters: 22, testament: 'new' },
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'old');
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'new');
