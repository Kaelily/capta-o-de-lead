/**
 * AzurraERP Lead Capture - Booth Team Dashboard Controller
 */

import { StorageManager, SUPABASE_SCHEMA_SQL } from './storage.js?v=4.1';
import { DB_CONFIG, SUPABASE_CONFIG } from './config.js?v=4.1';

export class DashboardController {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.initElements();
    this.initLayoutTheme();
    this.initCloudStatus();
    this.bindEvents();
    this.initCloudSync();
    this.loadLeadsFromSupabase();
  }

  initElements() {
    this.dashboardView = document.getElementById('dashboard-view');
    this.leadTableBody = document.getElementById('lead-table-body');

    this.metricTotalLeads = document.getElementById('metric-total-leads');
    this.metricHotLeads = document.getElementById('metric-hot-leads');
    this.metricAvgScore = document.getElementById('metric-avg-score');
    this.metricTotalLoss = document.getElementById('metric-total-loss');

    this.btnRefreshLeads = document.getElementById('btn-refresh-leads');
    this.btnExportCSV = document.getElementById('btn-export-csv');
    this.btnShowQR = document.getElementById('btn-show-qr');
    this.qrModal = document.getElementById('qr-modal');
    this.btnCloseQRModal = document.getElementById('btn-close-qr-modal');

    this.btnToggleLayout = document.getElementById('btn-toggle-layout');
    this.layoutNameText = document.getElementById('layout-name-text');

    // Database Modal & Elements
    this.btnCloudConfig = document.getElementById('btn-cloud-config');
    this.cloudStatusIndicator = document.getElementById('cloud-status-indicator');
    this.cloudStatusText = document.getElementById('cloud-status-text');
    this.cloudModal = document.getElementById('cloud-modal');
    this.btnCloseCloudModal = document.getElementById('btn-close-cloud-modal');
    this.btnClearAllLeads = document.getElementById('btn-clear-all-leads');
    this.toastContainer = document.getElementById('toast-container');

    // Supabase DB Modal Elements
    this.inputSupabaseUrl = document.getElementById('input-supabase-url');
    this.inputSupabaseKey = document.getElementById('input-supabase-key');
    this.supabaseStatusPill = document.getElementById('supabase-status-pill');
    this.btnTestSupabase = document.getElementById('btn-test-supabase');
    this.btnSaveSupabase = document.getElementById('btn-save-supabase');
    this.btnCopySupabaseSql = document.getElementById('btn-copy-supabase-sql');

    this.filterButtons = document.querySelectorAll('.btn-filter-status');
    this.inputSearchLead = document.getElementById('input-search-lead');
    this.inputQRUrl = document.getElementById('input-qr-url');
    this.qrCodeImg = document.getElementById('qr-code-img');

    // Customize Modal Elements
    this.btnCustomizePage = document.getElementById('btn-customize-page');
    this.customizeModal = document.getElementById('customize-modal');
    this.btnCloseCustomizeModal = document.getElementById('btn-close-customize-modal');
    this.btnCancelCustomizePage = document.getElementById('btn-cancel-customize-page');
    this.btnSaveCustomizePage = document.getElementById('btn-save-customize-page');
    this.btnResetCustomizePage = document.getElementById('btn-reset-customize-page');
    this.btnAddFaqItem = document.getElementById('btn-add-faq-item');
    this.faqItemsContainer = document.getElementById('faq-items-editor-container');
    this.tabButtonsCustomize = document.querySelectorAll('.btn-tab-customize');

    this.renderMetrics();
    this.renderLeadsTable();
  }

  initLayoutTheme() {
    const savedTheme = localStorage.getItem('azurra_fresqua_layout_theme');
    if (savedTheme === 'totem-kiosk') {
      document.body.classList.add('theme-totem-kiosk');
      if (this.layoutNameText) this.layoutNameText.innerText = 'Totem Touch';
    } else {
      document.body.classList.remove('theme-totem-kiosk');
      if (this.layoutNameText) this.layoutNameText.innerText = 'SaaS Dark';
    }
  }

  toggleLayoutTheme() {
    const isTotem = document.body.classList.toggle('theme-totem-kiosk');
    if (isTotem) {
      localStorage.setItem('azurra_fresqua_layout_theme', 'totem-kiosk');
      if (this.layoutNameText) this.layoutNameText.innerText = 'Totem Touch';
    } else {
      localStorage.setItem('azurra_fresqua_layout_theme', 'saas-dark');
      if (this.layoutNameText) this.layoutNameText.innerText = 'SaaS Dark';
    }
  }

  initCloudStatus() {
    this.initSupabaseUI();
  }

  initSupabaseUI() {
    const cfg = SUPABASE_CONFIG.getConfig();
    if (this.inputSupabaseUrl && cfg.url) {
      this.inputSupabaseUrl.value = cfg.url;
    }
    if (this.inputSupabaseKey && cfg.anonKey) {
      this.inputSupabaseKey.value = cfg.anonKey;
    }

    if (SUPABASE_CONFIG.isConfigured()) {
      if (this.cloudStatusIndicator) this.cloudStatusIndicator.innerText = '⚡';
      if (this.cloudStatusText) {
        this.cloudStatusText.innerText = 'Supabase Conectado';
        this.cloudStatusText.style.color = '#00f2fe';
      }
      if (this.supabaseStatusPill) {
        this.supabaseStatusPill.innerText = '🟢 Conectado ao Supabase';
        this.supabaseStatusPill.style.background = 'rgba(16, 185, 129, 0.2)';
        this.supabaseStatusPill.style.color = '#10b981';
      }
    } else {
      if (this.cloudStatusIndicator) this.cloudStatusIndicator.innerText = '⚪';
      if (this.cloudStatusText) {
        this.cloudStatusText.innerText = 'Supabase Desconectado';
        this.cloudStatusText.style.color = 'var(--text-secondary)';
      }
      if (this.supabaseStatusPill) {
        this.supabaseStatusPill.innerText = '⚪ Não configurado';
        this.supabaseStatusPill.style.background = 'rgba(148, 163, 184, 0.2)';
        this.supabaseStatusPill.style.color = 'var(--text-secondary)';
      }
    }
  }

  async initCloudSync() {
    // Sincronização em tempo real entre abas do navegador
    window.addEventListener('storage', () => {
      this.renderMetrics();
      this.renderLeadsTable();
    });

    window.addEventListener('supabase_config_updated', () => {
      this.initSupabaseUI();
    });

    // Sincronizar configurações da tela salvas na nuvem Supabase
    StorageManager.fetchPageConfigFromSupabase().catch(() => {});
  }

  bindEvents() {
    if (this.btnRefreshLeads) {
      this.btnRefreshLeads.addEventListener('click', () => this.loadLeadsFromSupabase(true));
    }

    if (this.btnToggleLayout) {
      this.btnToggleLayout.addEventListener('click', () => this.toggleLayoutTheme());
    }

    if (this.btnExportCSV) {
      this.btnExportCSV.addEventListener('click', () => StorageManager.exportToCSV());
    }

    if (this.btnShowQR) {
      this.btnShowQR.addEventListener('click', () => this.toggleQRModal(true));
    }

    if (this.btnCloseQRModal) {
      this.btnCloseQRModal.addEventListener('click', () => this.toggleQRModal(false));
    }

    if (this.qrModal) {
      this.qrModal.addEventListener('click', (e) => {
        if (e.target === this.qrModal) this.toggleQRModal(false);
      });
    }

    // Cloud Modal Events
    if (this.btnCloudConfig) {
      this.btnCloudConfig.addEventListener('click', () => this.toggleCloudModal(true));
    }

    if (this.btnCloseCloudModal) {
      this.btnCloseCloudModal.addEventListener('click', () => this.toggleCloudModal(false));
    }

    if (this.cloudModal) {
      this.cloudModal.addEventListener('click', (e) => {
        if (e.target === this.cloudModal) this.toggleCloudModal(false);
      });
    }

    // Abas do Modal de Banco de Dados
    if (this.tabBtnSupabase) {
      this.tabBtnSupabase.addEventListener('click', () => this.switchDbTab('supabase'));
    }
    if (this.tabBtnLocal) {
      this.tabBtnLocal.addEventListener('click', () => this.switchDbTab('local'));
    }

    // Ações Supabase
    if (this.btnTestSupabase) {
      this.btnTestSupabase.addEventListener('click', async () => {
        const url = this.inputSupabaseUrl?.value?.trim() || '';
        const key = this.inputSupabaseKey?.value?.trim() || '';
        if (!url || !key) {
          return alert('Por favor, informe a URL e a Anon Key do Supabase para testar.');
        }

        const originalText = this.btnTestSupabase.innerHTML;
        this.btnTestSupabase.innerHTML = '⏳ Testando...';
        this.btnTestSupabase.disabled = true;

        try {
          const res = await StorageManager.testSupabaseConnection(url, key);
          if (res.success) {
            this.showToast('✅ Conexão com Supabase validada com sucesso!');
            if (this.supabaseStatusPill) {
              this.supabaseStatusPill.innerText = '🟢 Conexão Ativa';
              this.supabaseStatusPill.style.background = 'rgba(16, 185, 129, 0.2)';
              this.supabaseStatusPill.style.color = '#10b981';
            }
          } else {
            alert('Erro ao testar conexão com Supabase:\n\n' + res.error);
            if (this.supabaseStatusPill) {
              this.supabaseStatusPill.innerText = '🔴 Erro de Conexão';
              this.supabaseStatusPill.style.background = 'rgba(239, 68, 68, 0.2)';
              this.supabaseStatusPill.style.color = '#ef4444';
            }
          }
        } catch (err) {
          alert('Falha no teste: ' + err.message);
        } finally {
          this.btnTestSupabase.innerHTML = originalText;
          this.btnTestSupabase.disabled = false;
        }
      });
    }

    if (this.btnSaveSupabase) {
      this.btnSaveSupabase.addEventListener('click', () => {
        const url = this.inputSupabaseUrl?.value?.trim() || '';
        const key = this.inputSupabaseKey?.value?.trim() || '';
        if (!url && !key) {
          if (!confirm('Deseja desativar a conexão com Supabase e manter apenas o banco local?')) {
            return;
          }
        }
        SUPABASE_CONFIG.saveConfig(url, key);
        this.initSupabaseUI();
        this.showToast('💾 Configurações do Supabase salvas com sucesso!');
        this.loadLeadsFromSupabase(true);
      });
    }

    if (this.btnSyncSupabase) {
      this.btnSyncSupabase.addEventListener('click', async () => {
        if (!SUPABASE_CONFIG.isConfigured()) {
          return alert('Configure e salve a URL e a Anon Key do Supabase antes de sincronizar.');
        }

        const originalText = this.btnSyncSupabase.innerHTML;
        this.btnSyncSupabase.innerHTML = '⏳ Sincronizando com Supabase...';
        this.btnSyncSupabase.disabled = true;

        try {
          const res = await StorageManager.syncWithSupabase();
          if (res.success) {
            this.renderMetrics();
            this.renderLeadsTable();
            this.showToast(`🚀 Sincronização concluída! ${res.uploaded} enviados, ${res.downloaded} baixados. Total: ${res.total} leads.`);
          } else {
            alert('Aviso ao sincronizar com Supabase:\n\n' + res.error);
          }
        } catch (err) {
          alert('Falha na sincronização: ' + err.message);
        } finally {
          this.btnSyncSupabase.innerHTML = originalText;
          this.btnSyncSupabase.disabled = false;
        }
      });
    }

    if (this.btnCopySupabaseSql) {
      this.btnCopySupabaseSql.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL).then(() => {
            this.showToast('📋 Script SQL copiado com sucesso! Cole no SQL Editor do Supabase.');
          }).catch(() => {
            prompt('Copie o código SQL abaixo e execute no SQL Editor do Supabase:', SUPABASE_SCHEMA_SQL);
          });
        } else {
          prompt('Copie o código SQL abaixo e execute no SQL Editor do Supabase:', SUPABASE_SCHEMA_SQL);
        }
      });
    }

    const triggerExcelDownload = () => {
      StorageManager.exportToExcel();
      this.showToast('📊 Planilha Excel (.xls) baixada com sucesso!');
    };

    const btnExportExcel = document.getElementById('btn-export-excel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', triggerExcelDownload);
    }

    const btnExportExcelModal = document.getElementById('btn-export-excel-modal');
    if (btnExportExcelModal) {
      btnExportExcelModal.addEventListener('click', triggerExcelDownload);
    }

    if (this.btnClearAllLeads) {
      this.btnClearAllLeads.addEventListener('click', () => {
        if (confirm('ATENÇÃO: Deseja apagar todos os leads do banco JSON local? Esta ação não pode ser desfeita.')) {
          StorageManager.clearAllLeads();
          this.renderMetrics();
          this.renderLeadsTable();
          this.showToast('🗑️ Todos os leads foram removidos!');
        }
      });
    }

    if (this.inputQRUrl) {
      this.inputQRUrl.addEventListener('input', (e) => {
        this.updateQRCodeImage(e.target.value);
      });
    }

    if (this.filterButtons) {
      this.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.dataset.status;
          this.renderLeadsTable();
        });
      });
    }

    if (this.inputSearchLead) {
      this.inputSearchLead.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderLeadsTable();
      });
    }

    // Customize Modal Events
    if (this.btnCustomizePage) {
      this.btnCustomizePage.addEventListener('click', () => this.toggleCustomizeModal(true));
    }

    if (this.btnCloseCustomizeModal) {
      this.btnCloseCustomizeModal.addEventListener('click', () => this.toggleCustomizeModal(false));
    }

    if (this.btnCancelCustomizePage) {
      this.btnCancelCustomizePage.addEventListener('click', () => this.toggleCustomizeModal(false));
    }

    if (this.customizeModal) {
      this.customizeModal.addEventListener('click', (e) => {
        if (e.target === this.customizeModal) this.toggleCustomizeModal(false);
      });
    }

    if (this.tabButtonsCustomize) {
      this.tabButtonsCustomize.forEach(btn => {
        btn.addEventListener('click', () => {
          this.tabButtonsCustomize.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const tabName = btn.dataset.tab;
          document.querySelectorAll('.customize-tab-content').forEach(c => c.style.display = 'none');
          const activeTab = document.getElementById(`tab-customize-${tabName}`);
          if (activeTab) activeTab.style.display = 'block';
        });
      });
    }

    if (this.btnAddFaqItem) {
      this.btnAddFaqItem.addEventListener('click', () => this.addFaqEditorItem());
    }

    if (this.btnSaveCustomizePage) {
      this.btnSaveCustomizePage.addEventListener('click', () => this.saveCustomizePage());
    }

    const chkHideStatsEl = document.getElementById('cfg-hide-stats');
    if (chkHideStatsEl) {
      chkHideStatsEl.addEventListener('change', (e) => {
        const wrapper = document.getElementById('stats-fields-wrapper');
        if (wrapper) wrapper.style.opacity = e.target.checked ? '0.4' : '1';
      });
    }

    if (this.btnResetCustomizePage) {
      this.btnResetCustomizePage.addEventListener('click', () => this.resetCustomizePage());
    }

    const subtabStepBtns = document.querySelectorAll('.btn-subtab-step');
    if (subtabStepBtns) {
      subtabStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          subtabStepBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const stepNum = btn.dataset.step;
          document.querySelectorAll('.step-config-body').forEach(c => c.style.display = 'none');
          const activeStepBody = document.getElementById(`step-config-${stepNum}`);
          if (activeStepBody) activeStepBody.style.display = 'block';
        });
      });
    }
  }

  toggleCloudModal(show) {
    if (this.cloudModal) {
      if (show) {
        this.cloudModal.classList.add('active');
        if (this.cloudTestStatus) this.cloudTestStatus.innerHTML = '';
      } else {
        this.cloudModal.classList.remove('active');
      }
    }
  }


  showToast(messageHtml) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #0f172a;
      border: 1px solid #00f2fe;
      box-shadow: 0 10px 30px rgba(0, 242, 254, 0.3);
      color: #f8fafc;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 0.9rem;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideInRight 0.3s ease-out;
    `;
    toast.innerHTML = `<span>⚡</span> <div>${messageHtml}</div>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  async loadLeadsFromSupabase(isManual = false) {
    if (!SUPABASE_CONFIG.isConfigured()) {
      StorageManager.clearAllLeads();
      this.renderMetrics();
      this.renderLeadsTable();
      if (isManual) {
        this.showToast('ℹ️ Supabase não configurado. Adicione suas credenciais no botão Banco.');
      }
      return;
    }

    if (this.btnRefreshLeads) {
      this.btnRefreshLeads.disabled = true;
      this.btnRefreshLeads.innerText = '⏳ Carregando...';
    }

    if (this.leadTableBody) {
      this.leadTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--accent-cyan); padding: 2.5rem;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.8rem;">⚡</span>
              <div style="font-weight: 600;">Carregando registros diretamente do Supabase...</div>
            </div>
          </td>
        </tr>
      `;
    }

    try {
      const leads = await StorageManager.fetchLeadsFromSupabase();
      this.renderMetrics();
      this.renderLeadsTable();
      if (isManual) {
        this.showToast(`✅ ${leads.length} lead(s) carregados do Supabase.`);
      }
    } catch (err) {
      this.renderMetrics();
      this.renderLeadsTable();
      this.showToast(`⚠️ Erro ao consultar Supabase: ${err.message}`);
    } finally {
      if (this.btnRefreshLeads) {
        this.btnRefreshLeads.disabled = false;
        this.btnRefreshLeads.innerText = '🔄 Atualizar Supabase';
      }
    }
  }

  renderMetrics() {
    const leads = StorageManager.getLeads();

    const total = leads.length;
    const hotLeads = leads.filter(l => l.status === 'hot').length;
    
    const avgScore = total > 0 
      ? Math.round(leads.reduce((acc, l) => acc + (l.score || 50), 0) / total) 
      : 0;

    if (this.metricTotalLeads) this.metricTotalLeads.innerText = total;
    if (this.metricHotLeads) this.metricHotLeads.innerText = hotLeads;
    if (this.metricAvgScore) this.metricAvgScore.innerText = `${avgScore}%`;
    if (this.metricTotalLoss) this.metricTotalLoss.innerText = `${hotLeads > 0 ? 'R$ 145k+' : 'R$ 0'}`;
  }

  renderLeadsTable() {
    if (!this.leadTableBody) return;
    let leads = StorageManager.getLeads();

    // Filter by status
    if (this.currentFilter !== 'all') {
      leads = leads.filter(l => l.status === this.currentFilter);
    }

    // Filter by search query
    if (this.searchQuery) {
      leads = leads.filter(l => 
        (l.name && l.name.toLowerCase().includes(this.searchQuery)) ||
        (l.company && l.company.toLowerCase().includes(this.searchQuery)) ||
        (l.whatsapp && l.whatsapp.includes(this.searchQuery))
      );
    }

    this.leadTableBody.innerHTML = '';

    if (leads.length === 0) {
      const isConnected = SUPABASE_CONFIG.isConfigured();
      this.leadTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-secondary);">
              ${isConnected ? 'Nenhum lead encontrado no banco Supabase.' : 'Supabase não configurado.'}
            </div>
            <div style="font-size: 0.85rem;">
              ${isConnected ? 'Assim que você preencher o formulário no stand, o lead será salvo diretamente na nuvem e aparecerá aqui.' : 'Clique em "Banco: Supabase" no menu para salvar suas credenciais.'}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    leads.forEach(lead => {
      const tr = document.createElement('tr');
      const timeAgo = this.formatTimeAgo(lead.timestamp);
      // Contact the lead's personal WhatsApp number
      const waUrl = StorageManager.getLeadWhatsAppLink(lead);

      const statusBadge = lead.status === 'hot'
        ? `<span class="badge-status hot">🔥 HOT / VIP</span>`
        : lead.status === 'warm'
        ? `<span class="badge-status warm">⚡ WARM</span>`
        : `<span class="badge-status cold">🌱 COLD</span>`;

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${lead.name || 'Sem nome'}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${lead.role || 'Visitante'}</div>
          ${lead.notes ? `<div style="font-size: 0.75rem; color: #38bdf8; margin-top: 0.25rem; font-style: italic; max-width: 220px;" title="${this.escapeHtml(lead.notes)}">📝 "${this.escapeHtml(lead.notes)}"</div>` : ''}
        </td>
        <td>
          <div style="font-weight: 600;">${lead.company || '-'}</div>
          <div style="font-size: 0.78rem; color: var(--accent-cyan);">${lead.segmentLabel || lead.segment || '-'}</div>
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600;">${lead.revenueLabel || '-'}</div>
        </td>
        <td>
          <div style="font-size: 1.1rem; font-weight: 800; color: ${lead.score < 60 ? '#ef4444' : '#00f2fe'};">${lead.score}%</div>
        </td>
        <td>${statusBadge}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${timeAgo}</td>
        <td>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <a href="${waUrl}" target="_blank" class="btn-whatsapp-action" title="Abordar este lead via WhatsApp">
              💬 Abordar
            </a>
            <button type="button" class="btn-delete-action" data-id="${lead.id}" data-name="${(lead.name || 'este lead').replace(/"/g, '&quot;')}" title="Apagar este lead">
              🗑️
            </button>
          </div>
        </td>
      `;

      this.leadTableBody.appendChild(tr);
    });

    // Eventos de clique para os botões de apagar lead
    this.leadTableBody.querySelectorAll('.btn-delete-action').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const name = btn.dataset.name || 'este lead';
        const confirmed = confirm(`Tem certeza que deseja apagar o lead "${name}"?\n\nEsta ação removerá o lead da lista e do banco de dados.`);
        if (confirmed) {
          btn.disabled = true;
          btn.innerText = '⏳';
          const res = await StorageManager.deleteLead(id);
          if (res.success) {
            this.showToast(`🗑️ Lead <strong>${name}</strong> foi apagado com sucesso.`);
            this.renderMetrics();
            this.renderLeadsTable();
          } else {
            alert('Não foi possível apagar o lead: ' + (res.message || 'Erro desconhecido'));
            btn.disabled = false;
            btn.innerText = '🗑️';
          }
        }
      });
    });
  }

  formatTimeAgo(isoString) {
    if (!isoString) return 'Agora mesmo';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    return `Há ${diffHours}h`;
  }

  toggleQRModal(show) {
    if (this.qrModal) {
      if (show) {
        this.qrModal.classList.add('active');
        // Point QR code to index.html (client page)
        let clientUrl = window.location.href.replace('admin.html', 'index.html');
        if (!clientUrl.includes('index.html')) {
          clientUrl = window.location.origin + '/index.html';
        }

        if (this.inputQRUrl && !this.inputQRUrl.value) {
          this.inputQRUrl.value = clientUrl;
        }
        this.updateQRCodeImage(this.inputQRUrl.value || clientUrl);
      } else {
        this.qrModal.classList.remove('active');
      }
    }
  }

  updateQRCodeImage(url) {
    if (!url) return;
    if (this.qrCodeImg) {
      const encoded = encodeURIComponent(url.trim());
      this.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=070c19&bgcolor=ffffff`;
    }
  }

  toggleCustomizeModal(show) {
    if (this.customizeModal) {
      if (show) {
        this.populateCustomizeForm();
        this.customizeModal.classList.add('active');
      } else {
        this.customizeModal.classList.remove('active');
      }
    }
  }

  populateCustomizeForm() {
    const config = StorageManager.getPageConfig();

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('cfg-brand-name', config.brandName);
    setVal('cfg-brand-tag', config.brandTag);
    setVal('cfg-badge-text', config.badgeText);
    setVal('cfg-hero-title', config.heroTitle);
    setVal('cfg-hero-subtitle', config.heroSubtitle);
    setVal('cfg-btn-start', config.btnStartText);
    setVal('cfg-hero-image', config.heroImage);

    // Stats (Ocultar / Tirar Estatísticas Hero)
    const chkHideStats = document.getElementById('cfg-hide-stats');
    const isStatsHidden = config.hideStats === true || config.statsEnabled === false;
    if (chkHideStats) chkHideStats.checked = isStatsHidden;
    const statsFieldsWrapper = document.getElementById('stats-fields-wrapper');
    if (statsFieldsWrapper) statsFieldsWrapper.style.opacity = isStatsHidden ? '0.4' : '1';

    if (config.stats && Array.isArray(config.stats)) {
      config.stats.forEach((st, i) => {
        setVal(`cfg-stat-num-${i}`, st.number);
        setVal(`cfg-stat-label-${i}`, st.label);
      });
    }

    // FAQ Settings
    const chkFaq = document.getElementById('cfg-faq-enabled');
    if (chkFaq) chkFaq.checked = config.faqEnabled !== false;
    setVal('cfg-faq-title', config.faqTitle);
    setVal('cfg-faq-subtitle', config.faqSubtitle);

    // FAQ Items
    this.renderFaqEditorItems(config.faqs || []);

    // Steps 1 to 4 Settings
    const steps = config.steps || {};
    const s1 = steps.step1 || {};
    setVal('cfg-step1-title', s1.title);
    setVal('cfg-step1-subtitle', s1.subtitle);
    setVal('cfg-step1-q1-label', s1.questionSegmentLabel);
    setVal('cfg-step1-q2-label', s1.questionRevenueLabel);
    this.renderSegmentsEditor(s1.segments || []);
    this.renderRevenuesEditor(s1.revenues || []);

    const s2 = steps.step2 || {};
    setVal('cfg-step2-title', s2.title);
    setVal('cfg-step2-subtitle', s2.subtitle);
    setVal('cfg-step2-instruction', s2.instructionLabel);
    this.renderPainsEditor(s2.pains || []);

    const s3 = steps.step3 || {};
    setVal('cfg-step3-title', s3.title);
    setVal('cfg-step3-subtitle', s3.subtitle);
    setVal('cfg-step3-q1-label', s3.questionCurrentSystemLabel);
    setVal('cfg-step3-q2-label', s3.questionUrgencyLabel);
    this.renderSystemsEditor(s3.currentSystems || []);
    this.renderUrgenciesEditor(s3.urgencies || []);

    const s4 = steps.step4 || {};
    setVal('cfg-step4-title', s4.title);
    setVal('cfg-step4-subtitle', s4.subtitle);
    setVal('cfg-step4-name-label', s4.nameLabel);
    setVal('cfg-step4-name-ph', s4.namePlaceholder);
    setVal('cfg-step4-zap-label', s4.whatsappLabel);
    setVal('cfg-step4-zap-ph', s4.whatsappPlaceholder);
    setVal('cfg-step4-company-label', s4.companyLabel);
    setVal('cfg-step4-company-ph', s4.companyPlaceholder);
    setVal('cfg-step4-role-label', s4.roleLabel);
    setVal('cfg-step4-role-ph', s4.rolePlaceholder);
    setVal('cfg-step4-email-label', s4.emailLabel);
    setVal('cfg-step4-email-ph', s4.emailPlaceholder);
    setVal('cfg-step4-notes-label', s4.notesLabel);
    setVal('cfg-step4-notes-ph', s4.notesPlaceholder);

    // Result Screen Settings
    const res = config.resultScreen || {};
    setVal('cfg-result-offer-desc', res.offerDesc);
    setVal('cfg-result-btn-whatsapp', res.btnWhatsappText);
  }

  renderFaqEditorItems(faqs) {
    if (!this.faqItemsContainer) return;
    this.faqItemsContainer.innerHTML = '';

    if (faqs.length === 0) {
      this.faqItemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.85rem;">
          Nenhuma pergunta cadastrada. Clique em "➕ Adicionar Pergunta" acima.
        </div>
      `;
      return;
    }

    faqs.forEach((faq, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'faq-editor-item';
      itemEl.dataset.id = faq.id || `faq-${index}-${Date.now()}`;
      itemEl.innerHTML = `
        <div class="faq-editor-item-header">
          <span class="faq-editor-title">Pergunta ${index + 1}</span>
          <button type="button" class="btn-delete-faq" title="Apagar esta pergunta">🗑️ Apagar</button>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <input type="text" class="form-input faq-question-input" style="font-size: 0.85rem; padding: 0.45rem 0.75rem;" placeholder="Pergunta" value="${this.escapeHtml(faq.question || '')}">
        </div>
        <div>
          <textarea class="form-input faq-answer-input" rows="2" style="font-size: 0.85rem; padding: 0.45rem 0.75rem;" placeholder="Resposta">${this.escapeHtml(faq.answer || '')}</textarea>
        </div>
      `;

      itemEl.querySelector('.btn-delete-faq').addEventListener('click', () => {
        itemEl.remove();
        if (this.faqItemsContainer.children.length === 0) {
          this.renderFaqEditorItems([]);
        }
      });

      this.faqItemsContainer.appendChild(itemEl);
    });
  }

  addFaqEditorItem() {
    if (!this.faqItemsContainer) return;
    
    // Remove empty notice if present
    const emptyNotice = this.faqItemsContainer.querySelector('div[style*="text-align: center"]');
    if (emptyNotice) emptyNotice.remove();

    const newIndex = this.faqItemsContainer.querySelectorAll('.faq-editor-item').length + 1;
    const itemEl = document.createElement('div');
    itemEl.className = 'faq-editor-item';
    itemEl.dataset.id = `faq-new-${Date.now()}`;
    itemEl.innerHTML = `
      <div class="faq-editor-item-header">
        <span class="faq-editor-title">Pergunta ${newIndex}</span>
        <button type="button" class="btn-delete-faq" title="Apagar esta pergunta">🗑️ Apagar</button>
      </div>
      <div style="margin-bottom: 0.5rem;">
        <input type="text" class="form-input faq-question-input" style="font-size: 0.85rem; padding: 0.45rem 0.75rem;" placeholder="Digite a nova pergunta..." value="">
      </div>
      <div>
        <textarea class="form-input faq-answer-input" rows="2" style="font-size: 0.85rem; padding: 0.45rem 0.75rem;" placeholder="Digite a resposta detalhada..."></textarea>
      </div>
    `;

    itemEl.querySelector('.btn-delete-faq').addEventListener('click', () => {
      itemEl.remove();
    });

    this.faqItemsContainer.appendChild(itemEl);
    itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  renderSegmentsEditor(segments) {
    const container = document.getElementById('editor-segments-container');
    if (!container) return;
    container.innerHTML = '';
    segments.forEach((seg) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: grid; grid-template-columns: 50px 1fr 1.5fr; gap: 0.5rem; background: rgba(255,255,255,0.02); padding: 0.4rem; border-radius: 6px; align-items: center; margin-bottom: 0.3rem;';
      row.dataset.value = seg.value;
      row.innerHTML = `
        <input type="text" class="form-input seg-icon" style="font-size: 0.85rem; text-align: center; padding: 0.35rem;" value="${this.escapeHtml(seg.icon || '🛍️')}">
        <input type="text" class="form-input seg-title" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(seg.title || '')}" placeholder="Título">
        <input type="text" class="form-input seg-desc" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(seg.desc || '')}" placeholder="Descrição">
      `;
      container.appendChild(row);
    });
  }

  renderRevenuesEditor(revenues) {
    const container = document.getElementById('editor-revenues-container');
    if (!container) return;
    container.innerHTML = '';
    revenues.forEach((rev) => {
      const row = document.createElement('div');
      row.style.cssText = 'background: rgba(255,255,255,0.02); padding: 0.4rem; border-radius: 6px; margin-bottom: 0.3rem;';
      row.dataset.value = rev.value;
      row.innerHTML = `
        <input type="text" class="form-input rev-title" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(rev.title || '')}" placeholder="Título do faturamento">
      `;
      container.appendChild(row);
    });
  }

  renderPainsEditor(pains) {
    const container = document.getElementById('editor-pains-container');
    if (!container) return;
    container.innerHTML = '';
    pains.forEach((p) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: grid; grid-template-columns: 50px 1fr 1.5fr; gap: 0.5rem; background: rgba(255,255,255,0.02); padding: 0.4rem; border-radius: 6px; align-items: center; margin-bottom: 0.3rem;';
      row.dataset.value = p.value;
      row.innerHTML = `
        <input type="text" class="form-input pain-icon" style="font-size: 0.85rem; text-align: center; padding: 0.35rem;" value="${this.escapeHtml(p.icon || '📦')}">
        <input type="text" class="form-input pain-title" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(p.title || '')}" placeholder="Título da dor">
        <input type="text" class="form-input pain-desc" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(p.desc || '')}" placeholder="Descrição da dor">
      `;
      container.appendChild(row);
    });
  }

  renderSystemsEditor(systems) {
    const container = document.getElementById('editor-systems-container');
    if (!container) return;
    container.innerHTML = '';
    systems.forEach((sys) => {
      const row = document.createElement('div');
      row.style.cssText = 'background: rgba(255,255,255,0.02); padding: 0.4rem; border-radius: 6px; margin-bottom: 0.3rem;';
      row.dataset.value = sys.value;
      row.innerHTML = `
        <input type="text" class="form-input sys-title" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(sys.title || '')}" placeholder="Sistema atual">
      `;
      container.appendChild(row);
    });
  }

  renderUrgenciesEditor(urgencies) {
    const container = document.getElementById('editor-urgencies-container');
    if (!container) return;
    container.innerHTML = '';
    urgencies.forEach((urg) => {
      const row = document.createElement('div');
      row.style.cssText = 'background: rgba(255,255,255,0.02); padding: 0.4rem; border-radius: 6px; margin-bottom: 0.3rem;';
      row.dataset.value = urg.value;
      row.innerHTML = `
        <input type="text" class="form-input urg-title" style="font-size: 0.85rem; padding: 0.35rem;" value="${this.escapeHtml(urg.title || '')}" placeholder="Prazo de urgência">
      `;
      container.appendChild(row);
    });
  }

  async saveCustomizePage() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    // Build Stats array
    const stats = [];
    for (let i = 0; i < 3; i++) {
      stats.push({
        number: getVal(`cfg-stat-num-${i}`),
        label: getVal(`cfg-stat-label-${i}`)
      });
    }

    // Build FAQ array from DOM editor
    const faqs = [];
    if (this.faqItemsContainer) {
      const items = this.faqItemsContainer.querySelectorAll('.faq-editor-item');
      items.forEach((item, index) => {
        const qInput = item.querySelector('.faq-question-input');
        const aInput = item.querySelector('.faq-answer-input');
        const qText = qInput ? qInput.value.trim() : '';
        const aText = aInput ? aInput.value.trim() : '';

        if (qText || aText) {
          faqs.push({
            id: item.dataset.id || `faq-${index}-${Date.now()}`,
            question: qText,
            answer: aText
          });
        }
      });
    }

    // Extract Steps Configs
    const segments = [];
    document.querySelectorAll('#editor-segments-container > div').forEach(row => {
      segments.push({
        value: row.dataset.value,
        icon: row.querySelector('.seg-icon')?.value.trim() || '🛍️',
        title: row.querySelector('.seg-title')?.value.trim() || '',
        label: row.querySelector('.seg-title')?.value.trim() || '',
        desc: row.querySelector('.seg-desc')?.value.trim() || ''
      });
    });

    const revenues = [];
    document.querySelectorAll('#editor-revenues-container > div').forEach(row => {
      revenues.push({
        value: row.dataset.value,
        title: row.querySelector('.rev-title')?.value.trim() || '',
        label: row.querySelector('.rev-title')?.value.trim() || ''
      });
    });

    const pains = [];
    document.querySelectorAll('#editor-pains-container > div').forEach(row => {
      pains.push({
        value: row.dataset.value,
        icon: row.querySelector('.pain-icon')?.value.trim() || '📦',
        title: row.querySelector('.pain-title')?.value.trim() || '',
        desc: row.querySelector('.pain-desc')?.value.trim() || ''
      });
    });

    const currentSystems = [];
    document.querySelectorAll('#editor-systems-container > div').forEach(row => {
      currentSystems.push({
        value: row.dataset.value,
        title: row.querySelector('.sys-title')?.value.trim() || '',
        label: row.querySelector('.sys-title')?.value.trim() || ''
      });
    });

    const urgencies = [];
    document.querySelectorAll('#editor-urgencies-container > div').forEach(row => {
      urgencies.push({
        value: row.dataset.value,
        title: row.querySelector('.urg-title')?.value.trim() || '',
        label: row.querySelector('.urg-title')?.value.trim() || ''
      });
    });

    const steps = {
      step1: {
        title: getVal('cfg-step1-title'),
        subtitle: getVal('cfg-step1-subtitle'),
        questionSegmentLabel: getVal('cfg-step1-q1-label'),
        segments,
        questionRevenueLabel: getVal('cfg-step1-q2-label'),
        revenues
      },
      step2: {
        title: getVal('cfg-step2-title'),
        subtitle: getVal('cfg-step2-subtitle'),
        instructionLabel: getVal('cfg-step2-instruction'),
        pains
      },
      step3: {
        title: getVal('cfg-step3-title'),
        subtitle: getVal('cfg-step3-subtitle'),
        questionCurrentSystemLabel: getVal('cfg-step3-q1-label'),
        currentSystems,
        questionUrgencyLabel: getVal('cfg-step3-q2-label'),
        urgencies
      },
      step4: {
        title: getVal('cfg-step4-title'),
        subtitle: getVal('cfg-step4-subtitle'),
        nameLabel: getVal('cfg-step4-name-label'),
        namePlaceholder: getVal('cfg-step4-name-ph'),
        whatsappLabel: getVal('cfg-step4-zap-label'),
        whatsappPlaceholder: getVal('cfg-step4-zap-ph'),
        companyLabel: getVal('cfg-step4-company-label'),
        companyPlaceholder: getVal('cfg-step4-company-ph'),
        roleLabel: getVal('cfg-step4-role-label'),
        rolePlaceholder: getVal('cfg-step4-role-ph'),
        emailLabel: getVal('cfg-step4-email-label'),
        emailPlaceholder: getVal('cfg-step4-email-ph'),
        notesLabel: getVal('cfg-step4-notes-label'),
        notesPlaceholder: getVal('cfg-step4-notes-ph')
      }
    };

    const chkHideStats = document.getElementById('cfg-hide-stats');
    const hideStats = chkHideStats ? chkHideStats.checked : false;
    const chkFaq = document.getElementById('cfg-faq-enabled');

    const resultScreen = {
      offerDesc: getVal('cfg-result-offer-desc'),
      btnWhatsappText: getVal('cfg-result-btn-whatsapp')
    };

    const newConfig = {
      brandName: getVal('cfg-brand-name'),
      brandTag: getVal('cfg-brand-tag'),
      badgeText: getVal('cfg-badge-text'),
      heroTitle: getVal('cfg-hero-title'),
      heroSubtitle: getVal('cfg-hero-subtitle'),
      btnStartText: getVal('cfg-btn-start'),
      heroImage: getVal('cfg-hero-image'),
      hideStats: hideStats,
      statsEnabled: !hideStats,
      stats,
      faqEnabled: chkFaq ? chkFaq.checked : true,
      faqTitle: getVal('cfg-faq-title'),
      faqSubtitle: getVal('cfg-faq-subtitle'),
      faqs,
      steps,
      resultScreen
    };

    await StorageManager.savePageConfig(newConfig);
    this.toggleCustomizeModal(false);
    this.showToast('✅ Tela de captura atualizada e sincronizada com a nuvem!');
  }

  resetCustomizePage() {
    if (confirm('Tem certeza que deseja restaurar as configurações originais da tela de captura?')) {
      StorageManager.resetPageConfig();
      this.populateCustomizeForm();
      this.showToast('🔄 Configurações da tela de captura restauradas!');
    }
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dashboardController = new DashboardController();
});
