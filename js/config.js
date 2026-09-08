/**
 * AzurraERP Lead Capture - Configurações Gerais da Aplicação
 * Banco de Dados Exclusivo: Supabase Cloud Database (PostgREST API)
 */

const SUPABASE_STORAGE_KEY = 'azurra_supabase_config_v1';

// Credenciais do Supabase (podem ser preenchidas aqui ou no painel admin)
export const DEFAULT_SUPABASE_CREDENTIALS = {
  url: '',
  anonKey: ''
};

export const SUPABASE_CONFIG = {
  getConfig() {
    try {
      const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          url: (parsed.url || DEFAULT_SUPABASE_CREDENTIALS.url || '').trim(),
          anonKey: (parsed.anonKey || DEFAULT_SUPABASE_CREDENTIALS.anonKey || '').trim()
        };
      }
    } catch (e) {
      console.warn('Erro ao ler configuração do Supabase:', e);
    }
    return {
      url: DEFAULT_SUPABASE_CREDENTIALS.url,
      anonKey: DEFAULT_SUPABASE_CREDENTIALS.anonKey
    };
  },

  saveConfig(url, anonKey) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (anonKey || '').trim();
    const cfg = {
      url: cleanUrl,
      anonKey: cleanKey
    };
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(cfg));
    window.dispatchEvent(new CustomEvent('supabase_config_updated', { detail: cfg }));
    return cfg;
  },

  getUrl() {
    return this.getConfig().url;
  },

  getAnonKey() {
    return this.getConfig().anonKey;
  },

  isConfigured() {
    const cfg = this.getConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('https://'));
  }
};

export const DB_CONFIG = {
  storageType: 'Supabase Cloud Database',
  isConfigured() {
    return SUPABASE_CONFIG.isConfigured();
  }
};

export const CLOUD_CONFIG = DB_CONFIG;
