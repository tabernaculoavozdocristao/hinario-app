import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Search, ChevronRight, X } from 'lucide-react';
import { BibleBook, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../types/bible';

interface BibleBooksProps {
  testament: 'old' | 'new';
  onSelectBook: (book: BibleBook) => void;
  onBack: () => void;
}

export function BibleBooks({ testament, onSelectBook, onBack }: BibleBooksProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const books = testament === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;
  const title = testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento';

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.abbrev.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title={title}
        showBack
        onBack={onBack}
      />

      <div className="page-container">
        <div className="mobile-content-spacing animate-fade-in-up">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar livro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredBooks.map((book, index) => (
              <button
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md active:scale-[0.99] group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-brand-amber group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200 shadow-sm">
                    {book.abbrev}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.chapters} {book.chapters === 1 ? 'capitulo' : 'capitulos'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-brand-amber transition-colors" />
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum livro encontrado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
