/**
 * AzurraERP Lead Capture - Sistema de Banco de Dados JSON Local (LocalStorage)
 * 100% no Navegador (Zero Dependências de Node.js ou SQL Server)
 * Feira FRESQUA 2026
 */

import { DB_CONFIG, SUPABASE_CONFIG } from './config.js';

export const SUPABASE_SCHEMA_SQL = `-- Script SQL para Supabase — AzurraERP Lead Capture (Feira FRESQUA 2026)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT,
    segment TEXT,
    segment_label TEXT,
    revenue TEXT,
    revenue_label TEXT,
    pains JSONB DEFAULT '[]'::jsonb,
    current_system TEXT,
    urgency TEXT,
    score INTEGER DEFAULT 50,
    status TEXT DEFAULT 'warm',
    estimated_monthly_loss TEXT,
    estimated_monthly_hours TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserção de leads" ON public.leads;
CREATE POLICY "Permitir inserção de leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de leads" ON public.leads;
CREATE POLICY "Permitir leitura de leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Permitir atualização de leads" ON public.leads;
CREATE POLICY "Permitir atualização de leads" ON public.leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir deleção de leads" ON public.leads;
CREATE POLICY "Permitir deleção de leads" ON public.leads FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON public.leads (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads (whatsapp);`;

export function leadToSupabaseRow(lead) {
  return {
    id: lead.id,
    timestamp: lead.timestamp || new Date().toISOString(),
    name: lead.name || '',
    company: lead.company || '',
    role: lead.role || '',
    whatsapp: lead.whatsapp || '',
    email: lead.email || '',
    segment: lead.segment || '',
    segment_label: lead.segmentLabel || '',
    revenue: lead.revenue || '',
    revenue_label: lead.revenueLabel || '',
    pains: Array.isArray(lead.pains) ? lead.pains : [],
    current_system: lead.currentSystem || '',
    urgency: lead.urgency || '',
    score: typeof lead.score === 'number' ? lead.score : parseInt(lead.score, 10) || 0,
    status: lead.status || 'warm',
    estimated_monthly_loss: lead.estimatedMonthlyLoss || '',
    estimated_monthly_hours: lead.estimatedMonthlyHours || '',
    notes: lead.notes || ''
  };
}

export function supabaseRowToLead(row) {
  return {
    id: row.id,
    timestamp: row.timestamp,
    name: row.name,
    company: row.company,
    role: row.role,
    whatsapp: row.whatsapp,
    email: row.email,
    segment: row.segment,
    segmentLabel: row.segment_label,
    revenue: row.revenue,
    revenueLabel: row.revenue_label,
    pains: Array.isArray(row.pains) ? row.pains : [],
    currentSystem: row.current_system,
    urgency: row.urgency,
    score: row.score,
    status: row.status,
    estimatedMonthlyLoss: row.estimated_monthly_loss,
    estimatedMonthlyHours: row.estimated_monthly_hours,
    notes: row.notes
  };
}

const STORAGE_KEY = 'azurra_fresqua_leads_v1';
const PAGE_CONFIG_KEY = 'azurra_lead_page_config_v1';
export const COMPANY_WHATSAPP_NUMBER = '551131817744'; // AzurraERP Official WhatsApp (+55 11 3181-7744)

