/**
 * AzurraERP Lead Capture & Diagnostic Engine (Client App)
 */

import { StorageManager } from './storage.js';

class DiagnosticApp {
  constructor() {
    this.currentStep = 0; // 0 = Welcome, 1..4 = Quiz, 5 = Result
    this.formData = {
      segment: '',
      segmentLabel: '',
      revenue: '',
      revenueLabel: '',
      pains: [],
      currentSystem: '',
      urgency: '',
      name: '',
      whatsapp: '',
      company: '',
      role: '',
      email: ''
    };

    this.initElements();
    this.initLayoutTheme();
    this.bindEvents();
  }

  initElements() {
    this.welcomeScreen = document.getElementById('screen-welcome');
    this.quizCard = document.getElementById('quiz-card');
    this.resultScreen = document.getElementById('screen-result');

    this.progressBar = document.getElementById('quiz-progress-bar');
    this.stepIndicatorText = document.getElementById('step-indicator-text');
    this.stepTitle = document.getElementById('step-title');
    this.stepSubtitle = document.getElementById('step-subtitle');

    this.btnStart = document.getElementById('btn-start');
    this.btnBack = document.getElementById('btn-back');
    this.btnNext = document.getElementById('btn-next');

    this.stepContainers = [
      document.getElementById('step-1'),
      document.getElementById('step-2'),
      document.getElementById('step-3'),
      document.getElementById('step-4')
    ];
  }

  initLayoutTheme() {
    const savedTheme = localStorage.getItem('azurra_fresqua_layout_theme');
    if (savedTheme === 'totem-kiosk') {
      document.body.classList.add('theme-totem-kiosk');
    } else {
      document.body.classList.remove('theme-totem-kiosk');
    }
  }

