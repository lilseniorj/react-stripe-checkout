import React, {useState} from 'react';
import "bootswatch/dist/lux/bootstrap.min.css"
import './App.css';
import { loadStripe } from "@stripe/stripe-js";

import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import axios from "axios";


const stripePromise = loadStripe("pk_test_51MwzQWAn1r3S3CfvVeSzMKr3IwB4gQXBAsqH7Y7KwG4VCJ8K1GTUrCfvi84vkAtyNGPJNsQK6mms6uKWe1IGhQLK00bzGLddbv");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      // console.log(paymentMethod)
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 10000, //cents
          }
        );
        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  console.log(!stripe || loading);


  return (
    <form onSubmit={handleSubmit} className='card card-body'>

    <img
      src="https://www.freepnglogos.com/uploads/keyboard-png/origin-edition-razer-red-blackwidow-ultimate-keyboard-38.png"
      alt='keyboard'
      className='img-fluid'
    />

    <h3 className='text-center my-12'>Price: 100$</h3>

    <div className='form-group'>
      <CardElement />
    </div>

    <button disabled={!stripe} className='btn btn-success'>
      {loading ? (
        <div className='spinner-border text-light' role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      ) : (
        "Buy"
      )}
      </button>
    </form>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className='container p-4'>
        <div className='row h-100'>
          <div className='col-md-4 offset-md-4 h-100'>
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
