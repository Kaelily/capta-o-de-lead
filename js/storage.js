/**
 * AzurraERP Lead Capture - LocalStorage & Lead Management System
 */

const STORAGE_KEY = 'azurra_fresqua_leads_v1';

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

export const StorageManager = {
  // Get all leads from LocalStorage (or initialize with realistic sample data)
  getLeads() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveLeads(sampleLeads);
      return sampleLeads;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing saved leads:', e);
      return sampleLeads;
    }
  },

  // Save full lead array
  saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  },

  // Add new lead
  addLead(leadData) {
    const leads = this.getLeads();
    leads.unshift(leadData); // put latest on top
    this.saveLeads(leads);
    return leadData;
  },

  // Clear all leads (reset)
  clearLeads() {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Generate pre-formatted WhatsApp link for booth team to message lead
  getWhatsAppLink(lead) {
    const cleanPhone = lead.whatsapp.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    const message = `Olá ${lead.name}, tudo bem? Sou da equipe da *AzurraERP* aqui no Stand da *FRESQUA*! 🚀\n\nVi que você acabou de realizar seu *Diagnóstico de Gestão Empresarial* para a empresa *${lead.company}*.\n\nSeu resultado indicou um potencial de otimização incrível! Tenho uma condição especial de feira com *isção de taxa de implantação* pronta para você. Pode passar aqui no nosso Stand para tomarmos um café?☕`;

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  },

  // Export leads to CSV file
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
      `"${l.role || ''}"`,
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
    link.setAttribute('download', `leads_azurraerp_fresqua_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
