/**
 * AzurraERP Lead Capture - Configurações Gerais da Aplicação
 * Banco de Dados: JSON Local (LocalStorage) 100% no Navegador
 */

const DB_CONFIG = {
  storageType: 'JSON Local (Navegador)',
  isConfigured() {
    return true;
  }
};

const CLOUD_CONFIG = DB_CONFIG;

if (typeof window !== 'undefined') {
  window.DB_CONFIG = DB_CONFIG;
  window.CLOUD_CONFIG = CLOUD_CONFIG;
}
