/**
 * AzurraERP Lead Capture - Database & API Configuration (Microsoft SQL Server)
 */

export const DB_CONFIG = {
  // URL base da API conectada ao Microsoft SQL Server
  apiUrl: localStorage.getItem('azurra_sqlserver_api_url') || (window.location.origin.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api'),
  
  // Define se a API está configurada
  isConfigured() {
    return Boolean(this.apiUrl && this.apiUrl.trim().length > 0);
  },

  // Salvar URL customizada da API (ex: IP do servidor na feira: http://192.168.1.50:3000/api)
  save(url) {
    this.apiUrl = (url || '').trim().replace(/\/$/, '');
    if (!this.apiUrl.endsWith('/api') && !this.apiUrl.includes('/api/')) {
      this.apiUrl = `${this.apiUrl}/api`;
    }
    localStorage.setItem('azurra_sqlserver_api_url', this.apiUrl);
  },

  // Limpar e restaurar para padrão
  clear() {
    localStorage.removeItem('azurra_sqlserver_api_url');
    this.apiUrl = window.location.origin.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api';
  }
};

// Aliases para compatibilidade retroativa caso algum módulo antigo importe CLOUD_CONFIG
export const CLOUD_CONFIG = DB_CONFIG;
