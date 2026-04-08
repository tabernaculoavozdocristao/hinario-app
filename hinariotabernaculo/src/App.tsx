import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { WelcomePage } from './pages/WelcomePage';
import { HomeHinarios } from './pages/HomeHinarios';
import { HinosList } from './pages/HinosList';
import { HinoView } from './pages/HinoView';
import { FavoritesPage } from './pages/FavoritesPage';
import { SuggestionPage } from './pages/SuggestionPage';
import { BibleHome } from './pages/BibleHome';
import { BibleBooks } from './pages/BibleBooks';
import { BibleChapters } from './pages/BibleChapters';
import { BibleReading } from './pages/BibleReading';
import { BibleSearch } from './pages/BibleSearch';
import { BibleBook } from './types/bible';

type Route =
  | { type: 'welcome' }
  | { type: 'home' }
  | { type: 'favorites' }
  | { type: 'suggestion' }
  | { type: 'list'; slug: string; hinarioNome?: string }
  | { type: 'view'; slug: string; numero: number }
  | { type: 'bible-home' }
  | { type: 'bible-books'; testament: 'old' | 'new' }
  | { type: 'bible-chapters'; book: BibleBook }
  | { type: 'bible-reading'; book: BibleBook; chapter: number }
  | { type: 'bible-search' };

function AppContent() {
  const [route, setRoute] = useState<Route>({ type: 'welcome' });

  const navigateToWelcome = () => {
    setRoute({ type: 'welcome' });
  };

  const navigateToHome = () => {
    setRoute({ type: 'home' });
  };

  const navigateToFavorites = () => {
    setRoute({ type: 'favorites' });
  };

  const navigateToSuggestion = () => {
    setRoute({ type: 'suggestion' });
  };

  const navigateToBibleHome = () => {
    setRoute({ type: 'bible-home' });
  };

  const navigateToBibleBooks = (testament: 'old' | 'new') => {
    setRoute({ type: 'bible-books', testament });
  };

  const navigateToBibleChapters = (book: BibleBook) => {
    setRoute({ type: 'bible-chapters', book });
  };

  const navigateToBibleReading = (book: BibleBook, chapter: number) => {
    setRoute({ type: 'bible-reading', book, chapter });
  };

  const navigateToBibleSearch = () => {
    setRoute({ type: 'bible-search' });
  };

  const navigateToList = (slug: string, hinarioNome?: string) => {
    setRoute({ type: 'list', slug, hinarioNome });
  };

  const navigateToView = (slug: string, numero: number) => {
    setRoute({ type: 'view', slug, numero });
  };

  const navigateBack = () => {
    if (route.type === 'view') {
      setRoute({ type: 'list', slug: route.slug });
    } else if (route.type === 'favorites') {
      setRoute({ type: 'home' });
    } else if (route.type === 'suggestion') {
      setRoute({ type: 'home' });
    } else if (route.type === 'list') {
      setRoute({ type: 'home' });
    } else if (route.type === 'home') {
      setRoute({ type: 'welcome' });
    } else if (route.type === 'bible-home') {
      setRoute({ type: 'welcome' });
    } else if (route.type === 'bible-books') {
      setRoute({ type: 'bible-home' });
    } else if (route.type === 'bible-chapters') {
      setRoute({ type: 'bible-books', testament: route.book.testament });
    } else if (route.type === 'bible-reading') {
      setRoute({ type: 'bible-chapters', book: route.book });
    } else if (route.type === 'bible-search') {
      setRoute({ type: 'bible-home' });
    }
  };

  if (route.type === 'welcome') {
    return <WelcomePage onEnterApp={navigateToHome} onEnterBible={navigateToBibleHome} />;
  }

  if (route.type === 'home') {
    return <HomeHinarios onSelectHinario={navigateToList} onSelectHino={navigateToView} onBack={navigateToWelcome} onFavorites={navigateToFavorites} onSuggestion={navigateToSuggestion} />;
  }

  if (route.type === 'favorites') {
    return <FavoritesPage onSelectHino={navigateToView} onBack={navigateBack} />;
  }

  if (route.type === 'suggestion') {
    return <SuggestionPage onBack={navigateBack} />;
  }

  if (route.type === 'list') {
    return (
      <HinosList
        slug={route.slug}
        hinarioNome={route.hinarioNome}
        onSelectHino={navigateToView}
        onBack={navigateBack}
      />
    );
  }

  if (route.type === 'view') {
    return (
      <HinoView
        slug={route.slug}
        numero={route.numero}
        onBack={navigateBack}
        onHome={navigateToHome}
      />
    );
  }

  if (route.type === 'bible-home') {
    return (
      <BibleHome
        onSelectTestament={navigateToBibleBooks}
        onSearch={navigateToBibleSearch}
        onBack={navigateBack}
      />
    );
  }

  if (route.type === 'bible-books') {
    return (
      <BibleBooks
        testament={route.testament}
        onSelectBook={navigateToBibleChapters}
        onBack={navigateBack}
      />
    );
  }

  if (route.type === 'bible-chapters') {
    return (
      <BibleChapters
        book={route.book}
        onSelectChapter={(chapter) => navigateToBibleReading(route.book, chapter)}
        onBack={navigateBack}
      />
    );
  }

  if (route.type === 'bible-reading') {
    return (
      <BibleReading
        book={route.book}
        chapter={route.chapter}
        onChangeChapter={(chapter) => navigateToBibleReading(route.book, chapter)}
        onBack={navigateBack}
      />
    );
  }

  if (route.type === 'bible-search') {
    return (
      <BibleSearch
        onSelectResult={(book, chapter) => navigateToBibleReading(book, chapter)}
        onBack={navigateBack}
      />
    );
  }

  return null;
}

function App() {
  useTheme();

  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
}

export default App;