export const DEFAULT_PAGE_CONFIG = {
  brandName: 'AzurraERP',
  brandTag: 'FRESQUA 2026',
  badgeText: '✨ Exclusivo Feira de Empreendedorismo FRESQUA',
  heroTitle: 'Descubra quanto sua empresa está <span>deixando na mesa</span> por falhas de gestão.',
  heroSubtitle: 'Responda 5 perguntas rápidas (60 segundos) e receba seu <strong>Raio-X de Eficiência Operacional</strong> completo, com estimativa de economia e condição especial de feira.',
  heroImage: '',
  btnStartText: 'Iniciar Diagnóstico Gratuito ➔',
  hideStats: false,
  statsEnabled: true,
  stats: [
    { number: '60 seg', label: 'Duração do Diagnóstico' },
    { number: '+40%', label: 'Eficiência Média Ganha' },
    { number: 'Isenção', label: 'De Taxa de Implantação' }
  ],
  faqEnabled: true,
  faqTitle: 'Perguntas Frequentes & Como Funciona',
  faqSubtitle: 'Tire suas dúvidas sobre o diagnóstico de gestão AzurraERP e nossas soluções.',
  faqs: [
    {
      id: 'faq-1',
      question: 'O que é o Diagnóstico de Gestão AzurraERP?',
      answer: 'É uma avaliação rápida de 60 segundos que mapeia os principais gargalos operacionais da sua empresa (estoque, fiscal, DRE, vendas) e estima o quanto você pode economizar por mês.'
    },
    {
      id: 'faq-2',
      question: 'Qual é a condição especial oferecida na feira FRESQUA?',
      answer: 'Durante o evento, visitantes que concluírem o diagnóstico garantem Isenção Total da Taxa de Implantação e consultoria personalizada gratuita no stand.'
    },
    {
      id: 'faq-3',
      question: 'Meus dados estarão seguros?',
      answer: 'Sim! Seus dados são confidenciais e utilizados apenas por nossos especialistas em gestão para apresentar a análise da sua empresa.'
    },
    {
      id: 'faq-4',
      question: 'Preciso instalar algo para usar o AzurraERP?',
      answer: 'Não. O AzurraERP é 100% em nuvem e pode ser acessado de qualquer computador, tablet ou smartphone com internet.'
    }
  ],
  steps: {
    step1: {
      title: 'Qual é o perfil da sua empresa?',
      subtitle: 'Selecione seu segmento e faixa de faturamento.',
      questionSegmentLabel: '1. Qual o segmento de atuação da sua empresa?',
      segments: [
        { value: 'varejo', label: 'Varejo / Loja Física', title: 'Varejo / Loja Física', desc: 'Comércio direto ao consumidor final', icon: '🛍️' },
        { value: 'industria', label: 'Indústria / Manufatura', title: 'Indústria / Fábrica', desc: 'Produção, matérias-primas e lotes', icon: '🏭' },
        { value: 'servicos', label: 'Prestação de Serviços', title: 'Serviços', desc: 'Consultoria, TI, projetos e contratos', icon: '💼' },
        { value: 'distribuicao', label: 'Distribuição / Atacado', title: 'Distribuição / Atacado', desc: 'Vendas B2B, grandes volumes e logística', icon: '🚚' },
        { value: 'ecommerce', label: 'E-commerce / Multi-canal', title: 'E-commerce / Digital', desc: 'Vendas online e marketplaces', icon: '🌐' }
      ],
      questionRevenueLabel: '2. Qual o faturamento bruto mensal aproximado?',
      revenues: [
        { value: 'ate_30k', label: 'Até R$ 30.000/mês', title: 'Até R$ 30.000/mês' },
        { value: '30k_100k', label: 'R$ 30k a R$ 100k/mês', title: 'R$ 30.000 a R$ 100.000' },
        { value: '100k_500k', label: 'R$ 100k a R$ 500k/mês', title: 'R$ 100.000 a R$ 500.000' },
        { value: '500k_plus', label: 'Acima de R$ 500.000/mês', title: 'Acima de R$ 500.000/mês 🌟' }
      ]
    },
    step2: {
      title: 'Quais são os principais gargalos da sua gestão hoje?',
      subtitle: 'Selecione todas as opções que geram dor de cabeça na sua operação (pode marcar mais de uma).',
      instructionLabel: 'Marque os gargalos que mais impactam sua empresa hoje:',
      pains: [
        { value: 'estoque', icon: '📦', title: 'Furo ou Perda de Estoque', desc: 'Falta de controle de estoque físico x sistema, produtos parados ou em falta.' },
        { value: 'fiscal', icon: '📑', title: 'Retrabalho Fiscal & NF-e', desc: 'Demora no faturamento, notas digitadas manualmente ou erros de alíquota.' },
        { value: 'dre', icon: '📉', title: 'Falta de DRE / Lucratividade Real', desc: 'Faturar sem saber exatamente quanto sobra de lucro no final do mês.' },
        { value: 'planilhas', icon: '📊', title: 'Excesso de Planilhas Paralelas', desc: 'Dados dispersos em Excel, informações desencontradas e lentidão.' },
        { value: 'vendas', icon: '🔄', title: 'Vendas Desconectadas', desc: 'Pedidos de venda demoram para virar faturamento e financeiro.' }
      ]
    },
    step3: {
      title: 'Como você controla seu negócio atualmente?',
      subtitle: 'Indique suas ferramentas atuais e o seu momento de decisão.',
      questionCurrentSystemLabel: '1. Como você controla sua gestão hoje?',
      currentSystems: [
        { value: 'excel', label: 'Planilhas Excel / Caderno', title: 'Excel / Bloco de Notas' },
        { value: 'sem_sistema', label: 'Sem sistema definido', title: 'Sem sistema formal' },
        { value: 'concorrente', label: 'Sistema Concorrente (Outro ERP)', title: 'Outro ERP / Sistema Concorrente' },
        { value: 'sistema_antigo', label: 'Sistema antigo/lento', title: 'Sistema antigo que não atende' }
      ],
      questionUrgencyLabel: '2. Em quanto tempo pretende implementar uma solução?',
      urgencies: [
        { value: 'imediato', label: 'Imediato (Este Mês)', title: '🔥 Imediato (Neste mês)' },
        { value: '30_dias', label: 'Em até 30 a 60 dias', title: '⚡ Em 30 a 60 dias' },
        { value: 'pesquisando', label: 'Apenas pesquisando', title: '🌱 Apenas pesquisando' }
      ]
    },
    step4: {
      title: 'Quase pronto! Onde enviamos seu Raio-X?',
      subtitle: 'Preencha seus dados de contato para gerar o relatório personalizado.',
      nameLabel: 'Seu Nome Completo *',
      namePlaceholder: 'Ex: Roberto Silva',
      whatsappLabel: 'WhatsApp com DDD *',
      whatsappPlaceholder: '(11) 99999-9999',
      companyLabel: 'Nome da Sua Empresa *',
      companyPlaceholder: 'Ex: Silva Comercial',
      roleLabel: 'Seu Cargo na Empresa',
      rolePlaceholder: 'Ex: Sócio, Diretor, Gerente',
      emailLabel: 'E-mail Corporativo',
      emailPlaceholder: 'seuemail@empresa.com.br',
      notesLabel: 'Observações / Informações Adicionais',
      notesPlaceholder: 'Ex: Conte um pouco mais sobre sua necessidade, dúvidas ou detalhes de interesse...'
    }
  },
  resultScreen: {
    offerDesc: 'Nossos consultores no Stand AzurraERP estão prontos para te apresentar a plataforma em funcionamento.',
    btnWhatsappText: '💬 Receber Relatório no WhatsApp & Agendar no Stand'
  }
};

