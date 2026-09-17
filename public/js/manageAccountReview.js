import axios from 'axios';
import { showAlert } from './alerts';

export const updateReview = async (reviewId, review, rating) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: { review, rating }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review updated successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async reviewId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`
    });

    if (res.status === 204) {
      showAlert('success', 'Review deleted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};