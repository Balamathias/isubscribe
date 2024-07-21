"use client"

import React, { useState } from 'react'
import WidthWrapper from '@/components/WidthWrapper'
import axios from 'axios';
import generateRequestId from '@/funcs/generateRequestId';
import { buyData } from '@/lib/vtpass/services';


const VtPassTest = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null)


  const purchaseProduct = async () => {
   const requestId = generateRequestId();

    const payload = {
      request_id:requestId, // Generate a unique request ID
      serviceID: 'glo-data',
      billersCode: '08011111111', // Test phone number
      variation_code: 'glo5000', // Example variation code
      amount: 100, // Example amount
      phone: '08011111111' // Customer's phone number
    };

    const res = await buyData(payload)
    console.log("ressssssssss",res)
  
    // setLoading(true);
    // try {

     
    //   console.log("first1", API_KEY)
    //   console.log("first2", SECRET_KEY)

    //   const response = await axios.post(
    //     'https://sandbox.vtpass.com/api/pay',
    //     payload,
    //      {
    //       headers: {
    //         'api-key': API_KEY,
    //         'secret-key': SECRET_KEY,
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   );
    //   console.log('Transaction successful:', response.data);
    // } catch (error) {
    //   console.error('There was an error!', error);
    // } finally {
    //   setLoading(false);
    // }
  };
  



  return (
    <WidthWrapper  className='flex flex-col !max-w-3xl md:py-12 mt-16'>
        <h1 className=' font-bold text-lg'>VtPassTest</h1>
        {loading && <p>Loading...........</p>}
        <button className=' bg-green-600 p-2 rounded-full w-full text-white hover:opacity-60' onClick={purchaseProduct}>Buy</button>
    </WidthWrapper>
  )
}

export default VtPassTest

