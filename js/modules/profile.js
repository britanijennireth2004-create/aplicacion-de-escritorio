
/**
 * Módulo de Perfil - Registro de Seguridad y Control Operativo
 */

export function mount(root, { bus, store, user, role }) {
  const state = {
    isEditing: false
  };

  const icons = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    save: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    sync: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
  };

  function render() {
    const staffId = user.receptionistId || user.staffId || user.doctorId || user.nurseId;
    const staffRecord = staffId ? store.find('receptionists', staffId) : null;
    const regions = store.get('areas') || [];

    const data = {
      name: staffRecord?.name || user.name || '',
      email: staffRecord?.email || user.email || '',
      phone: staffRecord?.phone || 'No registrado',
      docType: staffRecord?.docType || 'V',
      dni: staffRecord?.dni || '---',
      cargo: staffRecord?.specialty || staffRecord?.title || 'Admisión General',
      areaName: regions.find(a => a.id === staffRecord?.areaId)?.name || 'General',
      start: staffRecord?.scheduleStart || '08:00',
      end: staffRecord?.scheduleEnd || '16:00'
    };

    root.innerHTML = `
      <div class="module-profile animated-fade-in" style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
        <div class="main-profile-box" style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); position: relative;">
          
          ${state.isEditing ? renderEdit(data) : renderView(data)}

        </div>

        <div id="p-modal-pass" class="modal-overlay hidden">
          <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
              <h3 class="modal-title">GESTIÓN DE CREDENCIALES</h3>
              <button class="btn-icon" id="btn-close-pass" style="background: transparent; border: none; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
              <div class="form-group mb-4">
                <label class="form-label font-bold" style="color: var(--modal-text); font-size: 0.75rem;">CONTRASEÑA ACTUAL</label>
                <input type="password" class="input" id="pass-old" style="height: 38px;">
              </div>
              <div class="form-group mb-4">
                <label class="form-label font-bold" style="color: var(--modal-text); font-size: 0.75rem;">NUEVA CONTRASEÑA</label>
                <input type="password" class="input" id="pass-new" style="height: 38px;">
              </div>
              <div class="form-group mb-4">
                <label class="form-label font-bold" style="color: var(--modal-text); font-size: 0.75rem;">COFIRMAR CONTRASEÑA</label>
                <input type="password" class="input" id="pass-conf" style="height: 38px;">
              </div>
              <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                <button class="btn btn-outline" id="btn-cancel-pass" style="flex: 1;">CERRAR</button>
                <button class="btn btn-primary" id="hc-ok-pass" style="flex: 1.5; font-weight: 800; background: var(--themePrimary);">ACTUALIZAR</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setupListeners(data);
  }

  function renderView(data) {
    return `
      <div style="position: absolute; top: 1.25rem; right: 1.25rem;">
        <button class="btn btn-primary" id="p-btn-edit-trigger" style="border-radius: 8px; font-weight: 700; height: 38px; padding: 0 1.25rem; font-size: 0.8rem;">
          ${icons.edit} EDITAR MI PERFIL
        </button>
      </div>

      <div style="padding: 2.25rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; border-bottom: 2px solid #f8fafc; padding-bottom: 1.5rem;">
           <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 2px solid #e2e8f0; color: #1e293b; font-weight: 900;">
             ${data.name.charAt(0)}
           </div>
           <div>
             <h2 style="margin: 0; font-size: 1.35rem; color: #1e293b; font-weight: 900; line-height: 1.2;">${data.name}</h2>
             <div style="color: #64748b; font-size: 0.8rem; font-weight: 700; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px;">
               ${data.cargo} <span style="color: #cbd5e1; margin: 0 5px;">|</span> ${data.areaName}
             </div>
           </div>
        </div>

        <div style="margin-bottom: 2.5rem;">
          <h3 style="font-size: 0.8rem; font-weight: 900; color: #1e293b; margin-bottom: 1.75rem; text-transform: uppercase; border-bottom: 2px solid #3b82f6; padding-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.5px;">
            ${icons.user} DATOS DE IDENTIDAD
          </h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem;">
            <div>
              <div class="font-bold" style="color: #94a3b8; font-size: 0.65rem; margin-bottom: 0.5rem; text-transform: uppercase;">Tipo / Cédula</div>
              <div style="font-weight: 800; color: #1e293b; font-size: 1rem;">${data.docType}-${data.dni}</div>
            </div>
            <div>
              <div class="font-bold" style="color: #94a3b8; font-size: 0.65rem; margin-bottom: 0.5rem; text-transform: uppercase;">Teléfono de Contacto</div>
              <div style="font-weight: 800; color: #1e293b; font-size: 1rem;">${data.phone}</div>
            </div>
            <div>
              <div class="font-bold" style="color: #94a3b8; font-size: 0.65rem; margin-bottom: 0.5rem; text-transform: uppercase;">Correo Institucional</div>
              <div style="font-weight: 800; color: #1e293b; font-size: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data.email}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 2.5rem;">
          <h3 style="font-size: 0.8rem; font-weight: 900; color: #1e293b; margin-bottom: 1.75rem; text-transform: uppercase; border-bottom: 2px solid #f59e0b; padding-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.5px;">
            ${icons.briefcase} ASIGNACIÓN LABORAL
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.75rem;">
            <div style="background: #fffdf5; padding: 1rem; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <div class="font-bold" style="color: #856404; font-size: 0.65rem; margin-bottom: 0.25rem;">CARGO ASIGNADO <span style="font-size: 0.55rem; opacity: 0.7;">(Fijo)</span></div>
              <div style="font-weight: 800; color: #453402; font-size: 1.1rem;">${data.cargo}</div>
              <div style="font-size: 0.75rem; color: #b45309; margin-top: 2px; font-weight: 600;">Área: ${data.areaName}</div>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border-left: 4px solid #64748b;">
              <div class="font-bold" style="color: #475569; font-size: 0.65rem; margin-bottom: 0.25rem;">JORNADA LABORAL</div>
              <div style="font-weight: 800; color: #1e293b; font-size: 1.1rem;">${data.start} - ${data.end}</div>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px; font-weight: 600;">Estado: Sincronizado</div>
            </div>
          </div>
        </div>

        <div>
          <h3 style="font-size: 0.8rem; font-weight: 900; color: #1e293b; margin-bottom: 1.5rem; text-transform: uppercase; border-bottom: 2px solid #334155; padding-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.5px;">
            ${icons.lock} SEGURIDAD DE ACCESO
          </h3>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0;">
             <div>
               <div style="font-size: 0.65rem; color: #64748b; font-weight: 900; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;">Terminal de Usuario</div>
               <div style="font-weight: 900; font-size: 1.2rem; color: #0f172a;">@${user.username}</div>
             </div>
             <button class="btn btn-outline" id="btn-pass-open" style="border-radius: 10px; font-weight: 800; border-color: #0f172a; color: #0f172a; background: white; font-size: 0.75rem; padding: 0.6rem 1.25rem;">CAMBIAR CONTRASEÑA</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderEdit(data) {
    return `
      <div style="position: absolute; top: 1.25rem; right: 1.25rem; display: flex; gap: 0.75rem; z-index: 10;">
         <button class="btn-circle btn-circle-cancel" id="p-btn-reset" title="Cancelar cambios">
           ${icons.sync}
         </button>
         <button class="btn-circle btn-circle-save" id="p-btn-save" title="Guardar todos los cambios">
           ${icons.save}
         </button>
      </div>

      <div style="padding: 2rem;">
        <form id="profile-unified-form">
          <div style="margin-bottom: 2.25rem;">
            <h3 style="font-size: 0.75rem; font-weight: 900; color: #1e293b; margin-bottom: 1.5rem; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; letter-spacing: 1px;">
              Edición de Datos de Contacto
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">NOMBRE COMPLETO</label>
                <input type="text" class="input p-field" data-id="name" value="${data.name}" required style="height: 36px; font-size: 0.85rem;">
              </div>
              <div class="form-group">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">DOCUMENTO DE IDENTIDAD</label>
                <div style="display: flex; gap: 0;">
                  <select class="input p-field" data-id="docType" style="width: 60px; border-radius: 6px 0 0 6px; border-right: none; height: 36px; font-size: 0.85rem;">
                    <option value="V" ${data.docType === 'V' ? 'selected' : ''}>V</option>
                    <option value="E" ${data.docType === 'E' ? 'selected' : ''}>E</option>
                    <option value="P" ${data.docType === 'P' ? 'selected' : ''}>P</option>
                  </select>
                  <input type="text" class="input p-field" data-id="dni" value="${data.dni}" style="flex: 1; border-radius: 0 6px 6px 0; height: 36px; font-size: 0.85rem; font-weight: 700;">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">TELÉFONO MÓVIL/LOCAL</label>
                <input type="tel" class="input p-field" data-id="phone" value="${data.phone}" required style="height: 36px; font-size: 0.85rem;">
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">CORREO CORPORATIVO</label>
                <input type="email" class="input p-field" data-id="email" value="${data.email}" required style="height: 36px; font-size: 0.85rem;">
              </div>
            </div>
          </div>

          <!-- Bloque Laboral (Solo Lectura) -->
          <div style="margin-bottom: 2.25rem; opacity: 0.8;">
            <h3 style="font-size: 0.75rem; font-weight: 900; color: #64748b; margin-bottom: 1.5rem; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; letter-spacing: 1px;">
              Datos Laborales (No Modificables)
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label font-bold" style="color: #94a3b8; font-size: 0.75rem;">CARGO / FUNCIÓN ACTUAL</label>
                <input type="text" class="input" value="${data.cargo}" disabled style="height: 36px; font-size: 0.85rem; background: #f8fafc; color: #64748b; font-weight: 700; border-style: dashed;">
              </div>
              <div class="form-group">
                <label class="form-label font-bold" style="color: #94a3b8; font-size: 0.75rem;">ÁREA ASIGNADA</label>
                <input type="text" class="input" value="${data.areaName}" disabled style="height: 36px; background: #f8fafc; font-size: 0.85rem; color: #64748b; font-weight: 700; border-style: dashed;">
              </div>
              <div class="form-group">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">HORA ENTRADA</label>
                <input type="time" class="input p-field" data-id="start" value="${data.start}" style="height: 36px; font-size: 0.85rem;">
              </div>
              <div class="form-group">
                <label class="form-label font-bold" style="color: #475569; font-size: 0.75rem;">HORA SALIDA</label>
                <input type="time" class="input p-field" data-id="end" value="${data.end}" style="height: 36px; font-size: 0.85rem;">
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 0.75rem; font-weight: 900; color: #1e293b; margin-bottom: 1.25rem; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; letter-spacing: 1px;">
              Seguridad de Cuenta
            </h3>
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px dashed #e2e8f0;">
               <div style="font-weight: 700; font-size: 0.8rem; color: #64748b;">Usuario: @${user.username}</div>
               <button type="button" class="btn btn-outline" id="btn-pass-open" style="height: 32px; font-size: 0.65rem; padding: 0 1rem; border-radius: 6px;">CAMBIAR CONTRASEÑA</button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  function setupListeners(data) {
    if (!state.isEditing) {
      const editTrigger = root.querySelector('#p-btn-edit-trigger');
      if (editTrigger) {
        editTrigger.onclick = () => {
          state.isEditing = true;
          render();
        };
      }
    } else {
      const saveBtn = root.querySelector('#p-btn-save');
      const resetBtn = root.querySelector('#p-btn-reset');
      if (saveBtn) saveBtn.onclick = () => saveChanges();
      if (resetBtn) resetBtn.onclick = async () => {
        const ok = await window.hospitalConfirm('¿Descartar los cambios de edición?', 'question');
        if (ok) {
          state.isEditing = false;
          render();
        }
      };
    }

    const modal = root.querySelector('#p-modal-pass');
    const btnPass = root.querySelector('#btn-pass-open');
    if (btnPass) {
      btnPass.onclick = () => modal.classList.remove('hidden');
    }

    root.querySelector('#btn-close-pass').onclick = () => modal.classList.add('hidden');
    root.querySelector('#hc-ok-pass').onclick = () => updatePassword();
  }

  function saveChanges() {
    const fields = root.querySelectorAll('.p-field');
    const updateData = {};
    fields.forEach(f => {
      updateData[f.dataset.id] = f.value.trim();
    });

    const staffId = user.receptionistId || user.staffId || user.doctorId || user.nurseId;
    if (staffId) {
      // NOTA: No actualizamos 'specialty' ni 'areaId' desde aquí, ya que son fijos para la recepcionista.
      store.update('receptionists', staffId, {
        name: updateData.name,
        docType: updateData.docType,
        dni: updateData.dni,
        phone: updateData.phone,
        email: updateData.email,
        scheduleStart: updateData.start,
        scheduleEnd: updateData.end
      });
    }

    store.update('users', user.id, {
      name: updateData.name,
      email: updateData.email
    });

    user.name = updateData.name;
    user.email = updateData.email;
    localStorage.setItem('hospital_desktop_user', JSON.stringify(user));

    window.hospitalAlert('¡Perfil actualizado con éxito!', 'success');
    bus.emit('user:profile_updated', user);
    state.isEditing = false;
    render();
  }

  function updatePassword() {
    const oldP = root.querySelector('#pass-old').value;
    const newP = root.querySelector('#pass-new').value;
    const confP = root.querySelector('#pass-conf').value;

    if (oldP !== user.password) {
      window.hospitalAlert('Contraseña actual incorrecta', 'error');
      return;
    }
    if (newP.length < 6) {
      window.hospitalAlert('Mínimo 6 caracteres', 'warning');
      return;
    }
    if (newP !== confP) {
      window.hospitalAlert('Las contraseñas no coinciden', 'warning');
      return;
    }

    store.update('users', user.id, { password: newP });
    user.password = newP;
    localStorage.setItem('hospital_desktop_user', JSON.stringify(user));

    window.hospitalAlert('Seguridad actualizada', 'success');
    root.querySelector('#p-modal-pass').classList.add('hidden');
  }

  render();

  return {
    destroy: () => { }
  };
}
