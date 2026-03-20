// Terminal de Recepción - Main Entry Point (100% Fiel a la Versión Web)
import { createBus } from './core/bus.js';
import { createStore } from './core/store.js';
import { ICONS } from './icons.js';
import { Logger } from './utils/logger.js';

window.ICONS = ICONS;

const APP_STATE = {
  bus: null,
  store: null,
  user: null,
  role: 'receptionist',
  currentModule: null,
  modules: {}
};

// ===== UI HELPERS (Fieles al 100%) =====
window.hospitalAlert = function (message, type = 'info') {
  return new Promise(resolve => {
    const existing = document.getElementById('hospital-alert');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'hospital-alert';
    modal.className = 'hospital-modal-overlay';

    const config = {
      info: { color: 'var(--blue)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>` },
      error: { color: 'var(--red)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
      success: { color: 'var(--tealLight)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--tealLight)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` },
      warning: { color: 'var(--yellowDark)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--yellowDark)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` }
    };

    const s = config[type] || config.info;

    modal.innerHTML = `
      <div class="hospital-modal-content">
        <div style="padding: 3rem 2rem 2.5rem; text-align: center;">
          <div style="margin-bottom: 1.5rem; display: flex; justify-content: center; transform: scale(1.1);">${s.icon}</div>
          <div style="font-size: 1.15rem; color: #1e293b; line-height: 1.6; font-weight: 600; padding: 0 1rem;">${message}</div>
        </div>
        <div style="padding: 1.5rem; display: flex; justify-content: center; background: #f8fafc; border-top: 1px solid #f1f5f9;">
          <button id="hospital-alert-btn" style="background: ${s.color}; border: none; padding: 0.85rem 4rem; font-weight: 800; border-radius: 12px; cursor: pointer; color: white; font-size: 0.95rem; transition: all 0.2s; box-shadow: 0 4px 12px ${s.color}44;">ENTENDIDO</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const btn = modal.querySelector('#hospital-alert-btn');
    const content = modal.querySelector('.hospital-modal-content');

    const close = () => {
      content.classList.add('hospital-modal-close-anim');
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.2s ease-in';
      setTimeout(() => { modal.remove(); resolve(true); }, 200);
    };

    btn.focus();
    btn.onclick = close;
  });
};

window.hospitalConfirm = function (message, type = 'warning') {
  return new Promise(resolve => {
    const existing = document.getElementById('hospital-confirm');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'hospital-confirm';
    modal.className = 'hospital-modal-overlay';

    const config = {
      warning: { color: 'var(--yellowDark)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--yellowDark)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
      danger: { color: 'var(--red)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
      question: { color: 'var(--blue)', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` }
    };

    const s = config[type] || config.warning;

    modal.innerHTML = `
      <div class="hospital-modal-content">
        <div style="padding: 3rem 2rem 2.5rem; text-align: center;">
          <div style="margin-bottom: 1.5rem; display: flex; justify-content: center; transform: scale(1.1);">${s.icon}</div>
          <div style="font-size: 1.15rem; color: #1e293b; line-height: 1.6; font-weight: 600; padding: 0 1rem;">${message}</div>
        </div>
        <div style="padding: 1.5rem; display: flex; justify-content: center; background: #f8fafc; border-top: 1px solid #f1f5f9; gap: 1rem;">
          <button id="hc-cancel" class="btn" style="flex: 1; padding: 0.85rem; font-weight: 700; border-radius: 12px; cursor: pointer; color: #64748b; background: white; border: 2px solid #e2e8f0; font-size: 0.95rem; transition: all 0.2s;">CANCELAR</button>
          <button id="hc-ok" class="btn" style="flex: 1.5; background: var(--red); border: none; padding: 0.85rem; font-weight: 800; border-radius: 12px; cursor: pointer; color: white; font-size: 0.95rem; transition: all 0.2s; box-shadow: 0 4px 12px ${s.color}44;">CONFIRMAR</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const content = modal.querySelector('.hospital-modal-content');

    const finish = (result) => {
      content.classList.add('hospital-modal-close-anim');
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.2s ease-in';
      setTimeout(() => { modal.remove(); resolve(result); }, 200);
    };

    modal.querySelector('#hc-ok').onclick = () => finish(true);
    modal.querySelector('#hc-cancel').onclick = () => finish(false);
    modal.querySelector('#hc-ok').focus();
  });
};

window.hospitalFieldValidation = {
  show: function (field, message) {
    this.clear(field);
    if (!field) return;
    const parent = field.parentNode;
    if (parent && window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    field.classList.add('error-field');
    const errorMsg = document.createElement('span');
    errorMsg.className = 'error-field-msg';
    errorMsg.innerHTML = message;
    field.parentNode.appendChild(errorMsg);
  },
  clear: function (field) {
    if (!field) return;
    field.classList.remove('error-field');
    field.classList.remove('error');
    const prevMsg = field.parentNode.querySelector('.error-field-msg');
    if (prevMsg) prevMsg.remove();
  },
  clearAll: function (container) {
    const fields = container.querySelectorAll('.error-field, .error');
    fields.forEach(f => this.clear(f));
    container.querySelectorAll('.error-field-msg').forEach(m => m.remove());
  }
};

window.alert = (msg, type) => window.hospitalAlert(msg, type);

// ===== SISTEMA DE ROUTING (Fiel a la Versión Web para Recepcionista) =====
const ROUTES = {
  dashboard: {
    label: 'Dashboard',
    icon: ICONS.dashboard,
    module: () => import('./modules/dashboard.js'),
    permission: () => true
  },
  appointments: {
    label: 'Citas',
    icon: ICONS.calendar,
    module: () => import('./modules/appointments.js'),
    permission: (role) => role === 'receptionist',
  },
  patients: {
    label: 'Pacientes',
    icon: ICONS.users,
    module: () => import('./modules/patients.js'),
    permission: (role) => role === 'receptionist',
  },
  doctors: {
    label: 'Médicos',
    icon: ICONS.doctor,
    module: () => import('./modules/doctors.js'),
    permission: (role) => role === 'receptionist',
    parent: 'personal'
  },
  nurses: {
    label: 'Enfermeras',
    icon: ICONS.nurse,
    module: () => import('./modules/nurses.js'),
    permission: (role) => role === 'receptionist',
    parent: 'personal'
  },
  receptionists: {
    label: 'Recepcionistas',
    icon: ICONS.receptionist,
    module: () => import('./modules/receptionists.js'),
    permission: (role) => role === 'receptionist',
    parent: 'personal'
  },
  areas: {
    label: 'Áreas',
    icon: ICONS.building,
    module: () => import('./modules/areas.js'),
    permission: (role) => role === 'receptionist',
  },
  clinical: {
    label: 'Historia Clínica Integral',
    icon: ICONS.clipboard,
    module: () => import('./modules/clinical.js'),
    permission: (role) => role === 'receptionist',
  },
  triaje: {
    label: 'Triaje',
    icon: ICONS.triaje,
    module: () => import('./modules/triaje.js'),
    permission: (role) => role === 'receptionist',
  },
  resources: {
    label: 'Recursos',
    icon: ICONS.resources,
    module: () => import('./modules/resources.js'),
    permission: (role) => role === 'receptionist',
  },
  notif_inbox: {
    label: 'Bandeja de entrada',
    icon: ICONS.inbox,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  },
  notif_sent: {
    label: 'Enviados',
    icon: ICONS.sendIcon,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  },
  notif_drafts: {
    label: 'Borradores',
    icon: ICONS.draftIcon,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  },
  notif_trash: {
    label: 'Papelera',
    icon: ICONS.trash,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  },
  notif_reminders: {
    label: 'Recordatorios',
    icon: ICONS.clockIcon,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  },
  notif_alerts: {
    label: 'Alertas',
    icon: ICONS.alertIcon,
    module: () => import('./modules/notifications.js'),
    permission: (role) => role === 'receptionist',
    parent: 'comunicaciones'
  }
};

// ===== APP ENGINE =====
async function initApp() {
  const startTime = Date.now();
  const minLoadingTime = 3000;

  const bus = createBus();
  const store = await createStore(bus);

  APP_STATE.bus = bus;
  APP_STATE.store = store;

  // Verificar si hay una sesión activa en el terminal
  const savedUser = localStorage.getItem('hospital_desktop_user');
  if (savedUser) {
    try {
      APP_STATE.user = JSON.parse(savedUser);
      // Asegurar que el rol sea correcto para este terminal
      if (APP_STATE.user.role === 'receptionist') {
        await mountAppShell();
      } else {
        // Solo acceso a recepcionista
        await mountLogin();
      }
    } catch (e) {
      console.error('Error restaurando sesión:', e);
      await mountLogin();
    }
  } else {
    await mountLogin();
  }

  // Calcular tiempo restante para cumplir los 3 segundos
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

  setTimeout(() => {
    const loader = document.getElementById('loading');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  }, remainingTime);
}

async function mountLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <div class="login-form-panel">
          <h1 class="login-title">Hospital Universitario Manuel Núñez Tovar</h1>
          <p class="login-subtitle">Sistema de Gestión de Citas Médicas</p>
          <form id="login-form" class="login-form" autocomplete="off">
            <div class="login-field">
              <input class="login-input" type="text" id="login-user" placeholder="Ingrese su usuario" required />
            </div>
            <div class="login-field">
              <div class="auth-pw-wrap">
                <input class="login-input" type="password" id="login-pass" placeholder="Ingrese su contraseña" required style="padding-right:2.5rem;" />
                <button type="button" class="auth-eye" id="toggle-pass" tabindex="-1">${ICONS.eye || '👁️'}</button>
              </div>
            </div>
            <div id="login-error" class="auth-msg auth-err" style="display:none;"></div>
            <div id="login-warn" class="auth-msg auth-warn-msg" style="display:none;"></div>
            <button type="submit" class="login-submit-btn">INICIAR SESIÓN</button>
            <div class="login-recover">
              <a href="#" id="recover-link">¿Olvidó su contraseña? Recuperar acceso</a>
            </div>
          </form>
        </div>
        <div class="login-image-panel">
          <div class="login-image-overlay">
            <div class="brand-title">HUMNT</div>
            <div class="brand-desc">Hospital Universitario Manuel Núñez Tovar. Sistema de gestión de citas médicas.</div>
          </div>
        </div>
      </div>
    </div>
    <div id="recover-modal-overlay" class="auth-modal-overlay" style="display:none;">
      <div class="auth-modal" id="recover-modal-box">
        <button class="auth-modal-close" id="recover-modal-close" style="color: var(--red);">X</button>
        <div id="recover-modal-body"></div>
      </div>
    </div>
    <style>
      .auth-pw-wrap{position:relative;}
      .auth-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#999;padding:4px;display:flex;align-items:center;justify-content:center;}
      .auth-eye:hover{color:#333;}
      .auth-msg{display:flex;align-items:center;gap:8px;padding:0.6rem 0.85rem;border-radius:8px;font-size:0.78rem;margin-bottom:0.65rem;animation:authIn .3s ease;line-height:1.45;}
      .auth-message { margin-top: 1rem; }
      @keyframes authShake{0%,100%{transform:translateX(0);}20%{transform:translateX(-8px);}40%{transform:translateX(8px);}60%{transform:translateX(-5px);}80%{transform:translateX(5px);}}
      .auth-shake{animation:authShake .4s ease;}
      @keyframes authIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
      .auth-err{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;}
      .auth-warn-msg{background:#fffbeb;color:#d97706;border:1px solid #fde68a;}
      .auth-lock-msg{background:#fef2f2;color:#b91c1c;border:1px solid #fca5a5;font-weight:500;}

      .auth-rec{animation:authSlide .35s ease;}
      @keyframes authSlide{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
      .auth-rec-head{text-align:center;margin-bottom:0.5rem;}
      .auth-rec-head h3{margin:0.75rem 0 0.25rem;font-size:1.15rem;color:#1a202c;}
      .auth-rec-head p{margin:0;font-size:0.82rem;color:#6b7280;line-height:1.55;}
      .auth-rec-ico{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background: var(--themeDark);color:var(--white);box-shadow:0 4px 12px rgba(0,120,180,0.25);}
      .auth-ico-ok{background:linear-gradient(135deg,var(--themeDark),var(--themePrimary));}
      .auth-str{display:flex;align-items:center;gap:8px;margin-top:6px;}
      .auth-str-bar{flex:1;height:4px;background:#e5e7eb;border-radius:4px;overflow:hidden;}
      .auth-str-fill{height:100%;border-radius:4px;transition:all .3s ease;}
      .auth-str-lbl{font-size:0.68rem;font-weight:600;white-space:nowrap;}

      .auth-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:9999;align-items:center;justify-content:center;animation:authModalFadeIn .25s ease;}
      @keyframes authModalFadeIn{from{opacity:0;}to{opacity:1;}}
      .auth-modal{background:#fff;border-radius:16px;width:100%;max-width:440px;padding:2rem;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.25);animation:authModalSlideUp .3s ease;}
      @keyframes authModalSlideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
      .auth-modal-close{position:absolute;top:12px;right:14px;background:none;border:none;cursor:pointer;color:#6b7280;font-size:0.8rem;display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:6px;transition:all .2s;}
      .auth-modal-close:hover{background:#f3f4f6;color:#1f2937;}
      .auth-modal .login-field{margin-bottom:1rem;}
      .auth-modal .login-label{display:block;margin-bottom:0.35rem;font-size:0.8rem;font-weight:600;color:#374151;}
      .auth-modal .login-input{width: 100%; padding: 0.3rem 0.85rem; border-color: var(--neutralTertiary); border-width: 0 0 2px 0; border-radius: var(--radius); font-family: var(--font); font-size: 0.9rem; background: var(--white); color: var(--themeDark); box-shadow: 0 0 0 1px rgba(0, 120, 180, 0.12); transition: border-color 0.2s, box-shadow 0.2s;}
      .auth-modal .login-input:hover{background: var(--themeLighterAlt); border-color: var(--themeTertiary);}
      .auth-modal .login-input:focus{outline: none; border-color: var(--themePrimary); box-shadow: 0 0 0 1px rgba(0, 120, 180, 0.12);}
      .auth-modal .login-input::placeholder{color: var(--muted); font-weight: 400;}
      .auth-modal .login-submit-btn{display:block;width:100%;padding:0.7rem;background: var(--themeDark);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all .2s;letter-spacing:0.03em;}
      .auth-modal .login-submit-btn:hover{background: var(--themeDarkAlt);box-shadow:0 4px 12px rgba(0,120,180,0.3);}
      @media(max-width:500px){.auth-modal{max-width:95%;margin:1rem;padding:1.5rem;}}

      .login-input{width: 100%; padding: 0.3rem 0.85rem; border-color: var(--neutralTertiary); border-width: 0 0 2px 0; border-radius: var(--radius); font-family: var(--font); font-size: 0.9rem; background: var(--white); color: var(--themeDark); transition: border-color 0.2s, box-shadow 0.2s;}
      .login-input:hover{background: var(--themeLighterAlt); border-color: var(--themeTertiary);}
      .login-input:focus{outline: none; border-color: var(--themePrimary); box-shadow: 0 0 0 1px rgba(0, 120, 180, 0.12);}
      .login-input::placeholder{color: var(--muted); font-weight: 400;}
      .login-submit-btn{display:block;width:100%;padding:0.7rem;background: var(--themeDark);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all .2s;letter-spacing:0.03em;}
      .login-submit-btn:hover{background: var(--themeDarkAlt);box-shadow:0 4px 12px rgba(0,120,180,0.3);}
    </style>
  `;

  const passInput = document.getElementById('login-pass');
  const toggleBtn = document.getElementById('toggle-pass');
  toggleBtn.onclick = () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    toggleBtn.innerHTML = isPass ? (ICONS.eyeOff || '🔒') : (ICONS.eye || '👁️');
  };

  const loginForm = document.getElementById('login-form');
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const users = APP_STATE.store.get('users');

    function showErr(msg, type = 'error') {
      const errEl = document.getElementById('login-error');
      const warnEl = document.getElementById('login-warn');
      const icon = ICONS.alertIcon || '⚠️';

      if (errEl) errEl.style.display = 'none';
      if (warnEl) warnEl.style.display = 'none';

      const target = type === 'warn' ? warnEl : errEl;
      if (target) {
        target.innerHTML = `<span style="display:flex; align-items:center; transform:scale(0.85);">${icon}</span> <span>${msg}</span>`;
        target.style.display = 'flex';
      }

      loginForm.classList.remove('auth-shake');
      void loginForm.offsetWidth; // Reflow
      loginForm.classList.add('auth-shake');
      setTimeout(() => loginForm.classList.remove('auth-shake'), 450);
    }

    // Find user by username
    const user = users.find(u => u.username === username);

    if (!user) {
      showErr('Usuario no encontrado. Verifique sus credenciales.', 'error');
      return;
    }

    if (user.role !== 'receptionist') {
      showErr('Acceso denegado. Terminal exclusivo para Recepcionistas.', 'error');
      return;
    }

    if (user.isActive === false) {
      showErr('Esta cuenta ha sido desactivada. Contacte al administrador.', 'error');
      return;
    }

    if (user.password !== password) {
      showErr('Contraseña incorrecta. Verifique e intente nuevamente.', 'error');
      return;
    }

    // Login succesful
    APP_STATE.user = user;
    localStorage.setItem('hospital_desktop_user', JSON.stringify(user));
    Logger.log(APP_STATE.store, user, { action: Logger.Actions.LOGIN, module: Logger.Modules.AUTH, description: 'Inicio de sesión exitoso en terminal de escritorio' });
    location.reload();
  };

  // RECOVERY FLOW LOGIC
  const lsRec = { view: 'login', recUser: null };

  const recLink = document.getElementById('recover-link');
  if (recLink) recLink.onclick = (e) => { e.preventDefault(); openRecoverModal(); };

  const closeBtn = document.getElementById('recover-modal-close');
  if (closeBtn) closeBtn.onclick = () => closeRecoverModal();

  const overlay = document.getElementById('recover-modal-overlay');
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeRecoverModal();
  });

  function openRecoverModal() {
    lsRec.view = 'recover-email';
    lsRec.recUser = null;
    if (overlay) overlay.style.display = 'flex';
    renderRecoverStep();
  }

  function closeRecoverModal() {
    lsRec.view = 'login';
    lsRec.recUser = null;
    if (overlay) overlay.style.display = 'none';
  }

  function renderRecoverStep() {
    const body = document.getElementById('recover-modal-body');
    if (!body) return;

    body.innerHTML = getRecoverStepHTML();
    bindRecoverEvents();
  }

  function getPassStrength(pw) {
    if (!pw) return null;
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (s <= 1) return { label: 'Débil', color: '#ef4444', w: '25%' };
    if (s <= 2) return { label: 'Regular', color: '#f59e0b', w: '50%' };
    if (s <= 3) return { label: 'Buena', color: '#3b82f6', w: '75%' };
    return { label: 'Fuerte', color: '#10b981', w: '100%' };
  }

  function getRecoverStepHTML() {
    const ai = {
      eye: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
      mail: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
      shield: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      check: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      key: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`
    };

    if (lsRec.view === 'recover-email') return `
      <div class="auth-rec">
        <div class="auth-rec-head">
          <span class="auth-rec-ico">${ai.mail}</span>
          <h3>Recuperar Acceso</h3>
          <p>Ingrese el correo electrónico asociado a su cuenta para buscarla en el sistema</p>
        </div>
        <form id="rec-email-form">
          <div class="login-field">
            <label class="login-label" for="rec-email">Correo electrónico</label>
            <input class="login-input" type="email" id="rec-email" placeholder="ejemplo@hospital.com" required />
          </div>
          <div id="rec-error" class="auth-msg auth-err" style="display:none;"></div>
          <button type="submit" class="login-submit-btn" style="width:100%;">BUSCAR CUENTA</button>
        </form>
      </div>`;

    if (lsRec.view === 'recover-verify') return `
      <div class="auth-rec">
        <div class="auth-rec-head">
          <span class="auth-rec-ico">${ai.shield}</span>
          <h3>Verificación de Identidad</h3>
          <p>Cuenta encontrada: <strong>${lsRec.recUser.name}</strong><br>Para verificar su identidad, ingrese su nombre de usuario registrado</p>
        </div>
        <form id="rec-verify-form">
          <div class="login-field">
            <label class="login-label" for="verify-user">Nombre de usuario</label>
            <input class="login-input" type="text" id="verify-user" placeholder="Ingrese su nombre de usuario" required />
          </div>
          <div id="verify-error" class="auth-msg auth-err" style="display:none;"></div>
          <button type="submit" class="login-submit-btn" style="width:100%;">VERIFICAR IDENTIDAD</button>
        </form>
      </div>`;

    if (lsRec.view === 'recover-reset') return `
      <div class="auth-rec">
        <div class="auth-rec-head">
          <span class="auth-rec-ico">${ai.key}</span>
          <h3>Nueva Contraseña</h3>
          <p>Establezca una nueva contraseña para la cuenta de <strong>${lsRec.recUser.name}</strong></p>
        </div>
        <form id="rec-reset-form">
          <div class="login-field">
            <label class="login-label" for="new-pass">Nueva contraseña</label>
            <div class="auth-pw-wrap">
              <input class="login-input" type="password" id="new-pass" placeholder="Mínimo 6 caracteres" required minlength="6" style="padding-right:2.5rem;" />
              <button type="button" class="auth-eye" id="eye-new" tabindex="-1">${ai.eye}</button>
            </div>
            <div class="auth-str" id="pw-strength" style="display:none;">
              <div class="auth-str-bar"><div class="auth-str-fill" id="str-fill"></div></div>
              <span class="auth-str-lbl" id="str-label"></span>
            </div>
          </div>
          <div class="login-field">
            <label class="login-label" for="confirm-pass">Confirmar contraseña</label>
            <div class="auth-pw-wrap">
              <input class="login-input" type="password" id="confirm-pass" placeholder="Repita la contraseña" required minlength="6" style="padding-right:2.5rem;" />
              <button type="button" class="auth-eye" id="eye-confirm" tabindex="-1">${ai.eye}</button>
            </div>
          </div>
          <div id="reset-error" class="auth-msg auth-err" style="display:none;"></div>
          <button type="submit" class="login-submit-btn" style="width:100%;">CAMBIAR CONTRASEÑA</button>
        </form>
      </div>`;

    if (lsRec.view === 'recover-success') return `
      <div class="auth-rec">
        <div class="auth-rec-head">
          <span class="auth-rec-ico auth-ico-ok">${ai.check}</span>
          <h3>¡Contraseña Actualizada!</h3>
          <p>Su contraseña ha sido cambiada exitosamente.<br>Ya puede iniciar sesión con su nueva contraseña.</p>
        </div>
        <button class="login-submit-btn" id="close-success-btn" style="width:100%;">VOLVER AL LOGIN</button>
      </div>`;

    return '';
  }

  function bindRecoverEvents() {
    function showErr(id, msg) {
      const el = document.getElementById(id);
      if (el) { el.innerHTML = `<span style="display:flex; align-items:center;">${ICONS.alertIcon || '⚠️'}</span> <span>${msg}</span>`; el.style.display = 'flex'; }
    }

    const ai = {
      eye: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    };

    function bindEye(eyeId, inputId) {
      const btn = document.getElementById(eyeId);
      const inp = document.getElementById(inputId);
      if (btn && inp) btn.onclick = () => { const v = inp.type === 'password'; inp.type = v ? 'text' : 'password'; btn.innerHTML = v ? ai.eyeOff : ai.eye; };
    }
    bindEye('eye-new', 'new-pass');
    bindEye('eye-confirm', 'confirm-pass');

    const emailForm = document.getElementById('rec-email-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('rec-email').value.trim().toLowerCase();
        const users = APP_STATE.store.get('users');
        const user = users.find(u => u.email && u.email.toLowerCase() === email);
        if (!user) { showErr('rec-error', 'No se encontró una cuenta asociada a este correo electrónico.'); return; }
        if (user.role !== 'receptionist') { showErr('rec-error', 'Acceso denegado. Terminal exclusivo para perfiles de Recepcionista.'); return; }
        if (user.isActive === false) { showErr('rec-error', 'Esta cuenta está desactivada. Contacte al administrador.'); return; }
        lsRec.recUser = user;
        lsRec.view = 'recover-verify';
        renderRecoverStep();
      });
    }

    const verifyForm = document.getElementById('rec-verify-form');
    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('verify-user').value.trim();
        if (input !== lsRec.recUser.username) { showErr('verify-error', 'El nombre de usuario no coincide. Verifique e intente nuevamente.'); return; }
        lsRec.view = 'recover-reset';
        renderRecoverStep();
      });
    }

    const resetForm = document.getElementById('rec-reset-form');
    if (resetForm) {
      const newPw = document.getElementById('new-pass');
      if (newPw) newPw.addEventListener('input', () => {
        const s = getPassStrength(newPw.value);
        const strDiv = document.getElementById('pw-strength');
        const fill = document.getElementById('str-fill');
        const lbl = document.getElementById('str-label');
        if (!strDiv) return;
        if (!newPw.value) { strDiv.style.display = 'none'; return; }
        if (s) { strDiv.style.display = 'flex'; fill.style.width = s.w; fill.style.background = s.color; lbl.textContent = s.label; lbl.style.color = s.color; }
      });

      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const np = document.getElementById('new-pass').value;
        const cp = document.getElementById('confirm-pass').value;
        if (np.length < 6) { showErr('reset-error', 'La contraseña debe tener al menos 6 caracteres.'); return; }
        if (np !== cp) { showErr('reset-error', 'Las contraseñas no coinciden. Verifique e intente nuevamente.'); return; }
        APP_STATE.store.update('users', lsRec.recUser.id, { password: np });
        Logger.log(APP_STATE.store, lsRec.recUser, { action: Logger.Actions.UPDATE, module: Logger.Modules.AUTH, description: `Contraseña recuperada exitosamente: ${lsRec.recUser.name}`, details: { userId: lsRec.recUser.id } });
        lsRec.view = 'recover-success';
        renderRecoverStep();
      });
    }

    const closeSuccess = document.getElementById('close-success-btn');
    if (closeSuccess) closeSuccess.onclick = () => closeRecoverModal();
  }
}

async function mountAppShell() {
  const app = document.getElementById('app');
  const user = APP_STATE.user;
  const store = APP_STATE.store;
  const bus = APP_STATE.bus;

  app.innerHTML = `
    <div class="app-shell">
      <header class="app-header" style="display: flex; align-items: center; justify-content: space-between; padding: 0; background: var(--white); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; width: var(--sidebar-width); height: var(--header-height); align-items: center; justify-content: flex-start; gap: 0.75rem; flex-shrink: 0; background: var(--themeDark); padding: 0 1.5rem;">
          <img src="img/logotipo_blanco.png" alt="Logo HUMNT" style="height: 38px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" />
          <div style="font-weight: 700; color: var(--white); font-size: 1.1rem; letter-spacing: 0.05em; display: none;">HUMNT</div>
        </div>

        <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <h2 id="header-module-title" style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--themeDarker);">Dashboard</h2>
          </div>

          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div class="header-search">
              <div class="header-search-input-wrapper">
                <span class="header-search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                <input type="text" id="global-search" class="header-search-input" placeholder="Buscar...">
              </div>
              <div id="search-results" class="header-search-results"></div>
            </div>

            <div class="user-info-header" style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; background: var(--themeSecondary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;">
                ${user.name.charAt(0)}
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600; font-size: 0.9rem; color: var(--themeDarker);">${user.name}</span>
                <span style="font-size: 0.7rem; color: var(--muted); font-weight: 600; text-transform: uppercase;">${user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="app-main">
        <nav class="app-sidebar">
          <div class="sidebar-scroll-area">
            <div class="nav-menu">
              <div id="nav-links">
                ${renderSidebarNav()}
              </div>
            </div>
          </div>
          
          <div class="sidebar-footer">
            <button class="nav-btn logout-btn" id="btn-logout" title="Cerrar Sesión">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span class="font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        <div class="app-content">
          <div id="module-container"></div>
        </div>
      </main>
    </div>

    <style>
      .nav-dropdown-container { display: flex; flex-direction: column; overflow: hidden; }
      .nav-dropdown-content { display: none; flex-direction: column; background: rgba(0,0,0,0.03); border-radius: 8px; margin: 0 8px; }
      .nav-dropdown-container.open .nav-dropdown-content { display: flex; }
      .nav-dropdown-container.open .chevron { transform: rotate(180deg); }
      .chevron { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; margin-left: auto; }
      .sub-btn { font-size: 0.8rem !important; height: 38px !important; margin: 2px 0 !important; }
      .dropdown-trigger { width: 100% !important; cursor: pointer; }
      .nav-badge-total {
        display: none;
        min-width: 18px; height: 18px;
        background: var(--red); color: white;
        font-size: 0.6rem; font-weight: 700;
        border-radius: 50%; padding: 0 4px;
        align-items: center; justify-content: center;
        margin-left: auto;
        line-height: 18px; text-align: center;
      }
      .nav-badge-total.visible { display: inline-flex; }
      .nav-badge-sub {
        display: none;
        min-width: 16px; height: 16px;
        background: #ef4444; color: white;
        font-size: 0.55rem; font-weight: 700;
        border-radius: 50%; padding: 0 3px;
        align-items: center; justify-content: center;
        margin-left: auto;
        line-height: 16px; text-align: center;
      }
      .nav-badge-sub.visible { display: inline-flex; }
      .nav-btn.active { background: rgba(255,255,255,0.1); color: white; }
    </style>
  `;

  function renderSidebarNav() {
    const items = [];
    const mainRoutes = Object.entries(ROUTES).filter(([_, r]) => !r.parent);
    const personalRoutes = Object.entries(ROUTES).filter(([_, r]) => r.parent === 'personal');
    const comRoutes = Object.entries(ROUTES).filter(([_, r]) => r.parent === 'comunicaciones');

    mainRoutes.forEach(([id, r]) => {
      items.push(`
        <button class="nav-btn" data-route="${id}">
          <span class="nav-icon">${r.icon}</span>
          <span>${r.label}</span>
        </button>
      `);
      if (id === 'patients') {
        items.push(renderDropdown('personal', 'Personal', ICONS.staff, personalRoutes));
      }
      if (id === 'clinical') {
        items.push(renderDropdown('comunicaciones', 'Comunicaciones', ICONS.notifications, comRoutes));
      }
    });
    return items.join('');
  }

  function renderDropdown(id, label, icon, routes) {
    return `
      <div class="nav-dropdown-container" id="${id}-dropdown-container">
        <button class="nav-btn dropdown-trigger" id="${id}-dropdown-btn">
          <span class="nav-icon">${icon}</span>
          <span>${label}</span>
          <span id="${id}-badge-total" class="nav-badge-total"></span>
          <span class="chevron" style="margin-left: auto;">${ICONS.chevronDown}</span>
        </button>
        <div class="nav-dropdown-content">
          ${routes.map(([subId, subR]) => `
            <button class="nav-btn sub-btn" data-route="${subId}">
              <span class="nav-icon">${subR.icon}</span>
              <span>${subR.label}</span>
              <span id="nav-badge-${subId}" class="nav-badge-sub"></span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Eventos de Dropdown
  app.querySelectorAll('.dropdown-trigger').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const container = btn.parentElement;
      container.classList.toggle('open');
    };
  });

  // Eventos de Navegación
  app.querySelectorAll('[data-route]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const route = btn.dataset.route;
      navigateTo(route);
    };
  });

  document.getElementById('btn-logout').onclick = async () => {
    if (await hospitalConfirm('¿Desea cerrar la sesión actual?', 'warning')) {
      localStorage.removeItem('hospital_desktop_user');
      location.reload();
    }
  };

  // Escuchar navegación desde módulos
  bus.on('app:navigate', (routeId) => {
    navigateTo(routeId);
  });

  // Atajos de teclado para escritorio
  window.onkeydown = (e) => {
    if (e.altKey) {
      const keys = {
        'p': 'patients',
        'c': 'appointments',
        't': 'triaje',
        'h': 'clinical',
        'd': 'dashboard'
      };
      const route = keys[e.key.toLowerCase()];
      if (route) {
        e.preventDefault();
        navigateTo(route);
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('global-search')?.focus();
    }
  };

  // Búsqueda Global (Lógica Completa)
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');

  const handleGlobalSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) { searchResults.classList.remove('active'); return; }

    const patients = (store.get('patients') || []).filter(p =>
      p.name.toLowerCase().includes(query) || p.dni.includes(query)
    );

    const appointments = (store.get('appointments') || []).filter(a => {
      const p = store.find('patients', a.patientId);
      return p && (p.name.toLowerCase().includes(query) || p.dni.includes(query));
    });

    if (patients.length === 0 && appointments.length === 0) {
      searchResults.innerHTML = '<div class="header-search-empty">No se encontraron resultados.</div>';
    } else {
      let html = '';
      if (patients.length > 0) {
        html += '<div style="padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; background: #f8fafc;">Pacientes</div>';
        html += patients.slice(0, 5).map(p => `
          <div class="search-result-item" data-type="patient" data-id="${p.id}">
            <div class="search-result-icon">${ICONS.users}</div>
            <div class="search-result-info">
              <div class="search-result-label">${p.name}</div>
              <div class="search-result-parent">DNI: ${p.dni}</div>
            </div>
          </div>
        `).join('');
      }
      if (appointments.length > 0) {
        html += '<div style="padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; background: #f8fafc;">Citas</div>';
        html += appointments.slice(0, 5).map(a => {
          const p = store.find('patients', a.patientId);
          return `
            <div class="search-result-item" data-type="appointment" data-id="${a.id}">
              <div class="search-result-icon">${ICONS.calendar}</div>
              <div class="search-result-info">
                <div class="search-result-label">${p ? p.name : 'Paciente desconocido'}</div>
                <div class="search-result-parent">${new Date(a.dateTime).toLocaleDateString()} - ${a.status}</div>
              </div>
            </div>
          `;
        }).join('');
      }
      searchResults.innerHTML = html;
    }
    searchResults.classList.add('active');
  };

  searchInput.oninput = handleGlobalSearch;

  searchResults.onclick = (e) => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      const type = item.dataset.type;
      const id = item.dataset.id;
      if (type === 'patient') {
        localStorage.setItem('selected_patient_id', id);
        navigateTo('patients');
      } else if (type === 'appointment') {
        localStorage.setItem('selected_appointment_id', id);
        navigateTo('appointments');
      }
      searchInput.value = '';
      searchResults.classList.remove('active');
    }
  };

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });

  // Tecla Alt+K
  window.onkeydown = (e) => {
    if (e.altKey && e.key === 'k') { e.preventDefault(); searchInput.focus(); }
  };

  // Badges y Suscripciones
  function getUnreadCounts() {
    const msgs = store.get('messages') || [];
    const notifs = store.get('notifications') || [];
    const rems = store.get('reminders') || [];
    const all = [...msgs, ...notifs, ...rems].filter(i => !i.deleted);
    const isUnread = i => i.status === 'pending' || i.status === 'sent' || i.status === 'scheduled' || i.status === 'delivered';

    const visible = all.filter(i => {
      if (user.role === 'admin') return true;
      if (i.createdBy === user.id) return true;
      if (i.recipientId === user.id ||
        (user.patientId && i.recipientId === user.patientId) ||
        (user.doctorId && i.recipientId === user.doctorId) ||
        (user.nurseId && i.recipientId === user.nurseId) ||
        (user.receptionistId && i.recipientId === user.receptionistId)) return true;
      if (i.recipientRole === user.role) return true;
      return false;
    });

    const inbox = visible.filter(i => i.createdBy !== user.id && isUnread(i)).length;
    const sent = 0; // Gmail style (unread usually refers to incoming)
    const reminders = rems.filter(i => {
      if (!isUnread(i)) return false;
      // Solo para pacientes (sus propios recordatorios) o admin/recepción
      if (user.role === 'patient') return i.recipientId === user.patientId;
      if (['admin', 'receptionist'].includes(user.role)) return true;
      return i.recipientId === user.id; // Fallback
    }).length;
    const alerts = visible.filter(i => (i.priority === 'critical' || i.priority === 'high' || i.type === 'alert') && isUnread(i)).length;
    return { inbox, sent, reminders, alerts, total: inbox + reminders + alerts };
  }

  function updateNotifBadges() {
    const counts = getUnreadCounts();
    const totalBadge = document.getElementById('comunicaciones-badge-total');
    if (totalBadge) {
      if (counts.total > 0) {
        totalBadge.textContent = counts.total > 99 ? '99+' : counts.total;
        totalBadge.classList.add('visible');
      } else {
        totalBadge.classList.remove('visible');
      }
    }
    const badgeMap = { notif_inbox: counts.inbox, notif_sent: counts.sent, notif_reminders: counts.reminders, notif_alerts: counts.alerts };
    Object.entries(badgeMap).forEach(([routeId, count]) => {
      const el = document.getElementById(`nav-badge-${routeId}`);
      if (el) {
        if (count > 0) {
          el.textContent = count > 99 ? '99+' : count;
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      }
    });
  }

  updateNotifBadges();
  store.subscribe('messages', updateNotifBadges);
  store.subscribe('notifications', updateNotifBadges);
  store.subscribe('reminders', updateNotifBadges);

  await navigateTo('dashboard');
}

async function navigateTo(routeId) {
  const route = ROUTES[routeId];
  if (!route) return;

  // Actualizar estado visual de la barra lateral
  document.querySelectorAll('[data-route]').forEach(i => {
    const active = i.dataset.route === routeId;
    i.classList.toggle('active', active);
    if (active && i.classList.contains('sub-btn')) {
      const dropdown = i.closest('.nav-dropdown-container');
      if (dropdown) dropdown.classList.add('open');
    }
  });

  const titleEl = document.getElementById('header-module-title');
  if (titleEl) titleEl.textContent = route.label;

  const container = document.getElementById('module-container');
  container.innerHTML = '<div class="loading-spinner" style="margin: 2rem auto;"></div>';

  try {
    const moduleFactory = await route.module();
    container.innerHTML = '';

    // Cleanup de módulo anterior
    if (APP_STATE.currentModule && APP_STATE.currentModule.destroy) {
      APP_STATE.currentModule.destroy();
    }

    APP_STATE.currentModule = moduleFactory.mount(container, {
      bus: APP_STATE.bus,
      store: APP_STATE.store,
      user: APP_STATE.user,
      role: APP_STATE.user?.role || APP_STATE.role,
      routeId: routeId
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="error-msg" style="padding:2rem; background:#fff5f5; border:1px solid #feb2b2; border-radius:8px; color:#c53030;">Error al cargar el módulo: ${err.message}</div>`;
  }
}

// Iniciar
document.addEventListener('DOMContentLoaded', initApp);
