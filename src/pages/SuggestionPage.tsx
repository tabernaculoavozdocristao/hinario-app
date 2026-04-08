import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SuggestionPageProps {
  onBack: () => void;
}

type SuggestionType = 'ausente' | 'correcao';

interface FormData {
  type: SuggestionType;
  name: string;
  email: string;
  hymnNumber: string;
  hymnTitle: string;
  message: string;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function SuggestionPage({ onBack }: SuggestionPageProps) {
  const [formData, setFormData] = useState<FormData>({
    type: 'ausente',
    name: '',
    email: '',
    hymnNumber: '',
    hymnTitle: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.hymnTitle.trim()) {
      newErrors.hymnTitle = 'O título do hino é obrigatório';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'A mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-suggestion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro do servidor:', data);
        setErrorMessage(data.error || 'Falha ao enviar');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch (err) {
      console.error('Erro na requisicao:', err);
      setErrorMessage('Erro de conexao. Verifique sua internet e tente novamente.');
      setStatus('error');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'ausente',
      name: '',
      email: '',
      hymnNumber: '',
      hymnTitle: '',
      message: ''
    });
    setStatus('idle');
    setErrors({});
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Sugestão ou Correção" onBack={onBack} />

        <div className="max-w-2xl mx-auto px-4 py-8 mobile-padding">
          <div className="text-center py-16 bg-surface-light dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">
              Obrigado!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sua mensagem foi enviada com sucesso. Entraremos em contato se necessário.
            </p>
            <button
              onClick={resetForm}
              className="inline-flex items-center px-6 py-3 bg-gradient-wheat text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-150"
            >
              Enviar outra sugestão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation title="Sugestão ou Correção" onBack={onBack} />

      <div className="max-w-2xl mx-auto px-4 py-8 mobile-padding">
        <div className="text-center mb-8 mobile-content-spacing">
          <div className="w-16 h-16 rounded-full bg-gradient-wheat flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
            Sugestão ou Correção de Hino
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ajude-nos a melhorar o hinário enviando sua sugestão ou correção
          </p>
        </div>

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 dark:text-red-300 font-medium">
                {errorMessage || 'Ocorreu um erro ao processar sua solicitacao.'}
              </p>
              <button
                type="button"
                onClick={() => { setStatus('idle'); setErrorMessage(''); }}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de solicitação *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 bg-surface-light dark:bg-slate-700 rounded-xl cursor-pointer border-2 border-transparent hover:border-brand-amber transition-all duration-150">
                <input
                  type="radio"
                  name="type"
                  value="ausente"
                  checked={formData.type === 'ausente'}
                  onChange={() => handleInputChange('type', 'ausente')}
                  className="w-5 h-5 text-brand-amber focus:ring-brand-amber"
                />
                <span className="ml-3 text-gray-900 dark:text-white font-medium">
                  Informar um hino ausente
                </span>
              </label>
              <label className="flex items-center p-4 bg-surface-light dark:bg-slate-700 rounded-xl cursor-pointer border-2 border-transparent hover:border-brand-amber transition-all duration-150">
                <input
                  type="radio"
                  name="type"
                  value="correcao"
                  checked={formData.type === 'correcao'}
                  onChange={() => handleInputChange('type', 'correcao')}
                  className="w-5 h-5 text-brand-amber focus:ring-brand-amber"
                />
                <span className="ml-3 text-gray-900 dark:text-white font-medium">
                  Corrigir um hino existente
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 bg-surface-light dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu e-mail (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-surface-light dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-150"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número do hino (opcional)
              </label>
              <input
                type="text"
                value={formData.hymnNumber}
                onChange={(e) => handleInputChange('hymnNumber', e.target.value)}
                placeholder="Ex: 123"
                className="w-full px-4 py-3 bg-surface-light dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título do hino *
              </label>
              <input
                type="text"
                value={formData.hymnTitle}
                onChange={(e) => handleInputChange('hymnTitle', e.target.value)}
                placeholder="Digite o título do hino"
                className={`w-full px-4 py-3 bg-surface-light dark:bg-slate-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-150 ${
                  errors.hymnTitle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.hymnTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.hymnTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.type === 'ausente' ? 'Detalhes do hino ausente *' : 'Descrição da correção *'}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={formData.type === 'ausente'
                  ? 'Descreva os detalhes do hino que está faltando...'
                  : 'Descreva o erro encontrado e a correção necessária...'}
                rows={5}
                className={`w-full px-4 py-3 bg-surface-light dark:bg-slate-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-150 resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-wheat text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'sending' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span>
              {status === 'sending'
                ? 'Enviando...'
                : formData.type === 'ausente'
                  ? 'Enviar sugestão'
                  : 'Enviar correção'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
