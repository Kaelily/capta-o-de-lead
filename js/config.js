/**
 * AzurraERP Lead Capture - Configurações Gerais da Aplicação
 * Banco de Dados: Híbrido (LocalStorage Offline-First + Supabase Cloud REST API)
 */

const SUPABASE_STORAGE_KEY = 'azurra_supabase_config_v1';

export const SUPABASE_CONFIG = {
  // Obter credenciais salvas no LocalStorage ou padrão
  getConfig() {
    try {
      const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          url: (parsed.url || '').trim(),
          anonKey: (parsed.anonKey || '').trim(),
          autoSync: parsed.autoSync !== false
        };
      }
    } catch (e) {
      console.warn('Erro ao ler configuração do Supabase:', e);
    }
    return {
      url: '',
      anonKey: '',
      autoSync: true
    };
  },

  // Salvar credenciais no navegador
  saveConfig(url, anonKey, autoSync = true) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (anonKey || '').trim();
    const cfg = {
      url: cleanUrl,
      anonKey: cleanKey,
      autoSync: !!autoSync
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
  storageType: 'Híbrido (LocalStorage + Supabase)',
  isConfigured() {
    return true;
  }
};

export const CLOUD_CONFIG = DB_CONFIG;
