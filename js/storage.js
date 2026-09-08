/**
 * AzurraERP Lead Capture - LocalStorage & Microsoft SQL Server Sync System
 * Feira FRESQUA 2026
 */

import { DB_CONFIG } from './config.js';

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
    estimatedMonthlyHours: '64 hrs'
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
    estimatedMonthlyHours: '48 hrs'
  },
  {
    id: 'lead-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    name: 'Fernando Rocha',
    company: 'TechServices Soluções',
    role: 'Fundador / CEO',
    whatsapp: '5531976543210',
    email: 'fernando@techservices.com',
    segment: 'servicos',
    segmentLabel: 'Serviços',
    revenue: '30k_100k',
    revenueLabel: 'R$ 30.000 a R$ 100.000/mês',
    pains: ['dre', 'vendas'],
    currentSystem: 'sem_sistema',
    urgency: 'pesquisando',
    score: 55,
    status: 'warm',
    estimatedMonthlyLoss: 'R$ 4.800',
    estimatedMonthlyHours: '22 hrs'
  }
];

let _pollingIntervalId = null;

export const StorageManager = {
  // Retorna se a API do banco está configurada
  isCloudActive() {
    return DB_CONFIG.isConfigured();
  },

  // Obter todos os leads do LocalStorage (ou inicializar com dados de exemplo)
  getLeads() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveLeads(sampleLeads);
      return sampleLeads;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao ler leads locais:', e);
      return sampleLeads;
    }
  },

  // Salvar array completo no LocalStorage
  saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  },

  // Adicionar novo lead (Salva localmente de imediato e envia para o SQL Server)
  async addLead(leadData) {
    // 1. Salva localmente primeiro (garantia offline imediata na feira)
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== leadData.id);
    filtered.unshift(leadData);
    this.saveLeads(filtered);

    // 2. Se a API estiver configurada, envia para o SQL Server
    if (this.isCloudActive()) {
      try {
        const response = await fetch(`${DB_CONFIG.apiUrl}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });

        if (response.ok) {
          console.log('✅ Lead sincronizado com Microsoft SQL Server:', leadData.id);
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('Servidor SQL Server recusou o lead:', errData.message || response.statusText);
        }
      } catch (err) {
        console.warn('Modo offline: Falha ao contatar API SQL Server, o lead permanece seguro no LocalStorage:', err);
      }
    }

    return leadData;
  },

  // Buscar todos os leads do SQL Server e mesclar com o cache local
  async fetchCloudLeads() {
    if (!this.isCloudActive()) return this.getLeads();

    try {
      const response = await fetch(`${DB_CONFIG.apiUrl}/leads`);
      if (!response.ok) {
        console.warn('API SQL Server retornou erro:', response.status);
        return this.getLeads();
      }

      const json = await response.json();
      if (json.success && Array.isArray(json.leads)) {
        const serverLeads = json.leads;

        // Mesclar dados do servidor com locais preservando unicidade
        const localLeads = this.getLeads();
        const map = new Map();

        // Insere locais primeiro
        localLeads.forEach(l => map.set(l.id, l));
        // Sobrescreve com os do banco
        serverLeads.forEach(s => map.set(s.id, s));

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        this.saveLeads(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Não foi possível sincronizar com o SQL Server neste momento:', err);
    }

    return this.getLeads();
  },

  // Polling em tempo real para atualizar leads automaticamente no painel
  subscribeToLeads(onNewLead, onDeleteLead) {
    if (_pollingIntervalId) {
      clearInterval(_pollingIntervalId);
    }

    let knownLeadIds = new Set(this.getLeads().map(l => l.id));

    _pollingIntervalId = setInterval(async () => {
      if (!this.isCloudActive()) return;

      try {
        const response = await fetch(`${DB_CONFIG.apiUrl}/leads`);
        if (!response.ok) return;

        const json = await response.json();
        if (!json.success || !Array.isArray(json.leads)) return;

        const currentServerIds = new Set(json.leads.map(l => l.id));

        // Detecta novos leads
        json.leads.forEach(serverLead => {
          if (!knownLeadIds.has(serverLead.id)) {
            console.log('⚡ Novo lead recebido do SQL Server:', serverLead);
            const currentLocal = this.getLeads();
            if (!currentLocal.some(l => l.id === serverLead.id)) {
              currentLocal.unshift(serverLead);
              this.saveLeads(currentLocal);
            }
            knownLeadIds.add(serverLead.id);
            if (typeof onNewLead === 'function') {
              onNewLead(serverLead);
            }
          }
        });

        // Detecta leads removidos no banco
        for (const localId of knownLeadIds) {
          if (!currentServerIds.has(localId)) {
            console.log('🗑️ Lead removido no SQL Server:', localId);
            const currentLocal = this.getLeads().filter(l => l.id !== localId);
            this.saveLeads(currentLocal);
            knownLeadIds.delete(localId);
            if (typeof onDeleteLead === 'function') {
              onDeleteLead(localId);
            }
          }
        }
      } catch {
        // Silêncio se o backend estiver momentaneamente fora
      }
    }, 5000);

    return {
      unsubscribe: () => {
        if (_pollingIntervalId) {
          clearInterval(_pollingIntervalId);
          _pollingIntervalId = null;
        }
      }
    };
  },

  // Apagar um lead (Localmente e no SQL Server)
  async deleteLead(leadId) {
    // 1. Remove do LocalStorage
    const leads = this.getLeads().filter(l => l.id !== leadId);
    this.saveLeads(leads);

    // 2. Remove do SQL Server se conectado
    if (this.isCloudActive()) {
      try {
        const response = await fetch(`${DB_CONFIG.apiUrl}/leads/${encodeURIComponent(leadId)}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          console.error('Erro ao deletar lead no SQL Server:', err.message);
          return { success: false, message: err.message };
        }
      } catch (err) {
        console.error('Falha de rede ao deletar lead no SQL Server:', err);
      }
    }

    return { success: true };
  },

  // Testar conectividade com a API e o SQL Server
  async testCloudConnection(customUrl) {
    let url = (customUrl || DB_CONFIG.apiUrl || '').trim().replace(/\/$/, '');
    if (!url.endsWith('/api') && !url.includes('/api/')) {
      url = `${url}/api`;
    }

    try {
      const response = await fetch(`${url}/health`, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data.connected) {
        return {
          success: true,
          message: `Conexão bem-sucedida! Banco: ${data.databaseName || 'SQL Server'} em ${data.server || 'localhost'}`
        };
      } else {
        return {
          success: false,
          message: `A API respondeu, mas o SQL Server não conectou: ${data.message || data.hint || 'Verifique o .env e o serviço do SQL Server.'}`
        };
      }
    } catch (err) {
      return {
        success: false,
        message: `Não foi possível alcançar a API Node.js em "${url}". O servidor está iniciado (node server.js)? Erro: ${err.message}`
      };
    }
  },

  // Sincronizar todos os leads locais para o SQL Server em lote
  async syncLocalToCloud() {
    if (!this.isCloudActive()) throw new Error('API do SQL Server não configurada.');
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return 0;

    const response = await fetch(`${DB_CONFIG.apiUrl}/leads/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao sincronizar com o SQL Server.');
    }

    const data = await response.json();
    return data.count || leads.length;
  },

  // Limpar leads locais
  clearLeads() {
    localStorage.removeItem(STORAGE_KEY);
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

  // Exportar leads para CSV
  exportToCSV() {
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return alert('Nenhum lead para exportar.');

    const headers = [
      'ID', 'Data/Hora', 'Nome', 'Empresa', 'Cargo', 'WhatsApp', 'Email',
      'Segmento', 'Faturamento', 'Sistema Atual', 'Urgencia', 'Score',
      'Status Temperatura', 'Perda Mensal Estimada'
    ];

    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString('pt-BR')}"`,
      `"${l.name || ''}"`,
      `"${l.company || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.email || ''}"`,
      `"${l.segmentLabel || l.segment || ''}"`,
      `"${l.revenueLabel || l.revenue || ''}"`,
      `"${l.currentSystem || ''}"`,
      `"${l.urgency || ''}"`,
      `"${l.score}"`,
      `"${l.status.toUpperCase()}"`,
      `"${l.estimatedMonthlyLoss || ''}"`
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

