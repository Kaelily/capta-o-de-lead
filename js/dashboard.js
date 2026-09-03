/**
 * AzurraERP Lead Capture - Booth Team Dashboard Controller
 */

import { StorageManager } from './storage.js';

export class DashboardController {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.initElements();
    this.initLayoutTheme();
    this.bindEvents();
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
          <a href="${waUrl}" target="_blank" class="btn-whatsapp-action">
            💬 Abordar Lead
          </a>
        </td>
      `;

      this.leadTableBody.appendChild(tr);
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
