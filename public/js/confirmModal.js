// Reusable, Promise-based confirm modal — replaces the native window.confirm().
// Builds its own markup on demand, so it can be called from any page/module
// without needing static HTML added to every pug file.
//
// Usage:
//   const ok = await showConfirmModal({
//     title: 'Delete Tour',
//     message: 'Are you sure you want to delete this tour? This action cannot be undone.',
//     confirmText: 'Delete'
//   });
//   if (ok) { ...proceed... }

export const showConfirmModal = ({
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel'
} = {}) => {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'cf-overlay';
    overlay.innerHTML = `
      <div class="cf-modal" role="alertdialog" aria-modal="true">
        <div class="cf-icon">!</div>
        <h3 class="cf-title">${title}</h3>
        <p class="cf-message">${message}</p>
        <div class="cf-actions">
          <button type="button" class="cf-btn-cancel">${cancelText}</button>
          <button type="button" class="cf-btn-confirm">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    console.log('CONFIRM MODAL CREATED');
console.log(overlay);
    document.body.style.overflow = 'hidden';

    // trigger the open transition on the next frame
    requestAnimationFrame(() => overlay.classList.add('cf-overlay--open'));
console.log('MODAL OPEN CLASS ADDED');
    const cleanup = result => {
      overlay.classList.remove('cf-overlay--open');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 200);
      document.removeEventListener('keydown', onKeydown);
      resolve(result);
    };

    const onKeydown = e => {
      if (e.key === 'Escape') cleanup(false);
      if (e.key === 'Enter') cleanup(true);
    };

    overlay.querySelector('.cf-btn-cancel').addEventListener('click', () => cleanup(false));
    overlay.querySelector('.cf-btn-confirm').addEventListener('click', () => cleanup(true));
    overlay.addEventListener('click', e => {
      if (e.target === overlay) cleanup(false);
    });
    document.addEventListener('keydown', onKeydown);
  });
};