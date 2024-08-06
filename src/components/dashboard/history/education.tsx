import Status from '@/components/status'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import type { Status as StatusType } from '@/types/constants'
import { Tables } from '@/types/database'
import React from 'react'

const Education = ({ history }: { history: Tables<'history'> }) => {
  const metadata = JSON.parse(history?.meta_data?.toString()! ?? '{}') as any
  console.log(metadata)
  return (
    <div className="flex flex-col gap-y-3 py-3">
      <div className='flex flex-col bg-card/70 rounded-xl justify-center items-center gap-y-1 p-4'>
        <Status status={history?.status as StatusType} type={'image'} />
        <h2 className='text-base md:text-lg tracking-tighter font-semibold'>{history?.title}</h2>
        <p className='text-sm md:text-base tracking-tighter text-muted-foreground'>{history?.description}</p>
      </div>

      <div className='flex flex-col bg-card/70 rounded-xl justify-center items-center gap-y-1 p-4'>
        <Table>
          <TableCaption>Subscription Details:</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Attrs</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='text-lg'>
              <TableCell>Amount</TableCell>
              <TableCell className='justify-end'>{formatNigerianNaira(history?.amount!)}</TableCell>
            </TableRow>

            <TableRow className='text-green-500 text-lg'>
              <TableCell>Pin</TableCell>
              <TableCell className='justify-end'>{metadata?.pin}</TableCell>
            </TableRow>

            <TableRow className='text-blue-600 text-lg'>
              <TableCell>Serial Number</TableCell>
              <TableCell className='justify-end'>{metadata?.serial}</TableCell>
            </TableRow>

            <TableRow className=''>
              <TableCell>Email</TableCell>
              <TableCell className='justify-end'>{metadata?.email}</TableCell>
            </TableRow>

            <TableRow className=''>
              <TableCell>Phone Number</TableCell>
              <TableCell className='justify-end'>{metadata?.phone}</TableCell>
            </TableRow>
            <TableRow className=''>
              <TableCell>Transaction ID</TableCell>
              <TableCell className='justify-end'>{metadata?.transactionId}</TableCell>
            </TableRow>
            <TableRow className=''>
              <TableCell>Profile Code ID</TableCell>
              <TableCell className='justify-end'>{metadata?.profile_code}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Education