const sampleLeads = [
  {
    id: 'lead-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    name: 'Carlos Alberto Mendonça',
    company: 'Mendonça Distribuidora de Alimentos',
    role: 'Sócio-Proprietário',
    whatsapp: '5511987654321',
    email: 'carlos@mendoncadistribuidora.com.br',
    segment: 'distribuicao',
    segmentLabel: 'Distribuição / Atacado',
    revenue: '500k_plus',
    revenueLabel: 'Acima de R$ 500.000/mês',
    pains: ['estoque', 'fiscal', 'dre', 'vendas'],
    currentSystem: 'concorrente',
    urgency: 'imediato',
    score: 88,
    status: 'hot',
    estimatedMonthlyLoss: 'R$ 18.500',
    estimatedMonthlyHours: '64 hrs',
    notes: 'Precisa de migração rápida para o próximo mês.'
  },
  {
    id: 'lead-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    name: 'Mariana Vasconcelos',
    company: 'MVR Confecções & Moda',
    role: 'Diretora Operacional',
    whatsapp: '5521998877665',
    email: 'mariana@mvrconfec.com.br',
    segment: 'industria',
    segmentLabel: 'Indústria / Manufatura',
    revenue: '100k_500k',
    revenueLabel: 'R$ 100.000 a R$ 500.000/mês',
    pains: ['estoque', 'planilhas', 'fiscal'],
    currentSystem: 'excel',
    urgency: '30_dias',
    score: 76,
    status: 'hot',
    estimatedMonthlyLoss: 'R$ 12.200',
    estimatedMonthlyHours: '48 hrs',
    notes: 'Interesse especial no módulo de emissão de NF-e rápida.'
  },
  {
    id: 'lead-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    name: 'Fernando Rocha',
    company: 'TechServices Soluções',
    role: 'Fundador / CEO',
    whatsapp: '5531976543210',
    email: 'fernando@techservices.com.br',
    segment: 'servicos',
    segmentLabel: 'Prestação de Serviços',
    revenue: '30k_100k',
    revenueLabel: 'R$ 30.000 a R$ 100.000/mês',
    pains: ['dre', 'planilhas'],
    currentSystem: 'sem_sistema',
    urgency: 'imediato',
    score: 82,
    status: 'warm',
    estimatedMonthlyLoss: 'R$ 6.800',
    estimatedMonthlyHours: '28 hrs',
    notes: 'Quer ver uma demonstração presencial no stand.'
  }
];

