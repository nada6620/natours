const stripe = Stripe('pk_test_51TxsMeRMiGOymsT3XUd9HHWawMsxEeLK8Lg88q3JaVUrmczLYC63bM75DWQxIfIQKetkY94CqOWKL047gLJB8v2i00J1EeRFVu');
import { showAlert } from "./alerts";
import axios from "axios";

export const bookTour = async tourId =>{
    try{
        // 1) Get checkout session from API
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        )
        // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    });

    }catch(err){
        showAlert('error',err)
    }
}
