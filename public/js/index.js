import{login,logout,signup} from './login';
 
import { dispalyMap } from './mapBox';

import {updateSettings} from './updateSetting'

import { bookTour } from './stripe';

 import { showAlert } from './alerts';

 import { createReview } from './reviewForm';

  import { updateReview, deleteReview } from './manageAccountReview';

 import{deleteTour} from'./manageTour'

 import { initCreateTourModal } from './manageTourModel';

 import { initCreateUserModal } from './manageUserModel';

 import { deleteBooking } from './manageBooking';


import { showConfirmModal } from './confirmModal';


// Dom element 
 
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const mapBox = document.getElementById('map');
const logoutButton = document.querySelector('.nav__el--logout');
const reviewForm = document.querySelector('.form--review');

// account reviews (edit/delete)
const editReviewBtns = document.querySelectorAll('.edit-review-btn');
const deleteReviewBtns = document.querySelectorAll('.delete-review-btn');
const editReviewOverlay = document.getElementById('edit-review-overlay');
const editReviewForm = document.getElementById('edit-review-form');
const editReviewTextInput = document.getElementById('edit-review-text');
const editReviewRatingInput = document.getElementById('edit-review-rating');
const cancelEditReviewBtn = document.getElementById('cancel-edit-review');


const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

const bookBtn=document.getElementById('book-tour');

const deleteTourBtns = document.querySelectorAll('.delete-tour-btn');

// admin booking 
const deleteBookingBtns = document.querySelectorAll('.delete-booking-btn');
const deleteBookingOverlay = document.getElementById('delete-booking-overlay');
const cancelDeleteBookingBtn = document.getElementById('cancel-delete-booking');
const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking');


if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  dispalyMap(locations);
}
 


    if(loginForm)
   loginForm.addEventListener('submit',e=>{
    e.preventDefault();
    // values
    const email = document.getElementById('email').value ;
    const password = document.getElementById('password').value ;
    login(email,password)
})

console.log("signup form : ",signupForm);
if(signupForm)
  signupForm.addEventListener('submit',e=>{
    e.preventDefault()
    console.log('submitted');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm =document.getElementById('passwordConfirm').value;

    signup(name,email,password,passwordConfirm);
})
 
// if(logoutButton) logoutButton.addEventListener('click',logout)
 

console.log('Logout button:', logoutButton);

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    console.log('🔥 LOGOUT CLICKED');
    logout(e);
  });
}

  if(userDataForm) 
    userDataForm.addEventListener('submit',e=>{
   e.preventDefault();
    const form = new FormData();
    form.append('name',document.getElementById('name').value)
    form.append('email',document.getElementById('email').value)
    form.append('photo',document.getElementById('photo').files[0])
    console.log('photo : ',document.getElementById('photo').files[0]);
    updateSettings(form,'data')
  })

    if(userPasswordForm) 
    userPasswordForm.addEventListener('submit', async e=>{
   e.preventDefault();
   document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('password-confirm').value
    console.log({
  currentPassword,
  password,
  passwordConfirm
}); 
    await updateSettings({currentPassword,password,passwordConfirm},'password')

    document.querySelector('.btn--save-password').textContent = 'Save password';
    
    document.getElementById('password-current').value=''
    document.getElementById('password').value=''
    document.getElementById('password-confirm').value=''
  })

  if(bookBtn)
    bookBtn.addEventListener('click',e=>{
  e.target.textContent ='Processing...';
  const {tourId} = e.target.dataset;
  bookTour(tourId)
  })

  const alertMessage = document.querySelector('body').dataset.alert
  console.log('typeof =', typeof alertMessage);
  if(alertMessage) showAlert('success',alertMessage,20) 

    if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tourId = reviewForm.dataset.tourId; 

    createReview(tourId, review, rating);
  });
}
if(deleteTourBtns){
  deleteTourBtns.forEach(btn => {
    btn.addEventListener('click', async e => {
      const tourId = e.target.dataset.id;
      // confirm create popup for user 
      const confirmed = await showConfirmModal({
        title: 'Delete Tour',
        message: 'Are you sure you want to delete this tour? This action cannot be undone.',
        confirmText: 'Delete'
      });
      if (confirmed) deleteTour(tourId);
    });
  });
}
 


 

