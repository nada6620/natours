import axios from 'axios';
import { showAlert } from './alerts';

export const deleteBooking = async (bookingId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/bookings/${bookingId}`
    });

    if (res.status === 204) {
      showAlert('success', 'Booking deleted successfully!');
      window.setTimeout(() => {
        location.reload(); // الجدول يتحدث
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error deleting booking!');
  }
};