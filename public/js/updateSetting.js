import {showAlert} from './alerts'
import axios from 'axios'

// type = data , password
export const updateSettings = async (data,type)=>{
 try{
    const url = type==='password' ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
    :'http://127.0.0.1:3000/api/v1/users/updateMe'
   console.log(data);
console.log(data instanceof FormData);
    const res = await axios ({
        method:'PATCH',
        url,
        data
    })

    if(res.data.status==='success'){
        showAlert('success',`${type.toUpperCase()} updated successfully! `)
    }

 }catch(err){
  showAlert('error', err.response.data.message)
 }
    
}