export const StorageManager = {
  // Retorna todos os leads salvos no banco JSON local (LocalStorage)
  getLeads() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveLeads(sampleLeads);
      return sampleLeads;
    }
    try {
      let parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return sampleLeads;

      // Remover automaticamente o lead de teste "Lula da silva" se estiver no cache local
      const hasLula = parsed.some(l => l.name && l.name.toLowerCase().includes('lula'));
      if (hasLula) {
        parsed = parsed.filter(l => !l.name || !l.name.toLowerCase().includes('lula'));
        this.saveLeads(parsed);
      }

      return parsed;
    } catch (e) {
      console.error('Erro ao ler banco de dados JSON local:', e);
      return sampleLeads;
    }
  },

  // Salvar array de leads no LocalStorage e disparar evento de sincronização em tempo real
  saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new Event('storage'));
  },

  // Adicionar novo lead (Salva localmente no banco JSON do navegador e envia para Supabase se configurado)
  addLead(leadData) {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== leadData.id);
    filtered.unshift(leadData);
    this.saveLeads(filtered);

    // Envio assíncrono para o Supabase (se configurado) sem travar a interface
    if (SUPABASE_CONFIG.isConfigured()) {
      this.sendLeadToSupabase(leadData).catch(err => {
        console.warn('Tentativa de sincronização em segundo plano:', err);
      });
    }

    return leadData;
  },

  // Apagar um lead do banco JSON local e do Supabase se configurado
  deleteLead(leadId) {
    const leads = this.getLeads().filter(l => l.id !== leadId);
    this.saveLeads(leads);

    if (SUPABASE_CONFIG.isConfigured()) {
      this.deleteLeadFromSupabase(leadId).catch(err => {
        console.warn('Erro ao deletar lead remoto no Supabase:', err);
      });
    }

    return { success: true };
  },

  // Testar conexão com o projeto Supabase usando a chave anon
  async testSupabaseConnection(customUrl, customKey) {
    const url = (customUrl || SUPABASE_CONFIG.getUrl() || '').trim().replace(/\/+$/, '');
    const key = (customKey || SUPABASE_CONFIG.getAnonKey() || '').trim();

    if (!url || !key) {
      return { success: false, error: 'URL e Anon Key do Supabase são obrigatórias.' };
    }

    try {
      const response = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (!response.ok) {
        let errText = await response.text().catch(() => '');
        return {
          success: false,
          error: `Erro HTTP ${response.status}: ${errText || response.statusText}. Verifique se executou o script SQL supabase-schema.sql no seu Supabase.`
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Conexão com Supabase validada com sucesso!',
        count: Array.isArray(data) ? data.length : 0
      };
    } catch (err) {
      return { success: false, error: `Falha na conexão de rede: ${err.message}` };
    }
  },

  // Enviar lead individual para o Supabase via REST API
  async sendLeadToSupabase(leadData) {
    if (!SUPABASE_CONFIG.isConfigured()) {
      return { skipped: true, reason: 'Supabase não configurado' };
    }

    const url = SUPABASE_CONFIG.getUrl();
    const key = SUPABASE_CONFIG.getAnonKey();
    const row = leadToSupabaseRow(leadData);

    try {
      const response = await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(row)
      });

      if (!response.ok) {
        const errDetail = await response.text().catch(() => '');
        console.warn('Erro ao enviar lead para Supabase:', response.status, errDetail);
        return { success: false, error: `HTTP ${response.status}: ${errDetail}` };
      }

      console.log(`✅ Lead "${leadData.name}" (${leadData.id}) sincronizado com Supabase!`);
      return { success: true };
    } catch (err) {
      console.warn('Falha de rede ao sincronizar lead com Supabase (mantido offline no navegador):', err);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Deletar lead remoto no Supabase
  async deleteLeadFromSupabase(leadId) {
    if (!SUPABASE_CONFIG.isConfigured()) return { skipped: true };
    const url = SUPABASE_CONFIG.getUrl();
    const key = SUPABASE_CONFIG.getAnonKey();

    try {
      const response = await fetch(`${url}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      return { success: response.ok };
    } catch (err) {
      console.warn('Erro ao deletar lead no Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  // Buscar todos os leads gravados no Supabase
  async fetchLeadsFromSupabase() {
    if (!SUPABASE_CONFIG.isConfigured()) return null;
    const url = SUPABASE_CONFIG.getUrl();
    const key = SUPABASE_CONFIG.getAnonKey();

    try {
      const response = await fetch(`${url}/rest/v1/leads?select=*&order=timestamp.desc`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rows = await response.json();
      if (!Array.isArray(rows)) return [];
      return rows.map(supabaseRowToLead);
    } catch (err) {
      console.error('Erro ao buscar leads do Supabase:', err);
      throw err;
    }
  },

  // Sincronizar todos os dados bidirecionalmente (Upsert local para nuvem + Download de remotos)
  async syncWithSupabase() {
    if (!SUPABASE_CONFIG.isConfigured()) {
      return { success: false, error: 'Supabase não está configurado nas preferências.' };
    }

    const localLeads = this.getLeads();
    const url = SUPABASE_CONFIG.getUrl();
    const key = SUPABASE_CONFIG.getAnonKey();

    // 1. Enviar lote de leads locais para o Supabase
    let uploadedCount = 0;
    if (localLeads.length > 0) {
      try {
        const rows = localLeads.map(leadToSupabaseRow);
        const response = await fetch(`${url}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(rows)
        });

        if (response.ok) {
          uploadedCount = rows.length;
        } else {
          const errDetail = await response.text().catch(() => '');
          console.warn('Aviso ao sincronizar lote local com Supabase:', errDetail);
        }
      } catch (err) {
        console.warn('Erro de rede ao enviar lote para Supabase:', err);
      }
    }

    // 2. Baixar leads da nuvem
    let remoteLeads = [];
    try {
      remoteLeads = await this.fetchLeadsFromSupabase();
    } catch (err) {
      return { success: false, error: `Falha ao conectar com Supabase: ${err.message}`, uploaded: uploadedCount };
    }

    // 3. Mesclar dados locais e remotos
    const map = new Map();
    (remoteLeads || []).forEach(l => map.set(l.id, l));
    localLeads.forEach(l => {
      if (!map.has(l.id)) {
        map.set(l.id, l);
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );

    this.saveLeads(merged);
    return {
      success: true,
      total: merged.length,
      uploaded: uploadedCount,
      downloaded: remoteLeads ? remoteLeads.length : 0
    };
  },

  // Limpar todos os leads do banco JSON
  clearAllLeads() {
    this.saveLeads([]);
  },

  // Restaurar leads de demonstração
  resetSampleLeads() {
    this.saveLeads(sampleLeads);
    return sampleLeads;
  },

  // Exportar / Baixar arquivo JSON completo (leads.json)
  exportToJSON() {
    try {
      const leads = this.getLeads();
      const dataStr = JSON.stringify(leads, null, 2);
      const filename = `leads_azurraerp_${new Date().toISOString().slice(0, 10)}.json`;

      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 2500);
    } catch (err) {
      console.warn('Download via Blob falhou, tentando fallback Data URI:', err);
      const leads = this.getLeads();
      const encodedUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
      const fallbackLink = document.createElement('a');
      fallbackLink.href = encodedUri;
      fallbackLink.setAttribute('download', 'leads_azurraerp.json');
      fallbackLink.download = 'leads_azurraerp.json';
      fallbackLink.style.display = 'none';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => {
        if (fallbackLink.parentNode) fallbackLink.parentNode.removeChild(fallbackLink);
      }, 2500);
    }
  },

  // Importar arquivo JSON externo (leads.json) para o banco do navegador
  async importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedLeads = JSON.parse(e.target.result);
          if (!Array.isArray(importedLeads)) {
            return reject(new Error('O arquivo selecionado não contém uma lista válida de leads.'));
          }

          // Mesclar com os leads existentes pelo ID
          const currentLeads = this.getLeads();
          const map = new Map();
          currentLeads.forEach(l => map.set(l.id, l));
          importedLeads.forEach(l => {
            if (l && l.id) map.set(l.id, l);
          });

          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
          );

          this.saveLeads(merged);
          resolve({ success: true, count: merged.length, added: importedLeads.length });
        } catch (err) {
          reject(new Error('Formato JSON inválido: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo selecionado.'));
      reader.readAsText(file);
    });
  },

  // Exportar leads em planilha estruturada compatível nativamente com Microsoft Excel (.xls)
  exportToExcel() {
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return alert('Nenhum lead encontrado para exportar.');

    const filename = `leads_azurraerp_${new Date().toISOString().slice(0, 10)}.xls`;

    const painMap = {
      estoque: 'Controle de Estoque / Perdas',
      fiscal: 'Emissão Fiscal / Notas',
      dre: 'DRE / Gestão Financeira',
      planilhas: 'Excesso de Planilhas',
      vendas: 'Lentidão em Vendas'
    };

    const sysMap = {
      sem_sistema: 'Sem Sistema (Controle no Papel)',
      excel: 'Planilhas Excel',
      concorrente: 'Outro ERP',
      proprio: 'Sistema Próprio'
    };

    let rowsHtml = '';
    leads.forEach(l => {
      const dateStr = l.timestamp ? new Date(l.timestamp).toLocaleString('pt-BR') : '';
      const pains = Array.isArray(l.pains) ? l.pains.map(p => painMap[p] || p).join(', ') : (l.pains || '');
      const system = sysMap[l.currentSystem] || l.currentSystem || '';
      const status = (l.status || 'COLD').toUpperCase();
      const statusBg = status.includes('HOT') ? '#ffe4e6' : status.includes('WARM') ? '#fef3c7' : '#d1fae5';
      const statusColor = status.includes('HOT') ? '#b91c1c' : status.includes('WARM') ? '#b45309' : '#047857';

      rowsHtml += `
        <tr>
          <td>${l.id || ''}</td>
          <td>${dateStr}</td>
          <td><b>${l.name || ''}</b></td>
          <td><b>${l.company || ''}</b></td>
          <td>${l.role || ''}</td>
          <td style="mso-number-format:'\\@';">${l.whatsapp || ''}</td>
          <td>${l.email || ''}</td>
          <td>${l.segmentLabel || l.segment || ''}</td>
          <td>${l.revenueLabel || l.revenue || ''}</td>
          <td>${pains}</td>
          <td>${system}</td>
          <td>${l.urgency || ''}</td>
          <td style="text-align:center; font-weight:bold;">${l.score != null ? l.score + '%' : ''}</td>
          <td style="background-color:${statusBg}; color:${statusColor}; font-weight:bold; text-align:center;">${status}</td>
          <td style="color:#dc2626; font-weight:bold;">${l.estimatedMonthlyLoss || ''}</td>
          <td>${l.estimatedMonthlyHours || ''}</td>
          <td>${(l.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
        </tr>
      `;
    });

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #0b132b; color: #00f2fe; font-size: 11pt; font-weight: bold; border: 1px solid #999; padding: 8px 12px; text-align: left; }
          td { border: 1px solid #ccc; padding: 6px 10px; font-size: 10pt; vertical-align: middle; }
        </style>
      </head>
      <body>
        <h2 style="color: #0b132b;">Relatório Comercial de Leads — Stand AzurraERP (Feira FRESQUA)</h2>
        <p><b>Total de Leads:</b> ${leads.length} | <b>Data de Extração:</b> ${new Date().toLocaleString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Nome Completo</th>
              <th>Empresa</th>
              <th>Cargo</th>
              <th>WhatsApp</th>
              <th>E-mail</th>
              <th>Segmento</th>
              <th>Faturamento Mensal</th>
              <th>Dores / Gargalos</th>
              <th>Sistema Atual</th>
              <th>Urgência</th>
              <th>Score de Eficiência</th>
              <th>Temperatura / Status</th>
              <th>Perda Financeira Estimada</th>
              <th>Horas Desperdiçadas</th>
              <th>Observações do Cliente</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    try {
      const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 2500);
    } catch (e) {
      console.warn('Erro ao gerar blob Excel, usando fallback Data URI:', e);
      const encodedUri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelHtml);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = encodedUri;
      fallbackLink.setAttribute('download', filename);
      fallbackLink.download = filename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => {
        if (fallbackLink.parentNode) fallbackLink.parentNode.removeChild(fallbackLink);
      }, 2500);
    }
  },

  // Exportar leads para arquivo CSV compatível com Excel e Google Sheets
  exportToCSV() {
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return alert('Nenhum lead para exportar.');

    const headers = [
      'ID', 'Data/Hora', 'Nome', 'Empresa', 'Cargo', 'WhatsApp', 'Email',
      'Segmento', 'Faturamento', 'Sistema Atual', 'Urgencia', 'Score',
      'Status Temperatura', 'Perda Mensal Estimada', 'Tempo Desperdiçado', 'Observacoes'
    ];

    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString('pt-BR')}"`,
      `"${l.name || ''}"`,
      `"${l.company || ''}"`,
      `"${l.role || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.email || ''}"`,
      `"${l.segmentLabel || l.segment || ''}"`,
      `"${l.revenueLabel || l.revenue || ''}"`,
      `"${l.currentSystem || ''}"`,
      `"${l.urgency || ''}"`,
      `"${l.score}"`,
      `"${(l.status || '').toUpperCase()}"`,
      `"${l.estimatedMonthlyLoss || ''}"`,
      `"${l.estimatedMonthlyHours || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_azurraerp_fresqua_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Gerar link de WhatsApp para o CLIENTE falar com a empresa AzurraERP (+55 11 3181-7744)
  getCompanyWhatsAppLink(lead) {
    const phone = COMPANY_WHATSAPP_NUMBER;
    const name = lead.name || 'Empreendedor';
    const company = lead.company || 'Minha Empresa';
    const score = lead.score || 0;
    const loss = lead.estimatedMonthlyLoss || 'R$ 0';

    const message = [
      `Ola equipe AzurraERP!`,
      `Acabei de fazer meu Diagnostico de Gestao Empresarial na Feira FRESQUA.`,
      ``,
      `*Nome:* ${name}`,
      `*Empresa:* ${company}`,
      `*Score de Gestao:* ${score}%`,
      `*Perda Estimada:* ${loss}/mes`,
      ``,
      `Gostaria de agendar uma conversa de 10 a 15 minutos!`
    ].join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  },

  // Gerar link de WhatsApp para a EQUIPE DO STAND chamar o lead
  getLeadWhatsAppLink(lead) {
    const cleanPhone = (lead.whatsapp || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const name = lead.name || 'Empreendedor';
    const company = lead.company || 'sua empresa';

    const message = [
      `Ola ${name}, tudo bem? Sou da equipe da AzurraERP aqui no Stand da FRESQUA!`,
      ``,
      `Vi que voce acabou de realizar seu Diagnostico de Gestao Empresarial para a empresa ${company}.`,
      ``,
      `Seu resultado indicou um excelente potencial de otimizacao! Temos uma condicao especial de feira com isencao da taxa de implantacao pronta para voce.`,
      ``,
      `Vamos marcar uma conversa rapida de 10 a 15 minutos para entender a sua dor com maior profundidade?`
    ].join('\n');

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  },

  // Obter configurações personalizadas da tela de captura
  getPageConfig() {
    const raw = localStorage.getItem(PAGE_CONFIG_KEY);
    if (!raw) return DEFAULT_PAGE_CONFIG;
    try {
      const parsed = JSON.parse(raw);
      const defaultSteps = DEFAULT_PAGE_CONFIG.steps;
      const parsedSteps = parsed.steps || {};

      const fixArray = (parsedArr, defaultArr) => {
        return (Array.isArray(parsedArr) && parsedArr.length > 0) ? parsedArr : defaultArr;
      };

      const mergedSteps = {
        step1: {
          ...defaultSteps.step1,
          ...(parsedSteps.step1 || {}),
          segments: fixArray(parsedSteps.step1?.segments, defaultSteps.step1.segments),
          revenues: fixArray(parsedSteps.step1?.revenues, defaultSteps.step1.revenues)
        },
        step2: {
          ...defaultSteps.step2,
          ...(parsedSteps.step2 || {}),
          pains: fixArray(parsedSteps.step2?.pains, defaultSteps.step2.pains)
        },
        step3: {
          ...defaultSteps.step3,
          ...(parsedSteps.step3 || {}),
          currentSystems: fixArray(parsedSteps.step3?.currentSystems, defaultSteps.step3.currentSystems),
          urgencies: fixArray(parsedSteps.step3?.urgencies, defaultSteps.step3.urgencies)
        },
        step4: {
          ...defaultSteps.step4,
          ...(parsedSteps.step4 || {})
        }
      };

      const defaultResult = DEFAULT_PAGE_CONFIG.resultScreen || {};
      const parsedResult = parsed.resultScreen || {};
      const mergedResult = {
        ...defaultResult,
        ...parsedResult
      };

      return {
        ...DEFAULT_PAGE_CONFIG,
        ...parsed,
        steps: mergedSteps,
        resultScreen: mergedResult
      };
    } catch (e) {
      console.error('Erro ao ler configurações da página:', e);
      return DEFAULT_PAGE_CONFIG;
    }
  },

  // Salvar configurações personalizadas da tela de captura
  savePageConfig(config) {
    localStorage.setItem(PAGE_CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));
  },

  // Restaurar padrões de fábrica da tela de captura
  resetPageConfig() {
    localStorage.removeItem(PAGE_CONFIG_KEY);
    window.dispatchEvent(new Event('storage'));
    return DEFAULT_PAGE_CONFIG;
  }
};
