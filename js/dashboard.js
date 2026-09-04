/**
 * AzurraERP Lead Capture - Booth Team Dashboard Controller
 */

import { StorageManager } from './storage.js';
import { CLOUD_CONFIG } from './config.js';

export class DashboardController {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.initElements();
    this.initLayoutTheme();
    this.initCloudStatus();
    this.bindEvents();
    this.initCloudSync();
  }

  initElements() {
    this.dashboardView = document.getElementById('dashboard-view');
    this.leadTableBody = document.getElementById('lead-table-body');

    this.metricTotalLeads = document.getElementById('metric-total-leads');
    this.metricHotLeads = document.getElementById('metric-hot-leads');
    this.metricAvgScore = document.getElementById('metric-avg-score');
    this.metricTotalLoss = document.getElementById('metric-total-loss');

    this.btnExportCSV = document.getElementById('btn-export-csv');
    this.btnShowQR = document.getElementById('btn-show-qr');
    this.qrModal = document.getElementById('qr-modal');
    this.btnCloseQRModal = document.getElementById('btn-close-qr-modal');

    this.btnToggleLayout = document.getElementById('btn-toggle-layout');
    this.layoutNameText = document.getElementById('layout-name-text');

    // Cloud Modal & Elements
    this.btnCloudConfig = document.getElementById('btn-cloud-config');
    this.cloudStatusIndicator = document.getElementById('cloud-status-indicator');
    this.cloudStatusText = document.getElementById('cloud-status-text');
    this.cloudModal = document.getElementById('cloud-modal');
    this.btnCloseCloudModal = document.getElementById('btn-close-cloud-modal');
    this.inputSupabaseUrl = document.getElementById('input-supabase-url');
    this.inputSupabaseKey = document.getElementById('input-supabase-key');
    this.btnSaveCloud = document.getElementById('btn-save-cloud');
    this.btnClearCloud = document.getElementById('btn-clear-cloud');
    this.btnSyncNow = document.getElementById('btn-sync-now');
    this.btnCopySql = document.getElementById('btn-copy-sql');
    this.cloudTestStatus = document.getElementById('cloud-test-status');
    this.toastContainer = document.getElementById('toast-container');

    this.filterButtons = document.querySelectorAll('.btn-filter-status');
    this.inputSearchLead = document.getElementById('input-search-lead');
    this.inputQRUrl = document.getElementById('input-qr-url');
    this.qrCodeImg = document.getElementById('qr-code-img');

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
    const isConfigured = CLOUD_CONFIG.isConfigured();
    if (this.cloudStatusIndicator && this.cloudStatusText) {
      if (isConfigured) {
        this.cloudStatusIndicator.innerText = '🟢';
        this.cloudStatusText.innerText = 'Nuvem Ativa';
        this.cloudStatusText.style.color = '#10b981';
      } else {
        this.cloudStatusIndicator.innerText = '🟡';
        this.cloudStatusText.innerText = 'Modo Local';
        this.cloudStatusText.style.color = '#f59e0b';
      }
    }

    if (this.inputSupabaseUrl && CLOUD_CONFIG.supabaseUrl) {
      this.inputSupabaseUrl.value = CLOUD_CONFIG.supabaseUrl;
    }
    if (this.inputSupabaseKey && CLOUD_CONFIG.supabaseAnonKey) {
      this.inputSupabaseKey.value = CLOUD_CONFIG.supabaseAnonKey;
    }
  }

  async initCloudSync() {
    if (CLOUD_CONFIG.isConfigured()) {
      // 1. Busca todos os leads já gravados na nuvem
      console.log('📡 Buscando leads atualizados na nuvem...');
      const freshLeads = await StorageManager.fetchCloudLeads();
      this.renderMetrics();
      this.renderLeadsTable();

      // 2. Ouve novos leads e exclusões em tempo real
      StorageManager.subscribeToLeads(
        (newLead) => {
          this.showToast(`🔥 Novo Lead do Celular: <strong>${newLead.name || 'Novo contato'}</strong> (${newLead.company || 'Empresa'})!`);
          this.renderMetrics();
          this.renderLeadsTable();
        },
        (deletedId) => {
          this.renderMetrics();
          this.renderLeadsTable();
        }
      );
    }
  }

  bindEvents() {
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

    if (this.btnCopySql) {
      this.btnCopySql.addEventListener('click', () => {
        const sqlText = document.getElementById('sql-code-block').innerText;
        navigator.clipboard.writeText(sqlText);
        this.btnCopySql.innerText = '✅ Copiado!';
        setTimeout(() => { this.btnCopySql.innerText = '📋 Copiar SQL'; }, 2000);
      });
    }

    if (this.btnSaveCloud) {
      this.btnSaveCloud.addEventListener('click', () => this.handleSaveCloud());
    }

    if (this.btnClearCloud) {
      this.btnClearCloud.addEventListener('click', () => this.handleClearCloud());
    }

    if (this.btnSyncNow) {
      this.btnSyncNow.addEventListener('click', () => this.handleSyncLocalToCloud());
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

  async handleSaveCloud() {
    const url = (this.inputSupabaseUrl?.value || '').trim();
    const key = (this.inputSupabaseKey?.value || '').trim();

    if (!url || !key) {
      this.setCloudStatusMessage('Por favor, informe a URL do projeto e a chave API (anon).', '#ef4444');
      return;
    }

    this.setCloudStatusMessage('Testando conexão com o Supabase...', '#00f2fe');

    const result = await StorageManager.testCloudConnection(url, key);
    if (result.success) {
      CLOUD_CONFIG.save(url, key);
      this.initCloudStatus();
      this.setCloudStatusMessage('✅ ' + result.message, '#10b981');
      this.showToast('Nuvem Supabase conectada com sucesso! Atualizando leads...');
      await this.initCloudSync();
      setTimeout(() => this.toggleCloudModal(false), 1500);
    } else {
      this.setCloudStatusMessage('❌ ' + result.message, '#ef4444');
    }
  }

  handleClearCloud() {
    if (confirm('Deseja realmente desconectar a sincronização em nuvem e voltar ao modo local?')) {
      CLOUD_CONFIG.clear();
      this.initCloudStatus();
      if (this.inputSupabaseUrl) this.inputSupabaseUrl.value = '';
      if (this.inputSupabaseKey) this.inputSupabaseKey.value = '';
      this.setCloudStatusMessage('Nuvem desconectada. Operando em Modo Local.', '#f59e0b');
      this.showToast('Operando em modo local');
    }
  }

  async handleSyncLocalToCloud() {
    if (!CLOUD_CONFIG.isConfigured()) {
      this.setCloudStatusMessage('Conecte a nuvem primeiro para enviar os leads locais.', '#f59e0b');
      return;
    }
    this.setCloudStatusMessage('Enviando leads locais para o Supabase...', '#00f2fe');
    try {
      const count = await StorageManager.syncLocalToCloud();
      this.setCloudStatusMessage(`✅ ${count} leads enviados para a nuvem com sucesso!`, '#10b981');
      this.showToast(`${count} leads sincronizados com o Supabase!`);
    } catch (err) {
      this.setCloudStatusMessage(`Erro ao sincronizar: ${err.message}`, '#ef4444');
    }
  }

  setCloudStatusMessage(msg, color) {
    if (this.cloudTestStatus) {
      this.cloudTestStatus.innerHTML = `<span style="color: ${color}; font-weight: 600;">${msg}</span>`;
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
      this.leadTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            Nenhum lead encontrado com os filtros atuais.
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.dashboardController = new DashboardController();
});
