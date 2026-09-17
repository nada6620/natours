import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReview = async (reviewId) => {
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
    showAlert(
      'error',
      err.response?.data?.message || 'Error deleting review!'
    );
  }
};