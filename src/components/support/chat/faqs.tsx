import { Input } from '@/components/ui/input'
import React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const faqs = [
  {
    question: 'I funded my wallet but it took so much time to reflect',
    answer: 'Funding your wallet should be instant. Note that this might take up to 5-20 minutes. However, if it takes a longer time to reflect, please contact us immediately.'
  },
  {
    question: 'Why are some data plans not working?',
    answer: 'Some data plans might not work probably because they are temporarily out of stock. However, if you encounter any issue, please contact us immediately.'
  },
  {
    question: 'Why is my subscription failing?',
    answer: 'Ensure you input the proper details to proceed. Some things to keep an eye out for are: valid Network SIM selection, valid phone number matching selected SIM. If the issue persists, please ensure to reach out to us.'
  },
]

const Faqs = () => {
  return (
    <div className='flex flex-col gap-y-3 items-center justify-center mb-12'>
      {
        faqs.map((faq, index) => (
          <Collapsible key={index} className='py-2 px-3 rounded-xl bg-secondary/90 text-center'>
            <CollapsibleTrigger className='text-violet-500/90 text-lg my-2 font-semibold'>{faq.question}</CollapsibleTrigger>
            <CollapsibleContent className='flex-1 mt-2 bg-secondary/50'>
              {faq.answer}
            </CollapsibleContent>
          </Collapsible>
        ))
      }
    </div>
  )
}

export default Faqs