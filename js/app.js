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
      email: '',
      notes: ''
    };

    this.initElements();
    this.initLayoutTheme();
    this.bindEvents();
    this.loadPageConfig();

    window.addEventListener('storage', () => this.loadPageConfig());
  }

  initElements() {
    this.welcomeScreen = document.getElementById('screen-welcome');
    this.quizCard = document.getElementById('quiz-card');

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

    this.bindOptionEvents();

    // Form inputs handling
    ['name', 'whatsapp', 'company', 'role', 'email', 'notes'].forEach(field => {
      const input = document.getElementById(`input-${field}`);
      if (input) {
        input.addEventListener('input', (e) => {
          this.formData[field] = e.target.value;
        });
      }
    });

    const btnRestart = document.getElementById('btn-restart-quiz');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

  goToStep(step) {
    this.currentStep = step;

    this.welcomeScreen.style.display = 'none';
    this.quizCard.style.display = 'block';

    // Hide all step bodies
    this.stepContainers.forEach(container => {
      if (container) container.style.display = 'none';
    });

    // Show current step body
    if (this.stepContainers[step - 1]) {
      this.stepContainers[step - 1].style.display = 'block';
    }

    this.bindOptionEvents();

    // Update Progress Bar & Headers
    const progressPercent = (step / 4) * 100;
    this.progressBar.style.width = `${progressPercent}%`;
    this.stepIndicatorText.innerText = `ETAPA ${step} DE 4`;

    const config = StorageManager.getPageConfig();
    const stepsConfig = config ? config.steps || {} : {};

    if (step === 1) {
      const s1 = stepsConfig.step1 || {};
      this.stepTitle.innerText = s1.title || 'Qual é o perfil da sua empresa?';
      this.stepSubtitle.innerText = s1.subtitle || 'Selecione seu segmento de atuação e a faixa de faturamento mensal aproximada.';
      this.btnBack.style.visibility = 'hidden';
      this.btnNext.innerText = 'Próximo Passo ➔';
    } else if (step === 2) {
      const s2 = stepsConfig.step2 || {};
      this.stepTitle.innerText = s2.title || 'Quais são os principais gargalos da sua gestão hoje?';
      this.stepSubtitle.innerText = s2.subtitle || 'Selecione todas as opções que geram dor de cabeça na sua operação (pode marcar mais de uma).';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Próximo Passo ➔';
    } else if (step === 3) {
      const s3 = stepsConfig.step3 || {};
      this.stepTitle.innerText = s3.title || 'Como você controla seu negócio atualmente?';
      this.stepSubtitle.innerText = s3.subtitle || 'Indique suas ferramentas atuais e o seu momento de decisão.';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Próximo Passo ➔';
    } else if (step === 4) {
      const s4 = stepsConfig.step4 || {};
      this.stepTitle.innerText = s4.title || 'Para onde devemos enviar seu Diagnóstico Completo?';
      this.stepSubtitle.innerText = s4.subtitle || 'Preencha seus dados para receber o Score de Eficiência e liberar a condição de feira FRESQUA.';
      this.btnBack.style.visibility = 'visible';
      this.btnNext.innerText = 'Finalizar e Enviar para o Cliente 📲';
    }
  }

  handleBack() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    } else {
      this.resetForm();
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
      this.formData.name = document.getElementById('input-name')?.value.trim() || '';
      this.formData.whatsapp = document.getElementById('input-whatsapp')?.value.trim() || '';
      this.formData.company = document.getElementById('input-company')?.value.trim() || '';
      this.formData.role = document.getElementById('input-role')?.value.trim() || '';
      this.formData.email = document.getElementById('input-email')?.value.trim() || '';
      this.formData.notes = document.getElementById('input-notes')?.value.trim() || '';

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

    // Salvar exclusivamente no banco de dados Supabase
    StorageManager.addLead(leadRecord);

    // Gerar link formatado direto para o WhatsApp do CLIENTE
    const clientWhatsAppUrl = StorageManager.getLeadWhatsAppLink(leadRecord);

    // Abrir o WhatsApp do cliente diretamente
    window.open(clientWhatsAppUrl, '_blank');

    // Limpar o formulário e retornar à tela inicial para o próximo atendimento
    this.resetForm();
  }

  resetForm() {
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
      email: '',
      notes: ''
    };

    // Limpar inputs
    ['name', 'whatsapp', 'company', 'role', 'email', 'notes'].forEach(field => {
      const input = document.getElementById(`input-${field}`);
      if (input) input.value = '';
    });

    // Desmarcar cartões
    document.querySelectorAll('.option-card.selected').forEach(card => {
      card.classList.remove('selected');
    });

    // Retornar para a tela inicial
    this.currentStep = 0;
    if (this.quizCard) this.quizCard.style.display = 'none';
    if (this.welcomeScreen) this.welcomeScreen.style.display = 'block';
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
    if (this.welcomeScreen) this.welcomeScreen.style.display = 'block';
    if (this.quizCard) this.quizCard.style.display = 'none';
  }

  loadPageConfig() {
    const config = StorageManager.getPageConfig();
    if (!config) return;

    // Brand / Logo
    const brandLogoText = document.getElementById('brand-logo-text');
    if (brandLogoText && config.brandName) brandLogoText.innerText = config.brandName;

    const brandLogoIcon = document.getElementById('brand-logo-icon');
    if (brandLogoIcon && config.brandName) brandLogoIcon.innerText = config.brandName.charAt(0).toUpperCase();

    const brandLogoTag = document.getElementById('brand-logo-tag');
    if (brandLogoTag && config.brandTag) brandLogoTag.innerText = config.brandTag;

    // Badge
    const heroBadge = document.getElementById('hero-badge');
    if (heroBadge && config.badgeText) heroBadge.innerText = config.badgeText;

    // Image
    const heroImgContainer = document.getElementById('hero-img-container');
    const heroCustomImg = document.getElementById('hero-custom-img');
    if (heroImgContainer && heroCustomImg) {
      if (config.heroImage) {
        heroCustomImg.src = config.heroImage;
        heroImgContainer.style.display = 'block';
      } else {
        heroImgContainer.style.display = 'none';
      }
    }

    // Hero Title & Subtitle
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && config.heroTitle) heroTitle.innerHTML = config.heroTitle;

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle && config.heroSubtitle) heroSubtitle.innerHTML = config.heroSubtitle;

    // Button
    const btnStart = document.getElementById('btn-start');
    if (btnStart && config.btnStartText) btnStart.innerText = config.btnStartText;

    // Stats
    // Stats (Estatísticas Hero)
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
      if (config.hideStats === true || config.statsEnabled === false) {
        statsContainer.style.setProperty('display', 'none', 'important');
      } else {
        statsContainer.style.removeProperty('display');
        if (config.stats && Array.isArray(config.stats)) {
          config.stats.forEach((st, i) => {
            const numEl = document.getElementById(`stat-num-${i}`);
            const labelEl = document.getElementById(`stat-label-${i}`);
            if (numEl && st.number !== undefined) numEl.innerText = st.number;
            if (labelEl && st.label !== undefined) labelEl.innerText = st.label;
          });
        }
      }
    }

    // FAQ Section
    const faqSection = document.getElementById('client-faq-section');
    const faqTitle = document.getElementById('client-faq-title');
    const faqSubtitle = document.getElementById('client-faq-subtitle');
    const faqAccordion = document.getElementById('client-faq-accordion');

    if (faqSection && faqAccordion) {
      if (config.faqEnabled && config.faqs && config.faqs.length > 0) {
        faqSection.style.display = 'block';
        if (faqTitle && config.faqTitle) faqTitle.innerText = config.faqTitle;
        if (faqSubtitle && config.faqSubtitle) faqSubtitle.innerText = config.faqSubtitle;

        faqAccordion.innerHTML = '';
        config.faqs.forEach((item) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'faq-accordion-item';
          itemEl.innerHTML = `
            <div class="faq-accordion-header">
              <span>${item.question}</span>
              <span class="faq-accordion-icon">+</span>
            </div>
            <div class="faq-accordion-body">
              <p>${item.answer}</p>
            </div>
          `;

          const header = itemEl.querySelector('.faq-accordion-header');
          header.addEventListener('click', () => {
            const isActive = itemEl.classList.contains('active');
            document.querySelectorAll('.faq-accordion-item').forEach(el => el.classList.remove('active'));
            if (!isActive) itemEl.classList.add('active');
          });

          faqAccordion.appendChild(itemEl);
        });
      } else {
        faqSection.style.display = 'none';
      }
    }

    // Render Steps 1-4 Dynamic Cards
    if (config.steps) {
      const s1 = config.steps.step1;
      if (s1) {
        const lQ1 = document.getElementById('label-step1-q1');
        if (lQ1 && s1.questionSegmentLabel) lQ1.innerText = s1.questionSegmentLabel;

        const cSeg = document.getElementById('container-step1-segments');
        if (cSeg && s1.segments) {
          cSeg.innerHTML = '';
          s1.segments.forEach(seg => {
            const isSel = this.formData.segment === seg.value;
            const card = document.createElement('div');
            card.className = `option-card option-single ${isSel ? 'selected' : ''}`;
            card.dataset.group = 'segment';
            card.dataset.value = seg.value;
            card.dataset.label = seg.title || seg.label;
            card.innerHTML = `
              <div class="option-icon">${seg.icon || '🛍️'}</div>
              <div class="option-title">${seg.title || seg.label}</div>
              ${seg.desc ? `<div class="option-desc">${seg.desc}</div>` : ''}
            `;
            cSeg.appendChild(card);
          });
        }

        const lQ2 = document.getElementById('label-step1-q2');
        if (lQ2 && s1.questionRevenueLabel) lQ2.innerText = s1.questionRevenueLabel;

        const cRev = document.getElementById('container-step1-revenues');
        if (cRev && s1.revenues) {
          cRev.innerHTML = '';
          s1.revenues.forEach(rev => {
            const isSel = this.formData.revenue === rev.value;
            const card = document.createElement('div');
            card.className = `option-card option-single ${isSel ? 'selected' : ''}`;
            card.dataset.group = 'revenue';
            card.dataset.value = rev.value;
            card.dataset.label = rev.title || rev.label;
            card.innerHTML = `<div class="option-title">${rev.title || rev.label}</div>`;
            cRev.appendChild(card);
          });
        }
      }

      const s2 = config.steps.step2;
      if (s2) {
        const lInst = document.getElementById('label-step2-instruction');
        if (lInst && s2.instructionLabel) lInst.innerText = s2.instructionLabel;

        const cPains = document.getElementById('container-step2-pains');
        if (cPains && s2.pains) {
          cPains.innerHTML = '';
          s2.pains.forEach(p => {
            const isSel = this.formData.pains.includes(p.value);
            const card = document.createElement('div');
            card.className = `option-card option-multi ${isSel ? 'selected' : ''}`;
            card.dataset.value = p.value;
            card.innerHTML = `
              <div class="checkbox-mark">✓</div>
              <div class="option-icon">${p.icon || '📦'}</div>
              <div class="option-title">${p.title}</div>
              ${p.desc ? `<div class="option-desc">${p.desc}</div>` : ''}
            `;
            cPains.appendChild(card);
          });
        }
      }

      const s3 = config.steps.step3;
      if (s3) {
        const lQ1 = document.getElementById('label-step3-q1');
        if (lQ1 && s3.questionCurrentSystemLabel) lQ1.innerText = s3.questionCurrentSystemLabel;

        const cSys = document.getElementById('container-step3-systems');
        if (cSys && s3.currentSystems) {
          cSys.innerHTML = '';
          s3.currentSystems.forEach(sys => {
            const isSel = this.formData.currentSystem === sys.value;
            const card = document.createElement('div');
            card.className = `option-card option-single ${isSel ? 'selected' : ''}`;
            card.dataset.group = 'currentSystem';
            card.dataset.value = sys.value;
            card.dataset.label = sys.title || sys.label;
            card.innerHTML = `<div class="option-title">${sys.title || sys.label}</div>`;
            cSys.appendChild(card);
          });
        }

        const lQ2 = document.getElementById('label-step3-q2');
        if (lQ2 && s3.questionUrgencyLabel) lQ2.innerText = s3.questionUrgencyLabel;

        const cUrg = document.getElementById('container-step3-urgencies');
        if (cUrg && s3.urgencies) {
          cUrg.innerHTML = '';
          s3.urgencies.forEach(urg => {
            const isSel = this.formData.urgency === urg.value;
            const card = document.createElement('div');
            card.className = `option-card option-single ${isSel ? 'selected' : ''}`;
            card.dataset.group = 'urgency';
            card.dataset.value = urg.value;
            card.dataset.label = urg.title || urg.label;
            card.innerHTML = `<div class="option-title">${urg.title || urg.label}</div>`;
            cUrg.appendChild(card);
          });
        }
      }

      const s4 = config.steps.step4;
      if (s4) {
        const setLabelPh = (lblId, inputId, labelText, placeholderText) => {
          const l = document.getElementById(lblId);
          const i = document.getElementById(inputId);
          if (l && labelText) l.innerText = labelText;
          if (i && placeholderText) i.placeholder = placeholderText;
        };

        setLabelPh('label-step4-name', 'input-name', s4.nameLabel, s4.namePlaceholder);
        setLabelPh('label-step4-whatsapp', 'input-whatsapp', s4.whatsappLabel, s4.whatsappPlaceholder);
        setLabelPh('label-step4-company', 'input-company', s4.companyLabel, s4.companyPlaceholder);
        setLabelPh('label-step4-role', 'input-role', s4.roleLabel, s4.rolePlaceholder);
        setLabelPh('label-step4-email', 'input-email', s4.emailLabel, s4.emailPlaceholder);
        setLabelPh('label-step4-notes', 'input-notes', s4.notesLabel, s4.notesPlaceholder);
      }

      this.bindOptionEvents();
    }

    // Render Result Screen Configs
    if (config.resultScreen) {
      const res = config.resultScreen;
      const descEl = document.getElementById('result-offer-desc');
      if (descEl && res.offerDesc !== undefined) descEl.innerText = res.offerDesc;

      const btnEl = document.getElementById('btn-talk-consultant');
      if (btnEl && res.btnWhatsappText !== undefined) btnEl.innerText = res.btnWhatsappText;
    }
  }

  bindOptionEvents() {
    document.querySelectorAll('.option-single').forEach(card => {
      card.onclick = () => {
        const group = card.dataset.group;
        const value = card.dataset.value;
        const label = card.dataset.label || card.querySelector('.option-title')?.innerText || '';

        document.querySelectorAll(`.option-single[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        this.formData[group] = value;
        if (group === 'segment') this.formData.segmentLabel = label;
        if (group === 'revenue') this.formData.revenueLabel = label;
      };
    });

    document.querySelectorAll('.option-multi').forEach(card => {
      card.onclick = () => {
        const value = card.dataset.value;
        card.classList.toggle('selected');

        if (card.classList.contains('selected')) {
          if (!this.formData.pains.includes(value)) this.formData.pains.push(value);
        } else {
          this.formData.pains = this.formData.pains.filter(p => p !== value);
        }
      };
    });
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.diagnosticApp = new DiagnosticApp();
});
