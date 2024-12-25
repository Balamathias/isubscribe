"use server"

import { NINRequestBody, NINResponseBody } from "@/@types/nin";
import { ServerActionResponse } from "@/@types/nin";
import { getUserMonnifyToken } from "@/lib/monnify/actions";

export const verifyNIN = async (nin: string): Promise<ServerActionResponse> => {
  try {
    const token = (await getUserMonnifyToken())?.data?.responseBody?.accessToken;

    if (!token) {
      return {
        data: null,
        error: "Authorization token is missing."
      };
    }

    const endpoint = `${process.env.NEXT_MONNIFY_BASE_URL}/vas/nin-details`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nin } as NINRequestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        data: null,
        error: errorResponse.responseMessage || "Failed to verify NIN."
      };
    }

    const data = (await response.json()) as NINResponseBody;
    return {
      data,
      error: null
    };
  } catch (error: any) {
    console.error("Error verifying NIN:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred."
    };
  }
};
