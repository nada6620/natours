// delete
 import axios from 'axios';
 import { showAlert } from './alerts';

 export const deleteTour = async (tourId) => {
    try{
        const res = await axios({
            method:'DELETE',
            url:`/api/v1/tours/${tourId}`
        });
        if (res.status === 204) {
      showAlert('success', 'Tour deleted successfully!');
      window.setTimeout(() => {
        location.reload(); // إعادة تحميل الصفحة عشان الجدول يتحدث
      }, 1000);
    }

    }catch(err){
        showAlert('error', err.response.data.message || 'Error deleting tour!');
    }
 }

// get tour details 
export const getTour = async (id) => {
  try {
    const res = await axios.get(`/api/v1/tours/admin/${id}`);
    return res.data.data.data;
  } catch (err) {
    showAlert('error',  'Error get tour details');
    throw err;
  }
};


// create new tour 
export const createTour = async (formData) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/tours',
      data: formData,
    });

    if (res.data.status === 'success') {
      showAlert('success',  'Tour created successfully!');
      window.setTimeout(() => location.reload(), 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error creating tour');
  }
};

// edit tour 
export const updateTour = async (tourId, formData) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `/api/v1/tours/${tourId}`,
      data: formData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour edited successfully!');
      window.setTimeout(() => location.reload(), 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message ||'Error editing tour');
  }
};