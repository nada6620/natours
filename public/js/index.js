import{login,logout,signup} from './login';
 
import { dispalyMap } from './mapBox';

import {updateSettings} from './updateSetting'

import { bookTour } from './stripe';

 import { showAlert } from './alerts';

// Dom element 
 
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const mapBox = document.getElementById('map');
const logoutButton = document.querySelector('.nav__el--logout');

const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

const bookBtn=document.getElementById('book-tour');

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
  
if(logoutButton) logoutButton.addEventListener('click',logout)


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