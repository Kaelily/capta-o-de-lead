/**
 * AzurraERP Lead Capture - Configurações Gerais da Aplicação
 * Banco de Dados: JSON Local (LocalStorage) 100% no Navegador
 */

export const DB_CONFIG = {
  storageType: 'JSON Local (Navegador)',
  isConfigured() {
    return true;
  }
};

export const CLOUD_CONFIG = DB_CONFIG;
