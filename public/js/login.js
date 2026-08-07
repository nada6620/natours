 import axios from 'axios';
 import { showAlert } from './alerts';
 
 console.log('signup script loaded');

 export const login = async (email,password) =>{
    try{
     const res = await axios({
        method:'POST',
        url:'/api/v1/users/login',
        data:{email,password}
     })

       console.log(res.data);

      if(res.data.status==='success'){
        showAlert('success','Logged in successfully!')
        window.location.replace('/');
      }


     } catch(err){
  showAlert(
    'error',
    err.response?.data?.message || err.message
  );
     }
 }

  export const signup = async (name,email,password,passwordConfirm) =>{
    try{
     const res = await axios({
        method:'POST',
        url:'/api/v1/users/signUp',
        data:{name,email,password,passwordConfirm}
     })

       console.log(res.data);

      if(res.data.status==='success'){
        showAlert('success','Create an account successfully!')
        window.location.replace('/');
      }
     } catch(err){
  showAlert(
    'error',
    err.response?.data?.message || err.message
  );
     }
 }

 export const logout = async ()=>{
    try{
    const res = await axios({
        method:'GET',
        url:'/api/v1/users/logout'
     })
     if ((res.data.status === 'success')) location.reload(true);
    }catch(err){
    showAlert(
    'error',
    err.response?.data?.message || err.message
  );
    }
 }


