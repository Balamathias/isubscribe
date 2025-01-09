import Empty from '@/components/Empty'
import WidthWrapper from '@/components/WidthWrapper'
import HistoryDetail from '@/components/dashboard/history/history-detail'
import HistoryDetailSkeletopn from '@/components/skeletons/history.detail.skeleton'
import { getSingleHistory } from '@/lib/supabase/history'
import React, { Suspense } from 'react'

/**
 * 
 *
 * ```js 
 {
  id: 3111,
  created_at: '2025-01-09T06:43:44.865877+00:00',
  updated_at: null,
  title: 'Meter Subscription',
  type: 'meter_topup',
  description: 'Meter subscription for 1111111111111',
  status: 'success',
  user: '261544db-235d-45e1-88f0-5511585ec789',
  email: null,
  meta_data: {
    name: null,
    type: 'Electricity Bill',
    email: 'isubscribenetwork@gmail.com',
    phone: '09154029723',
    amount: 500,
    method: 'api',
    status: 'delivered',
    channel: 'api',
    transId: '2025010907431igtxiu9mpv',
    discount: null,
    platform: 'api',
    quantity: 1,
    requestId: '2025010907431igtxiu9mpv',
    commission: 8,
    unit_price: 500,
    product_name: 'Ikeja Electric Payment - PHCN',
    total_amount: 492.5,
    transactionId: '17364050168759702444741914',
    unique_element: '1111111111111',
    convinience_fee: 0,
    service_verification: null
  },
  amount: 500,
  transaction_id: null,
  request_id: null,
  commission: 8,
  provider: null
}```
 */

const HistoryDetailPage = async ({ params }: { params: { id: string } }) => {
  const { data: history, error } = await getSingleHistory(parseInt(params.id))

  if (error || !history){
    return (
      <WidthWrapper className='mt-16 !max-w-3xl w-full'>
          <Empty
            title='History not found.'
            content="History could not be loaded at this time."
          />
      </WidthWrapper>
    )
  }

  return (
    <WidthWrapper className='mt-16 !max-w-3xl w-full'>
        <Suspense fallback={<HistoryDetailSkeletopn />}>
            <HistoryDetail history={history} />
        </Suspense>
    </WidthWrapper>
  )
}

export default HistoryDetailPage
