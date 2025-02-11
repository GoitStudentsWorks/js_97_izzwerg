import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const subscriptionForm = document.getElementById('subscriptionForm');
const userSubmit = document.getElementById('user-submit');

const BASE_URL = 'https://energyflow.b.goit.study/api/subscription';

subscriptionForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();

  const userEmail = userSubmit.value;

  if (!validateEmail(userEmail)) {
    iziToast.info({
      title: 'Info',
      message: 'Enter a valid email',
    });
    return;
  }

  try {
    const response = await axios.post(BASE_URL, { email: userEmail });
    subscriptionForm.reset();
    if (response.status === 201) {
      iziToast.info({
        title: 'Info',
        message:
          "We're excited to have you on board! 🎉 Thank you for subscribing to new exercises on Energy Flow. You've just taken a significant step towards improving your fitness and well-being.",
      });
    }
  } catch (response) {
    if (response.message === 'Request failed with status code 409') {
      subscriptionForm.reset();
      iziToast.info({
        title: 'Info',
        message: 'Subscription already exists',
      });
      return;
    } else {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, an error occurred while verifying an email. Please try again!',
      });
    }
  }
}

function validateEmail(email) {
  const regex = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return regex.test(email);
}
