/**
 * AzurraERP Lead Capture - Configurações Gerais da Aplicação
 * Banco de Dados Exclusivo: Supabase Cloud Database (PostgREST API)
 */

const SUPABASE_STORAGE_KEY = 'azurra_supabase_config_v1';

// Credenciais oficiais do Supabase (conectam automaticamente todos os computadores e celulares)
export const DEFAULT_SUPABASE_CREDENTIALS = {
  url: 'https://mahvtncujbosvlhjogen.supabase.co',
  anonKey: 'sb_publishable_yibVQ2BfCxv6IoivIJQqGQ_ycWDQAj8'
};

export const SUPABASE_CONFIG = {
  getConfig() {
    try {
      const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const url = (parsed.url || '').trim() || DEFAULT_SUPABASE_CREDENTIALS.url;
        const anonKey = (parsed.anonKey || '').trim() || DEFAULT_SUPABASE_CREDENTIALS.anonKey;
        return { url, anonKey };
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
