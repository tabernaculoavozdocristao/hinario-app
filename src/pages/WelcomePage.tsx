import React from 'react';
import { Navigation } from '../components/Navigation';
import { ExternalLink, Youtube, Instagram, BookOpen, Heart, Star, Book } from 'lucide-react';

interface WelcomePageProps {
  onEnterApp: () => void;
  onEnterBible: () => void;
}

export function WelcomePage({ onEnterApp, onEnterBible }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation title="Bem-vindos" />

      <div className="page-container">
        <div className="mobile-content-spacing animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="mb-6 animate-scale-in">
              <img
                src="/logo-png.png"
                alt="Logo Tabernáculo A Voz do Cristão"
                className="h-28 w-28 sm:h-36 sm:w-36 object-contain mx-auto drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-serif mb-3 leading-tight">
              Tabernáculo A Voz do Cristão
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Acesse nossos hinários e conecte-se conosco
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12">
            <button
              onClick={onEnterApp}
              className="w-full max-w-sm inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-wheat text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-lg"
              aria-label="Entrar no aplicativo de hinários"
            >
              <BookOpen className="h-6 w-6" aria-hidden="true" />
              Entrar no Hinário
            </button>
            <button
              onClick={onEnterBible}
              className="w-full max-w-sm inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-wheat text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-lg"
              aria-label="Entrar na Bíblia"
            >
              <Book className="h-6 w-6" aria-hidden="true" />
              Entrar na Bíblia
            </button>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-6 text-center">
              Conecte-se Conosco
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://branham.org/pt/MessageAudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group"
                aria-label="Acessar mensagens de William Marrion Branham"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200">
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Mensagens W.M.B
                </span>
              </a>

              <a
                href="https://www.youtube.com/c/Tabern%C3%A1culoAVozdoCrist%C3%A3o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group"
                aria-label="Se inscrever no canal do YouTube"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200">
                  <Youtube className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Se inscreva no nosso Canal
                </span>
              </a>

              <a
                href="https://www.instagram.com/avozdocristao/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group"
                aria-label="Seguir no Instagram"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200">
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Siga-nos no Instagram
                </span>
              </a>

              <a
                href="https://www.google.com/search?sca_esv=069bfcf63421705d&rlz=1C1ONGR_enBR1152BR1152&sxsrf=ANbL-n4d93q4EN9hiqcLozokM1vHCp1SSA:1773865199128&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOfz0_9C2ccHC_dx60iymENb9tBKNyF7OOHgCKWcab--NnfT8eHeK7sCGCDKm0D3ZNWjeqTibQMAYqCYIoDKW8T7EY3A8lXYtcwAjWvNfsE1O8jT_-1uA1X9QS7q_Od-yY5NOfPg%3D&q=Tabern%C3%A1culo+A+Voz+do+Crist%C3%A3o+Coment%C3%A1rios&sa=X&ved=2ahUKEwjl-MrooqqTAxWHPrkGHUFUK4gQ0bkNegQIIBAF&biw=2133&bih=1050&dpr=0.9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group"
                aria-label="Avalie nossa Igreja no Google"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200">
                  <Star className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Avalie nossa Igreja no Google
                </span>
              </a>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-wheat flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Heart className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-2">
                  Ofertas e Apoio
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nos ajude em oferta para os nossos próximos desenvolvimentos.
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
                  <img
                    src="/tamanho-correto-pix.png"
                    alt="QR-Code do PIX para ofertas"
                    className="w-full rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Escaneie Aqui!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-slate-700 rounded-lg py-2 px-4">
                    Pix CNPJ: 36.487.135/0001-70
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
