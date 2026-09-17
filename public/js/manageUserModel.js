import { createUser, updateUser, deleteUser } from './manageUser';
import { showConfirmModal } from './confirmModal';

export const initCreateUserModal = () => {
  const overlay = document.getElementById('create-user-overlay');
  if (!overlay) return;

  const openCreateBtn = document.getElementById('open-create-user');
  const closeBtn = document.getElementById('close-create-user');
  const cancelBtn = document.getElementById('cancel-create-user');
  const form = document.getElementById('create-user-form');
  const modalTitle = document.getElementById('cu-modal-title');
  const submitBtn = document.getElementById('cu-submit-btn');
  const passwordInput = document.getElementById('cu-password');
  const passwordConfirmInput = document.getElementById('cu-password-confirm');
  const passwordHint = document.getElementById('cu-password-hint');
  const activeInput = document.getElementById('cu-active');

  const openModal = () => {
    overlay.classList.add('ct-overlay--open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('ct-overlay--open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('ct-overlay--open')) closeModal();
  });

  // ---- Reset form ----
  const resetForm = () => {
    form.reset();
    form.dataset.mode = 'create';
    delete form.dataset.userId;
    modalTitle.textContent = 'Create New User';
    submitBtn.textContent = 'Create User';
    passwordInput.required = true;
    passwordHint.style.display = 'none';
    activeInput.checked = true;
  };

  openCreateBtn.addEventListener('click', () => {
    resetForm();
    openModal();
  });

  // ---- Fill form for editing ----
  const fillEditForm = (data) => {
  console.log('EDIT USER DATA:', data);
  console.log('ACTIVE VALUE:', data.active);
  console.log('ACTIVE TYPE:', typeof data.active);

    form.dataset.mode = 'edit';
    form.dataset.userId = data.id;
////
    const idInput = document.getElementById('cu-id');
    if (idInput) idInput.value = data.id;


    modalTitle.textContent = `Edit User — ${data.name}`;
    submitBtn.textContent = 'Save Changes';
    passwordInput.required = false;
    passwordHint.style.display = 'block';

    form.name.value = data.name || '';
    form.email.value = data.email || '';
    form.role.value = data.role || 'user';
    activeInput.checked = data.active === 'true' || data.active === true;
  };

  document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-user-btn');
    if (editBtn) {
        console.log('BUTTON:', editBtn);
  console.log('DATASET:', editBtn.dataset);
  console.log('ACTIVE FROM BUTTON:', editBtn.dataset.active);
      resetForm();
      fillEditForm({
        id: editBtn.dataset.id,
        name: editBtn.dataset.name,
        email: editBtn.dataset.email,
        role: editBtn.dataset.role,
        active: editBtn.dataset.active,
      });
      openModal();
      return;
    }

  const deleteBtn = e.target.closest('.delete-user-btn');
if (deleteBtn) {
  const id = deleteBtn.dataset.id;

  const confirmed = await showConfirmModal({
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    confirmText: 'Delete'
  });

  if (confirmed) {
    deleteUser(id);
  }
}
});
  resetForm();

  // ---- Submit Form (Create or Edit) ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('email', form.email.value);
    formData.append('role', form.role.value);
    formData.append('active', activeInput.checked);
    console.log('ACTIVE CHECKED:', activeInput.checked);
    console.log('ACTIVE FORMDATA:', formData.get('active'));
    if (passwordInput.value) formData.append('password', passwordInput.value);
    if (passwordConfirmInput.value) formData.append('passwordConfirm', passwordConfirmInput.value);
   
    if (form.photo.files[0]) formData.append('photo', form.photo.files[0]);

    const isEdit = form.dataset.mode === 'edit';

    if (isEdit) {
      ////
      const userId = form.dataset.userId || document.getElementById('cu-id').value;
      console.log('Updating user with ID:', userId);

      await updateUser(userId, formData);
    } else {
      await createUser(formData);
    }
  });
}