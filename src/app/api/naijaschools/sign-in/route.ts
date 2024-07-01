import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
	const { email, password } = await req.json()

	if (email === 'matie' && password === 'matie'){
		return NextResponse.json({message: 'SUCCESS', token: nanoid(32)}, {status: 200})
	}

	return NextResponse.json({message: 'FAILED', token: null}, {status: 400})
}

