"use client"

import React, { useState } from 'react'
import WidthWrapper from '@/components/WidthWrapper'
import axios from 'axios';


const VtPassTest = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null)
  const API_KEY = "97c1a48580798b2a4d0472550647af42"
  const PUBLIC_KEY = "PK_571559ede17d898c8602a7633fdd48f7a6e5c3fcdd7"
  const SECRET_KEY = "SK_244392795d2ed46183355c47a0bc44a83fb3b32bc58"


  const purchaseProduct = async () => {
   const requestId = generateRequestId();
   console.log("REEEEEEEEEq", requestId)

    const payload = {
      request_id:requestId, // Generate a unique request ID
      serviceID: 'glo-data',
      billersCode: '08011111111', // Test phone number
      variation_code: 'glo100', // Example variation code
      amount: 100, // Example amount
      phone: '08011111111' // Customer's phone number
    };
  
    setLoading(true);
    try {

     
      console.log("first1", API_KEY)
      console.log("first2", SECRET_KEY)

      const response = await axios.post(
        'https://sandbox.vtpass.com/api/pay',
        payload,
         {
          headers: {
            'api-key': API_KEY,
            'secret-key': SECRET_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Transaction successful:', response.data);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };
  



  return (
    <WidthWrapper  className='flex flex-col !max-w-3xl md:py-12 mt-16'>
        <h1>VtPassTest</h1>
        <div></div>
        {loading && <p>Loading...........</p>}
        <button className=' bg-green-600 p-2 rounded-full w-full text-white hover:opacity-60' onClick={purchaseProduct}>Buy</button>
    </WidthWrapper>
  )
}

export default VtPassTest




function generateRequestId() {
  const date = new Date();
  // Set to Africa/Lagos timezone (GMT+1)
  date.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  // Get date components
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0'); // Ensure 2-digit 24-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Format as YYYYMMDDHHII
  const dateTimeString = `${year}${month}${day}${hours}${minutes}`;

  // Generate a random alphanumeric string for uniqueness
  const randomString = Math.random().toString(36).substring(2, 14); // Length should be at least 12 characters

  // Concatenate to ensure at least 12 characters with numeric first 12
  const requestId = `${dateTimeString}${randomString}`;

  return requestId;
}

