import { getTour, createTour, updateTour } from './manageTour';


export const initCreateTourModal = () => {
  const overlay = document.getElementById('create-tour-overlay');
  if (!overlay) return;

  const openCreateBtn = document.getElementById('open-create-tour');
  const closeBtn = document.getElementById('close-create-tour');
  const cancelBtn = document.getElementById('cancel-create-tour');
  const form = document.getElementById('create-tour-form');
  const modalTitle = document.getElementById('ct-modal-title');
  const submitBtn = document.getElementById('ct-submit-btn');
  const locationsWrap = document.getElementById('ct-locations');
  const datesWrap = document.getElementById('ct-dates');
  const imageCoverInput = document.getElementById('ct-imageCover');

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
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('ct-overlay--open')) closeModal();
  });

  // ---- Dynamic itinerary location rows ----
  const addLocationRow = (data = {}) => {
    const row = document.createElement('div');
    row.className = 'ct-location-row';
    row.innerHTML = `
      <input type="text" class="form__input ct-loc-description" placeholder="Description" value="${data.description || ''}">
      <input type="number" class="form__input ct-loc-day" placeholder="Day" min="1" style="max-width:80px;" value="${data.day || ''}">
      <input type="number" step="any" class="form__input ct-loc-lng" placeholder="Longitude" style="max-width:120px;" value="${data.lng ?? ''}">
      <input type="number" step="any" class="form__input ct-loc-lat" placeholder="Latitude" style="max-width:120px;" value="${data.lat ?? ''}">
      <button type="button" class="ct-remove-btn">&times;</button>
    `;
    row.querySelector('.ct-remove-btn').addEventListener('click', () => row.remove());
    locationsWrap.appendChild(row);
  };
  document.getElementById('ct-add-location').addEventListener('click', () => addLocationRow());

  // ---- Dynamic start date rows ----
  const addDateRow = (value = '') => {
    const row = document.createElement('div');
    row.className = 'ct-date-row';
    row.innerHTML = `
      <input type="date" class="form__input ct-date-input" value="${value}">
      <button type="button" class="ct-remove-btn">&times;</button>
    `;
    row.querySelector('.ct-remove-btn').addEventListener('click', () => row.remove());
    datesWrap.appendChild(row);
  };
  document.getElementById('ct-add-date').addEventListener('click', () => addDateRow());

  // ---- Reset form ----
  const resetForm = () => {
    form.reset();
    form.dataset.mode = 'create';
    delete form.dataset.tourId;
    modalTitle.textContent = 'Create New Tour';
    submitBtn.textContent = 'Create Tour';
    imageCoverInput.required = true;
    locationsWrap.innerHTML = '';
    datesWrap.innerHTML = '';
    addLocationRow();
    addDateRow();
    form.querySelectorAll('input[name="guides[]"]').forEach(cb => (cb.checked = false));
  };

  openCreateBtn.addEventListener('click', () => {
    resetForm();
    openModal();
  });

  // ---- Fill form for editing ----
  const fillEditForm = tour => {
    form.dataset.mode = 'edit';
    form.dataset.tourId = tour.id || tour._id;
    modalTitle.textContent = `Edit Tour — ${tour.name}`;
    submitBtn.textContent = 'Save Changes';
    imageCoverInput.required = false;

    form.name.value = tour.name || '';
    form.duration.value = tour.duration || '';
    form.maxGroupSize.value = tour.maxGroupSize || '';
    form.difficulty.value = tour.difficulty || 'medium';
    form.price.value = tour.price || '';
    form.summary.value = tour.summary || '';
    form.description.value = tour.description || '';
    form.secretTour.checked = !!tour.secretTour;

    const sl = tour.startLocation || {};
    form.startAddress.value = sl.address || '';
    form.startDescription.value = sl.description || '';
    form.startLng.value = sl.coordinates ? sl.coordinates[0] : '';
    form.startLat.value = sl.coordinates ? sl.coordinates[1] : '';

    locationsWrap.innerHTML = '';
    (tour.locations || []).forEach(loc => {
      addLocationRow({
        description: loc.description,
        day: loc.day,
        lng: loc.coordinates ? loc.coordinates[0] : '',
        lat: loc.coordinates ? loc.coordinates[1] : ''
      });
    });
    if (!locationsWrap.children.length) addLocationRow();

    datesWrap.innerHTML = '';
    (tour.startDates || []).forEach(d => {
      const dateObj = typeof d === 'string' ? d : d.date;
      addDateRow(dateObj ? dateObj.slice(0, 10) : '');
    });
    if (!datesWrap.children.length) addDateRow();

    const guideIds = (tour.guides || []).map(g => (typeof g === 'string' ? g : g._id || g.id));
    form.querySelectorAll('input[name="guides[]"]').forEach(cb => {
      cb.checked = guideIds.includes(cb.value);
    });
  };

  // ربط الكليك هنا بطريقة صحيحة ومباشرة داخل الـ init
    document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.edit-tour-btn');
  if (!btn) return;

  const id = btn.dataset.id;

  console.log('Edit clicked:', id);

  try {
    const tour = await getTour(id);

    console.log('Tour returned:', tour);

    if (tour) {
      resetForm();
      fillEditForm(tour);
      openModal();
    }
  } catch (err) {
    console.log('Error fetching tour for edit:', err);
  }
});
  resetForm();

  // ---- Submit Form (Create or Edit) ----
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const locations = [...locationsWrap.querySelectorAll('.ct-location-row')]
      .filter(row => row.querySelector('.ct-loc-description').value.trim())
      .map(row => ({
        type: 'Point',
        description: row.querySelector('.ct-loc-description').value,
        day: Number(row.querySelector('.ct-loc-day').value) || 1,
        coordinates: [
          Number(row.querySelector('.ct-loc-lng').value) || 0,
          Number(row.querySelector('.ct-loc-lat').value) || 0
        ]
      }));

const startDates = [...datesWrap.querySelectorAll('.ct-date-input')]
  .map(input => input.value)
  .filter(Boolean)
  .map(date => ({ date }));

    const guides = [...form.querySelectorAll('input[name="guides[]"]:checked')].map(cb => cb.value);

    const startLocation = {
      type: 'Point',
      address: form.startAddress.value,
      description: form.startDescription.value,
      coordinates: [Number(form.startLng.value), Number(form.startLat.value)]
    };

    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('duration', form.duration.value);
    formData.append('maxGroupSize', form.maxGroupSize.value);
    formData.append('difficulty', form.difficulty.value);
    formData.append('price', form.price.value);
    formData.append('summary', form.summary.value);
    formData.append('description', form.description.value);
    formData.append('secretTour', form.secretTour.checked);
    formData.append('startLocation', JSON.stringify(startLocation));
    formData.append('locations', JSON.stringify(locations));
    formData.append('startDates', JSON.stringify(startDates));
    formData.append('guides', JSON.stringify(guides));

    if (form.imageCover.files[0]) formData.append('imageCover', form.imageCover.files[0]);
    [...form.images.files].forEach(file => formData.append('images', file));

    const isEdit = form.dataset.mode === 'edit';
    
    if (isEdit) {
      await updateTour(form.dataset.tourId, formData);
    } else {
      await createTour(formData);
    }
  });
};