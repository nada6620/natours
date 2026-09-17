// delete
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });
    if (res.status === 204) {
      showAlert('success', 'User deleted successfully!');
      window.setTimeout(() => {
        location.reload(); // إعادة تحميل الصفحة عشان الجدول يتحدث
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error deleting user!');
  }
};

// create new user
export const createUser = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users',
      data: formData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User created successfully!');
      window.setTimeout(() => location.reload(), 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error creating user');
  }
};

// edit user
export const updateUser = async (userId, formData) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data: formData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User edited successfully!');
      window.setTimeout(() => location.reload(), 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error editing user');
  }
};
