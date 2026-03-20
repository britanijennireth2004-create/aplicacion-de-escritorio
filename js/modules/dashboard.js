/**
 * Módulo Dashboard - Vista principal mejorada
 */

// SVG ICONS DEFINITIONS
const icons = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><rect x="2.25" y="3.75" width="15.5" height="14" rx="2.25" stroke="var(--muted)" stroke-width="1.5"/><path stroke="var(--muted)" stroke-width="1.5" d="M6 1.75v3.5M14 1.75v3.5"/><path stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" d="M2 7.5h16"/></svg>`,
  clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><rect x="4.25" y="3.75" width="11.5" height="14" rx="2.25" stroke="#ea4632" stroke-width="1.5"/><rect x="6.75" y="2" width="6.5" height="3.5" rx="1.25" stroke="#ea4632" stroke-width="1.5"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="7" r="4" stroke="var(--muted)" stroke-width="1.5"/><path stroke="var(--muted)" stroke-width="1.5" d="M3.75 17A6.25 6.25 0 0116.25 17"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5" stroke="#888" stroke-width="1.5"/><path stroke="#888" stroke-width="1.5" d="M10 1.75v2.5M10 15.75v2.5M3.64 3.64l1.77 1.77M14.59 14.59l1.77 1.77M1.75 10h2.5M15.75 10h2.5M3.64 16.36l1.77-1.77M14.59 5.41l1.77-1.77"/></svg>`,
  doctor: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="6" r="4" stroke="var(--muted)" stroke-width="1.5"/><path stroke="var(--muted)" stroke-width="1.5" d="M3.5 18c0-3.037 2.486-5.5 6.5-5.5s6.5 2.463 6.5 5.5"/></svg>`,
  patient: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="7" r="4" stroke="#38a169" stroke-width="1.5"/><path stroke="#38a169" stroke-width="1.5" d="M3.75 17A6.25 6.25 0 0116.25 17"/></svg>`,
  area: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" fill="none" viewBox="0 0 20 20"><rect x="2.25" y="4.25" width="15.5" height="10.5" rx="1.75" stroke="#d69e2e" stroke-width="1.5"/><path stroke="#d69e2e" stroke-width="1.5" d="M6.5 15.75V17a1.5 1.5 0 001.5 1.5h4a1.5 1.5 0 001.5-1.5v-1.25"/></svg>`,
  successCheck: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#38a169" stroke-width="2"/><path stroke="#38a169" stroke-width="2" d="M6 10.5l2.5 2 5-5"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><path stroke="var(--muted)" stroke-width="1.5" d="M10 3v8"/><circle cx="10" cy="15" r="1" fill="var(--muted)"/><circle cx="10" cy="10" r="9" stroke="var(--muted)" stroke-width="1.5"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#249" stroke-width="2"/><path stroke="#249" stroke-width="2" d="M10 7v5"/><circle cx="10" cy="14" r="1" fill="#249"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  triaje: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  history: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

export function mount(root, { bus, store, user, role }) {
  const state = {
    stats: {},
    chartData: [],
    isLoading: true
  };

  function render() {
    root.innerHTML = `
      <div class="module-dashboard">
        <!-- Acciones Principales -->
        <div class="center-actions-container">
          <div class="section-header centered">
            <h2 class="section-title">¿Qué deseas hacer hoy?</h2>
            <span class="text-muted text-sm">Selecciona una tarea para comenzar</span>
          </div>
          
          <div class="quick-actions-grid minimalist">
            <button class="quick-action-btn-clean" data-nav="patients">
              <div class="quick-action-icon-clean">${icons.patient}</div>
              <div class="quick-action-info">
                <span class="action-name">Pacientes</span>
                <span class="action-desc">Registrar y validar identidad</span>
              </div>
            </button>

            <button class="quick-action-btn-clean" data-nav="appointments">
              <div class="quick-action-icon-clean">${icons.calendar}</div>
              <div class="quick-action-info">
                <span class="action-name">Agenda</span>
                <span class="action-desc">Citas y programación</span>
              </div>
            </button>

            <button class="quick-action-btn-clean" data-nav="triaje">
              <div class="quick-action-icon-clean">${icons.triaje}</div>
              <div class="quick-action-info">
                <span class="action-name">Triaje</span>
                <span class="action-desc">Signos vitales y urgencia</span>
              </div>
            </button>

            <button class="quick-action-btn-clean" data-nav="clinical">
              <div class="quick-action-icon-clean">${icons.history}</div>
              <div class="quick-action-info">
                <span class="action-name">Historial</span>
                <span class="action-desc">Consultar registros previos</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
    loadData();

    // Listeners para acciones rápidas
    root.querySelectorAll('[data-nav]').forEach(btn => {
      btn.onclick = () => {
        const routeId = btn.dataset.nav;
        bus.emit('app:navigate', routeId);
      };
    });
  }

  async function loadData() {
    state.isLoading = true;
    try {
      await loadStats();
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      state.isLoading = false;
    }
  }

  async function loadStats() {
    const appointments = store.get('appointments') || [];
    const patients = store.get('patients') || [];
    const doctors = store.get('doctors') || [];
    const areas = store.get('areas') || [];
    const triajeRecords = store.get('triaje') || [];

    let filteredAppointments = appointments;
    if (role === 'patient' && user.patientId) {
      filteredAppointments = appointments.filter(a => a.patientId === user.patientId);
    } else if (role === 'doctor' && user.doctorId) {
      filteredAppointments = appointments.filter(a => a.doctorId === user.doctorId);
    }

    state.stats = {
      totalAppointments: filteredAppointments.length,
      todayAppointments: filteredAppointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length,
      upcomingAppointments: filteredAppointments.filter(a => {
        const appointmentDate = new Date(a.dateTime);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return appointmentDate >= today && appointmentDate <= nextWeek && a.status === 'scheduled';
      }).length,
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalAreas: areas.length,
      pendingAppointments: filteredAppointments.filter(a => a.status === 'scheduled').length,
      completedAppointments: filteredAppointments.filter(a => a.status === 'completed').length,
      triajePending: triajeRecords.filter(t => t.status === 'waiting').length
    };
  }


  function renderStats() {
    const container = root.querySelector('#stats-summary-bar');
    if (!container) return;
    const { stats } = state;
    container.innerHTML = `
      <div class="summary-item">
        <span class="summary-val">${stats.todayAppointments}</span>
        <span class="summary-lab">CITAS HOY</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <span class="summary-val">${stats.triajePending}</span>
        <span class="summary-lab">TRIAJES</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <span class="summary-val">${stats.totalPatients}</span>
        <span class="summary-lab">PACIENTES</span>
      </div>
    `;
  }

  const unsubscribe = store.subscribe('appointments', loadData);
  render();

  return { refresh: loadData, destroy() { if (unsubscribe) unsubscribe(); } };
}
