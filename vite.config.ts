import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (development, production)
  // O terceiro argumento '' garante que carregamos todas as vars, não apenas as com prefixo VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    base: '/Palacio-da-Memoria/',
    plugins: [react()],
    define: {
      // Isso substitui 'process.env.API_KEY' pelo valor real da string durante o build.
      // Necessário para manter a compatibilidade com a estrutura de código existente.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});