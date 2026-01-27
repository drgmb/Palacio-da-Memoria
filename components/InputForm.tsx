import React, { useState } from 'react';
import { PalaceGenerationRequest, GenerationStatus } from '../types';

interface InputFormProps {
  onSubmit: (data: PalaceGenerationRequest) => void;
  status: GenerationStatus;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, status }) => {
  const [theme, setTheme] = useState('');
  const [content, setContent] = useState('');
  const [visualStyle, setVisualStyle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme && content && visualStyle) {
      onSubmit({ theme, content, visualStyle });
    }
  };

  const isLoading = status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETED && status !== GenerationStatus.ERROR;

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-purple-300 brand-font">Blueprint Your Palace</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tema (Subject)</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Ciclo de Krebs, Revolução Francesa, Verbos Irregulares..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo Técnico (Technical Content)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole aqui o texto, lista ou anotações que você precisa memorizar..."
            rows={5}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Estilo Visual (Visual Style)</label>
          <input
            type="text"
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            placeholder="Ex: Cyberpunk, Pintura a óleo renascentista, Cartoon, Gótico..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !theme || !content || !visualStyle}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Building Palace...
            </span>
          ) : (
            'Generate Palace'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