  bindEvents() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => this.goToStep(1));
    }
    if (this.btnBack) {
      this.btnBack.addEventListener('click', () => this.handleBack());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.handleNext());
    }

    // Option cards selection logic
    document.querySelectorAll('.option-single').forEach(card => {
      card.addEventListener('click', () => {
        const group = card.dataset.group;
        const value = card.dataset.value;
        const label = card.dataset.label || card.querySelector('.option-title').innerText;

        // Deselect sibling cards in same group
        document.querySelectorAll(`.option-single[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        this.formData[group] = value;
        if (group === 'segment') this.formData.segmentLabel = label;
        if (group === 'revenue') this.formData.revenueLabel = label;
      });
    });

    // Multi-select cards (Pains)
    document.querySelectorAll('.option-multi').forEach(card => {
      card.addEventListener('click', () => {
        const value = card.dataset.value;
        card.classList.toggle('selected');

        if (card.classList.contains('selected')) {
          if (!this.formData.pains.includes(value)) this.formData.pains.push(value);
        } else {
          this.formData.pains = this.formData.pains.filter(p => p !== value);
        }
      });
    });

    // Form inputs handling
    ['name', 'whatsapp', 'company', 'role', 'email'].forEach(field => {
      const input = document.getElementById(`input-${field}`);
      if (input) {
        input.addEventListener('input', (e) => {
          this.formData[field] = e.target.value;
        });
      }
    });
  }

  goToStep(step) {
    this.currentStep = step;

    this.welcomeScreen.style.display = 'none';
    this.resultScreen.style.display = 'none';
    this.quizCard.style.display = 'block';

    // Hide all step bodies
    this.stepContainers.forEach(container => {
      if (container) container.style.display = 'none';
    });

    // Show current step body
    if (this.stepContainers[step - 1]) {
      this.stepContainers[step - 1].style.display = 'block';
    }

    // Update Progress Bar & Headers
    const progressPercent = (step / 4) * 100;
    this.progressBar.style.width = `${progressPercent}%`;
    this.stepIndicatorText.innerText = `ETAPA ${step} DE 4`;

    if (step === 1) {
      this.stepTitle.innerText = 'Qual é o perfil da sua empresa?';
      this.stepSubtitle.innerText = 'Selecione seu segmento de atuação e a faixa de faturamento mensal aproximada.';
      this.btnBack.style.visibility = 'hidden';
      this.btnNext.innerText = 'Próximo Passo ➔';
    } else if (step === 2) {
      this.stepTitle.innerText = 'Quais são os principais gargalos da sua gestão hoje?';
      this.stepSubtitle.innerText = 'Selecione todas as opções que geram dor de cabeça na sua operação (pode marcar mais de uma).';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Próximo Passo ➔';
    } else if (step === 3) {
      this.stepTitle.innerText = 'Como você controla seu negócio atualmente?';
      this.stepSubtitle.innerText = 'Indique suas ferramentas atuais e o seu momento de decisão.';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Ver Diagnóstico ➔';
    } else if (step === 4) {
      this.stepTitle.innerText = 'Para onde devemos enviar seu Diagnóstico Completo?';
      this.stepSubtitle.innerText = 'Preencha seus dados para visualizar seu Score de Eficiência e liberar a condição de feira FRESQUA.';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Gerar Raio-X Agora 🚀';
    }
  }

  handleBack() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    } else {
      this.resetToWelcome();
    }
  }

  handleNext() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < 4) {
        this.goToStep(this.currentStep + 1);
      } else {
        this.calculateAndShowResult();
      }
    }
  }

  validateStep(step) {
    if (step === 1) {
      if (!this.formData.segment) {
        alert('Por favor, selecione o segmento da sua empresa.');
        return false;
      }
      if (!this.formData.revenue) {
        alert('Por favor, selecione a faixa de faturamento mensal.');
        return false;
      }
    } else if (step === 2) {
      if (this.formData.pains.length === 0) {
        alert('Por favor, marque pelo menos uma dor/gargalo operacional.');
        return false;
      }
    } else if (step === 3) {
      if (!this.formData.currentSystem) {
        alert('Por favor, selecione seu sistema de gestão atual.');
        return false;
      }
      if (!this.formData.urgency) {
        alert('Por favor, selecione a sua urgência para resolução.');
        return false;
      }
    } else if (step === 4) {
      if (!this.formData.name || !this.formData.whatsapp || !this.formData.company) {
        alert('Por favor, preencha Nome, WhatsApp e Nome da Empresa.');
        return false;
      }
    }
    return true;
  }

  calculateAndShowResult() {
    // Qualification Logic & Scoring System
    let baseScore = 100;
    
    // Deduct points based on pains
    baseScore -= (this.formData.pains.length * 14);

    // Deduct for manual systems
    if (this.formData.currentSystem === 'excel' || this.formData.currentSystem === 'sem_sistema') {
      baseScore -= 20;
    } else if (this.formData.currentSystem === 'sistema_antigo') {
      baseScore -= 12;
    }

    // Clamp score
    const finalScore = Math.max(18, Math.min(95, baseScore));

    // Temperature / Lead Priority Classification
    let status = 'warm'; // hot, warm, cold
    if (
      (this.formData.revenue === '500k_plus' || this.formData.revenue === '100k_500k') &&
      (this.formData.urgency === 'imediato' || this.formData.urgency === '30_dias')
    ) {
      status = 'hot';
    } else if (this.formData.urgency === 'pesquisando' && this.formData.revenue === 'ate_30k') {
      status = 'cold';
    } else {
      status = 'warm';
    }

    // Calculate Estimated Loss
    let baseLossVal = 3000;
    let baseHours = 20;

    if (this.formData.revenue === '100k_500k') { baseLossVal = 9500; baseHours = 40; }
    if (this.formData.revenue === '500k_plus') { baseLossVal = 24000; baseHours = 75; }

    const lossAmountMultiplier = 1 + (this.formData.pains.length * 0.25);
    const totalLossVal = Math.round(baseLossVal * lossAmountMultiplier);
    const totalHoursVal = Math.round(baseHours * (1 + (this.formData.pains.length * 0.2)));

    const formattedLoss = `R$ ${totalLossVal.toLocaleString('pt-BR')}`;
    const formattedHours = `${totalHoursVal} hrs/mês`;

    // Complete Lead Object
    const leadRecord = {
      id: `lead-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...this.formData,
      score: finalScore,
      status: status,
      estimatedMonthlyLoss: formattedLoss,
      estimatedMonthlyHours: formattedHours
    };

    // Save Lead to LocalStorage
    StorageManager.addLead(leadRecord);

    // Hide Quiz, Show Results
    this.quizCard.style.display = 'none';
    this.resultScreen.style.display = 'block';

    // Update Result UI Elements
    document.getElementById('result-lead-name').innerText = this.formData.name.split(' ')[0];
    document.getElementById('result-company-name').innerText = this.formData.company;
    document.getElementById('result-score-val').innerText = `${finalScore}%`;
    document.getElementById('result-loss-val').innerText = formattedLoss;
    document.getElementById('result-hours-val').innerText = formattedHours;

    // Animate Gauge SVG stroke
    const gaugeFill = document.getElementById('gauge-fill-circle');
    if (gaugeFill) {
      const circumference = 440;
      const offset = circumference - (finalScore / 100) * circumference;
      setTimeout(() => {
        gaugeFill.style.strokeDashoffset = offset;
      }, 100);
    }

    // Render Recommended AzurraERP Modules
    this.renderRecommendedModules(this.formData.pains);

    // Setup Official AzurraERP WhatsApp (+55 11 3181-7744) Link for the Client
    const btnTalkConsultant = document.getElementById('btn-talk-consultant');
    if (btnTalkConsultant) {
      btnTalkConsultant.href = StorageManager.getCompanyWhatsAppLink(leadRecord);
    }
  }

  renderRecommendedModules(pains) {
    const container = document.getElementById('recommended-modules-grid');
    if (!container) return;

    const moduleMap = {
      estoque: { icon: '📦', name: 'Azurra WMS & Estoque', benefit: 'Controle de lote, inventário automatizado e aviso de nivel crítico.' },
      fiscal: { icon: '📄', name: 'Azurra Fiscal & NF-e', benefit: 'Emissão automatizada de NF-e, NFC-e, CT-e sem retrabalho manual.' },
      dre: { icon: '📊', name: 'Azurra BI & DRE Gerencial', benefit: 'DRE em tempo real, fluxo de caixa projetado e margem de lucro exata.' },
      planilhas: { icon: '⚡', name: 'Azurra Hub de Processos', benefit: 'Eliminação completa de planilhas paralelas e integração total.' },
      vendas: { icon: '🤝', name: 'Azurra CRM & Vendas', benefit: 'Sincronização imediata de pedidos com faturamento e financeiro.' }
    };

    container.innerHTML = '';
    const activePains = pains.length > 0 ? pains : ['estoque', 'fiscal', 'dre'];

    activePains.forEach(painKey => {
      const mod = moduleMap[painKey] || moduleMap.dre;
      const card = document.createElement('div');
      card.className = 'module-badge';
      card.innerHTML = `
        <div class="module-icon">${mod.icon}</div>
        <div>
          <div class="module-name">${mod.name}</div>
          <div class="module-benefit">${mod.benefit}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  resetToWelcome() {
    this.currentStep = 0;
    this.welcomeScreen.style.display = 'block';
    this.quizCard.style.display = 'none';
    this.resultScreen.style.display = 'none';
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.diagnosticApp = new DiagnosticApp();
});
