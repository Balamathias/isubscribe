import { WebhookResponse_N3T } from "@/@types/webhooks"
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    const response: WebhookResponse_N3T = await req.json()

    if (response?.status === 'success') {
        console.log("Success: ", response)
    } else {
        console.log("Other Response: ", response)
    }

    return NextResponse.json({ message: "Success!" }, { status: 200 })
}