const kind = {
    eventData: {
      product: { reference: '0y7z4B3WDbiMzCJjn54V7eFx', type: 'RESERVED_ACCOUNT' },
      transactionReference: 'MNFY|73|20240701113347|000476',
      paymentReference: 'MNFY|73|20240701113347|000476',
      paidOn: '2024-07-01 11:33:48.0',
      paymentDescription: 'Bal',
      metaData: {},
      paymentSourceInformation: [
        {
          bankCode: '',
          amountPaid: 2500,
          accountName: 'Monnify Limited',
          sessionId: 'n1C6Cxa6Qd7dxBZoeP58QXLVA0TeD1pf',
          accountNumber: '0065432190'
        }
      ],
      destinationAccountInformation: {
        bankCode: '035',
        bankName: 'Wema bank',
        accountNumber: '3000101903'
      },
      amountPaid: 30000,
      totalPayable: 30000,
      cardDetails: {},
      paymentMethod: 'ACCOUNT_TRANSFER',
      currency: 'NGN',
      settlementAmount: '29990.00',
      paymentStatus: 'PAID',
      customer: { name: 'Bala Mathias', email: 'balamathias05@gmail.com' }
    },
    eventType: 'SUCCESSFUL_TRANSACTION'
  }

  const t = typeof ( [
    {
      bankCode: '',
      amountPaid: 2500,
      accountName: 'Monnify Limited',
      sessionId: 'n1C6Cxa6Qd7dxBZoeP58QXLVA0TeD1pf',
      accountNumber: '0065432190'
    }
  ])