// account reviews: edit
let reviewIdToEdit = null;

try {
  if (
    editReviewBtns.length &&
    editReviewOverlay &&
    editReviewForm &&
    cancelEditReviewBtn &&
    editReviewTextInput &&
    editReviewRatingInput
  ) {
    // دالة لتحديث شكل ولون النجوم بصرياً
    const updateStarRatingUI = (ratingValue) => {
      const starContainer = editReviewForm.querySelector('.star-rating');
      if (!starContainer) return;
      const stars = starContainer.querySelectorAll('.star');
      stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        if (starVal <= ratingValue) {
          star.style.color = '#ffc107'; // أصفر للنجوم المختارة
        } else {
          star.style.color = '#e4e5e9'; // رمادي للباقي
        }
      });
    };

    // تفعيل الضغط على النجوم باستخدام Event Delegation
    const starContainer = editReviewForm.querySelector('.star-rating');
    if (starContainer) {
      starContainer.addEventListener('click', e => {
        const star = e.target.closest('.star');
        if (!star) return;
        
        const val = star.getAttribute('data-value');
        editReviewRatingInput.value = val;
        updateStarRatingUI(val);
      });
    }

    editReviewBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        reviewIdToEdit = e.currentTarget.dataset.id;
        editReviewTextInput.value = e.currentTarget.dataset.review;
        
        const currentRating = e.currentTarget.dataset.rating;
        editReviewRatingInput.value = currentRating;
        updateStarRatingUI(currentRating);

        editReviewOverlay.classList.add('review-edit-overlay--open');
      });
    });

    cancelEditReviewBtn.addEventListener('click', () => {
      reviewIdToEdit = null;
      editReviewOverlay.classList.remove('review-edit-overlay--open');
    });

    editReviewForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!reviewIdToEdit) return;
      updateReview(
        reviewIdToEdit,
        editReviewTextInput.value,
        editReviewRatingInput.value
      );
      editReviewOverlay.classList.remove('review-edit-overlay--open');
    });
  } else if (editReviewBtns.length) {
    console.warn('Edit review UI: some elements are missing, edit disabled.', {
      editReviewOverlay,
      editReviewForm,
      cancelEditReviewBtn,
      editReviewTextInput,
      editReviewRatingInput
    });
  }
} catch (err) {
  console.error('Edit review init error:', err);
}


// account reviews: delete
try {
  if (deleteReviewBtns.length) {
    deleteReviewBtns.forEach(btn => {
      btn.addEventListener('click', async e => {
        const reviewId = e.currentTarget.dataset.id;
        try {
          const confirmed = await showConfirmModal({
            title: 'Delete Review',
            message: 'Are you sure you want to delete this review? This action cannot be undone.',
            confirmText: 'Delete'
          });
          if (confirmed) deleteReview(reviewId);
        } catch (err) {
          console.error('showConfirmModal error:', err);
        }
      });
    });
  }
} catch (err) {
  console.error('Delete review init error:', err);
}

initCreateTourModal();
initCreateUserModal()

// create booking model
let bookingIdToDelete = null;

if (deleteBookingBtns.length) {
  deleteBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bookingIdToDelete = btn.dataset.id;
      deleteBookingOverlay.classList.add('cf-overlay--open'); // ⚠️ حطي هنا نفس الكلاس/الطريقة اللي بتفتحي بيها overlay الـ tour
    });
  });

  cancelDeleteBookingBtn.addEventListener('click', () => {
    bookingIdToDelete = null;
    deleteBookingOverlay.classList.remove('cf-overlay--open');
  });

  confirmDeleteBookingBtn.addEventListener('click', () => {
    if (bookingIdToDelete) {
      deleteBooking(bookingIdToDelete);
      deleteBookingOverlay.classList.remove('cf-overlay--open');
    }
  });
}
