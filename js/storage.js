/**
 * AzurraERP Lead Capture - Sistema de Banco de Dados JSON Local (LocalStorage)
 * 100% no Navegador (Zero Dependências de Node.js ou SQL Server)
 * Feira FRESQUA 2026
 */

const STORAGE_KEY = 'azurra_fresqua_leads_v1';
const PAGE_CONFIG_KEY = 'azurra_lead_page_config_v1';
const COMPANY_WHATSAPP_NUMBER = '551131817744'; // AzurraERP Official WhatsApp (+55 11 3181-7744)

const DEFAULT_PAGE_CONFIG = {
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

const StorageManager = {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
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

  // Adicionar novo lead (Salva localmente no banco JSON do navegador)
  addLead(leadData) {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== leadData.id);
    filtered.unshift(leadData);
    this.saveLeads(filtered);
    return leadData;
  },

  // Apagar um lead do banco JSON local
  deleteLead(leadId) {
    const leads = this.getLeads().filter(l => l.id !== leadId);
    this.saveLeads(leads);
    return { success: true };
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

  // Helper universal para disparar download no navegador (Blob ou Data URI)
  _downloadFile(content, filename, mimeType) {
    try {
      if (typeof window !== 'undefined' && window.Blob && window.URL && window.URL.createObjectURL) {
        const blob = new Blob([content], { type: mimeType });
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
        }, 3000);
        return;
      }
    } catch (e) {
      console.warn('Download via Blob falhou, acionando fallback Data URI:', e);
    }

    // Fallback Data URI universal
    try {
      const encodedUri = `data:${mimeType},` + encodeURIComponent(content);
      const link = document.createElement('a');
      link.href = encodedUri;
      link.setAttribute('download', filename);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 3000);
    } catch (err2) {
      console.error('Falha crítica ao realizar download:', err2);
      alert('Erro ao realizar download: ' + err2.message);
    }
  },

  // Helper para formatar campos de cada lead de forma estruturada e legível
  getFormattedLeadDetails(lead) {
    const painMap = {
      estoque: 'Controle de Estoque / Perdas',
      fiscal: 'Emissão Fiscal / SPED / Notas',
      dre: 'Visibilidade Financeira / DRE',
      planilhas: 'Excesso de Planilhas Manuais',
      vendas: 'Lentidão em Vendas / Pedidos'
    };

    const sysMap = {
      sem_sistema: 'Sem Sistema (Controle no Papel)',
      excel: 'Planilhas Excel / Google Sheets',
      concorrente: 'Outro ERP / Sistema Legado',
      proprio: 'Sistema Próprio / Interno'
    };

    const urgMap = {
      imediato: 'Imediato (Dentro de 15 dias)',
      '30_dias': 'Em até 30 dias',
      '60_dias': 'Em até 60 dias',
      pesquisando: 'Apenas Pesquisando'
    };

    const cleanPhone = (lead.whatsapp || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const waLink = cleanPhone ? `https://wa.me/${phoneWithCountry}` : '';

    const painsList = Array.isArray(lead.pains)
      ? lead.pains.map(p => painMap[p] || p).join(', ')
      : (lead.pains || 'Não informado');

    return {
      id: lead.id || '',
      date: lead.timestamp ? new Date(lead.timestamp).toLocaleString('pt-BR') : '',
      name: lead.name || '',
      company: lead.company || '',
      role: lead.role || '',
      whatsapp: lead.whatsapp || '',
      waLink,
      email: lead.email || '',
      segment: lead.segmentLabel || lead.segment || '',
      revenue: lead.revenueLabel || lead.revenue || '',
      pains: painsList,
      system: sysMap[lead.currentSystem] || lead.currentSystem || 'Não informado',
      urgency: urgMap[lead.urgency] || lead.urgency || 'Não informado',
      score: lead.score != null ? `${lead.score}%` : '',
      status: (lead.status || 'COLD').toUpperCase(),
      monthlyLoss: lead.estimatedMonthlyLoss || 'R$ 0',
      wastedHours: lead.estimatedMonthlyHours || '0 hrs',
      notes: (lead.notes || '').trim()
    };
  },

  // Exportar / Baixar arquivo JSON completo (leads.json para backup ou restauração)
  exportToJSON() {
    const leads = this.getLeads();
    const dataStr = JSON.stringify(leads, null, 2);
    const filename = `leads_azurraerp_${new Date().toISOString().slice(0, 10)}.json`;
    this._downloadFile(dataStr, filename, 'application/json;charset=utf-8');
  },

  // Exportar leads em planilha nativa do Microsoft Excel (.xls com formatação visual)
  exportToExcel() {
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return alert('Nenhum lead encontrado para exportar.');

    const filename = `leads_azurraerp_${new Date().toISOString().slice(0, 10)}.xls`;

    let rowsHtml = '';
    leads.forEach(l => {
      const d = this.getFormattedLeadDetails(l);
      const isHot = d.status.includes('HOT');
      const isWarm = d.status.includes('WARM');
      const badgeBg = isHot ? '#ffe4e6' : isWarm ? '#fef3c7' : '#d1fae5';
      const badgeColor = isHot ? '#b91c1c' : isWarm ? '#b45309' : '#047857';

      rowsHtml += `
        <tr>
          <td>${d.id}</td>
          <td>${d.date}</td>
          <td><b>${d.name}</b></td>
          <td><b>${d.company}</b></td>
          <td>${d.role}</td>
          <td style="mso-number-format:'\\@';">${d.whatsapp}</td>
          <td>${d.waLink ? `<a href="${d.waLink}" target="_blank">Conversar no WhatsApp</a>` : ''}</td>
          <td>${d.email}</td>
          <td>${d.segment}</td>
          <td>${d.revenue}</td>
          <td>${d.pains}</td>
          <td>${d.system}</td>
          <td>${d.urgency}</td>
          <td style="text-align:center; font-weight:bold;">${d.score}</td>
          <td style="background-color:${badgeBg}; color:${badgeColor}; font-weight:bold; text-align:center;">${d.status}</td>
          <td style="color:#dc2626; font-weight:bold;">${d.monthlyLoss}</td>
          <td>${d.wastedHours}</td>
          <td>${d.notes}</td>
        </tr>
      `;
    });

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Leads Feira FRESQUA</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #0b132b; color: #00f2fe; font-size: 11pt; font-weight: bold; border: 1px solid #999; padding: 8px 12px; text-align: left; }
          td { border: 1px solid #ccc; padding: 6px 10px; font-size: 10pt; vertical-align: middle; }
        </style>
      </head>
      <body>
        <h2 style="color: #0b132b;">Relatório Comercial de Leads — Stand AzurraERP (Feira FRESQUA)</h2>
        <p><b>Total de Leads Capturados:</b> ${leads.length} | <b>Data de Extração:</b> ${new Date().toLocaleString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Nome do Contato</th>
              <th>Empresa</th>
              <th>Cargo</th>
              <th>WhatsApp</th>
              <th>Link Direto WhatsApp</th>
              <th>E-mail</th>
              <th>Segmento</th>
              <th>Faturamento Mensal</th>
              <th>Dores / Gargalos Principais</th>
              <th>Sistema de Gestão Atual</th>
              <th>Urgência de Decisão</th>
              <th>Score de Eficiência</th>
              <th>Status / Temperatura</th>
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

    this._downloadFile(excelHtml, filename, 'application/vnd.ms-excel;charset=utf-8');
  },

  // Exportar leads para arquivo CSV estruturado (compatível com Excel, Google Sheets e CRMs)
  exportToCSV() {
    const leads = this.getLeads();
    if (!leads || leads.length === 0) return alert('Nenhum lead encontrado para exportar.');

    const filename = `leads_azurraerp_${new Date().toISOString().slice(0, 10)}.csv`;

    const headers = [
      'ID',
      'Data/Hora',
      'Nome Completo',
      'Empresa',
      'Cargo',
      'WhatsApp',
      'Link WhatsApp Direto',
      'E-mail',
      'Segmento',
      'Faturamento Estimado',
      'Dores / Gargalos Identificados',
      'Sistema Atual',
      'Urgencia de Decisao',
      'Score Gestao (%)',
      'Status Temperatura',
      'Perda Mensal Estimada',
      'Tempo Desperdicado',
      'Observacoes Adicionais'
    ];

    const escapeCsv = (val) => `"${String(val || '').replace(/"/g, '""')}"`;

    const rows = leads.map(l => {
      const d = this.getFormattedLeadDetails(l);
      return [
        escapeCsv(d.id),
        escapeCsv(d.date),
        escapeCsv(d.name),
        escapeCsv(d.company),
        escapeCsv(d.role),
        escapeCsv(d.whatsapp),
        escapeCsv(d.waLink),
        escapeCsv(d.email),
        escapeCsv(d.segment),
        escapeCsv(d.revenue),
        escapeCsv(d.pains),
        escapeCsv(d.system),
        escapeCsv(d.urgency),
        escapeCsv(d.score),
        escapeCsv(d.status),
        escapeCsv(d.monthlyLoss),
        escapeCsv(d.wastedHours),
        escapeCsv(d.notes)
      ].join(';');
    });

    // \uFEFF é o Byte Order Mark (BOM) do UTF-8 que força o Excel abrir com acentuação correta
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows].join('\r\n');
    this._downloadFile(csvContent, filename, 'text/csv;charset=utf-8');
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

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  window.COMPANY_WHATSAPP_NUMBER = COMPANY_WHATSAPP_NUMBER;
  window.DEFAULT_PAGE_CONFIG = DEFAULT_PAGE_CONFIG;
}
