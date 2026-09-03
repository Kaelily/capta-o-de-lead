/**
 * AzurraERP Lead Capture - Cloud Sync Configuration (Supabase / GitHub)
 *
 * Para conectar ao seu banco na nuvem gratuito com login do GitHub:
 * 1. Crie uma conta gratuita em https://supabase.com usando "Continue with GitHub"
 * 2. Crie um novo projeto
 * 3. Cole sua Project URL e sua Anon Key abaixo (ou configure diretamente pelo botão ☁️ Nuvem no admin.html)
 */

export const CLOUD_CONFIG = {
  // Preencha aqui ou configure no painel admin.html
  supabaseUrl: localStorage.getItem('azurra_supabase_url') || '',
  supabaseAnonKey: localStorage.getItem('azurra_supabase_anon_key') || '',
  
  // Define se a nuvem está ativada
  isConfigured() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },

  // Salvar credenciais no navegador
  save(url, anonKey) {
    this.supabaseUrl = (url || '').trim().replace(/\/$/, '');
    this.supabaseAnonKey = (anonKey || '').trim();
    localStorage.setItem('azurra_supabase_url', this.supabaseUrl);
    localStorage.setItem('azurra_supabase_anon_key', this.supabaseAnonKey);
  },

  // Limpar credenciais
  clear() {
    this.supabaseUrl = '';
    this.supabaseAnonKey = '';
    localStorage.removeItem('azurra_supabase_url');
    localStorage.removeItem('azurra_supabase_anon_key');
  }
};
