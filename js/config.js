/**
 * AzurraERP Lead Capture - Cloud Sync Configuration (Supabase / GitHub)
 */

export const CLOUD_CONFIG = {
  // Credenciais ativas da nuvem
  supabaseUrl: 'https://kldxagdmgiguwezaatie.supabase.co',
  supabaseAnonKey: 'sb_publishable_S49HGhIbfpVw4wOftXNjvQ_ZMW9UopU',
  
  // Define se a nuvem está ativada
  isConfigured() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },

  // Salvar credenciais alternativas no navegador caso queira trocar
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
