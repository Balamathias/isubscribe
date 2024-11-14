'use server'

import axios from "axios";

interface ResolveAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

interface ValidateCustomerResponse {
  status: boolean;
  message: string;
}

interface CreateVirtualAccountResponse {
  status: boolean;
  message: string;
  data: {
    bank: {
      name: string;
      id: number;
      slug: string;
    };
    account_name: string;
    account_number: string;
    assigned: boolean;
    currency: string;
    metadata: any | null;
    active: boolean;
    id: number;
    created_at: string;
    updated_at: string;
    assignment: {
      integration: number;
      assignee_id: number;
      assignee_type: string;
      expired: boolean;
      account_type: string;
      assigned_at: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      risk_action: string;
    };
  };
}

interface VirtualAccount {
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    risk_action: string;
    international_format_phone: string | null;
  };
  bank: {
    name: string;
    id: number;
    slug: string;
  };
  id: number;
  account_name: string;
  account_number: string;
  created_at: string;
  updated_at: string;
  currency: string;
  split_config: {
    subaccount: string;
  };
  active: boolean;
  assigned: boolean;
}

interface ListVirtualAccountsResponse {
  status: boolean;
  message: string;
  data: VirtualAccount[];
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}

interface VirtualAccountDetails {
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata: {
      calling_code: string;
    };
    risk_action: string;
    international_format_phone: string | null;
  };
  bank: {
    name: string;
    id: number;
    slug: string;
  };
  id: number;
  account_name: string;
  account_number: string;
  created_at: string;
  updated_at: string;
  currency: string;
  split_config: string;
  active: boolean;
  assigned: boolean;
}

interface GetVirtualAccountResponse {
  status: boolean;
  message: string;
  data: VirtualAccountDetails;
}

interface RequeryVirtualAccountResponse {
  status: boolean;
  message: string;
}

const PAYSTACK_SECRET_KEY = process.env.NEXT_PAYSTACK_SECRET_KEY;
const PAYSTACK_URL = process.env.NEXT_PAYSTACK_URL;

/**
 * Resolves a bank account using Paystack's API.
 * @param accountNumber - The account number to resolve.
 * @param bankCode - The bank code associated with the account.
 * @returns The resolved account information or an error message.
 */
export async function resolveAccount(
  accountNumber: string,
  bankCode: string
): Promise<ResolveAccountResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not defined");
  }

  try {
    const response = await axios.get<ResolveAccountResponse>(
      `${PAYSTACK_URL}/bank/resolve`,
      {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error resolving account:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to resolve account");
  }
}


/**
 * Validates a customer using Paystack's identification API.
 * @param customerCode - The customer code to identify.
 * @param country - The country code (e.g., "NG" for Nigeria).
 * @param type - The type of identification (e.g., "bank_account").
 * @param accountNumber - The customer's bank account number.
 * @param bvn - The customer's Bank Verification Number (BVN).
 * @param bankCode - The customer's bank code.
 * @param firstName - The customer's first name.
 * @param lastName - The customer's last name.
 * @returns A response indicating the success or failure of the customer identification.
 */
export async function validateCustomer(
  customerCode: string,
  country: string,
  type: string,
  accountNumber: string,
  bvn: string,
  bankCode: string,
  firstName: string,
  lastName: string
): Promise<ValidateCustomerResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not defined");
  }

  try {
    const response = await axios.post<ValidateCustomerResponse>(
      `${PAYSTACK_URL}/customer/${customerCode}/identification`,
      {
        country,
        type,
        account_number: accountNumber,
        bvn,
        bank_code: bankCode,
        first_name: firstName,
        last_name: lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error validating customer:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to validate customer");
  }
}

/**
 * Creates a dedicated virtual account for a specified customer.
 * @param customerCode - The customer code for whom the virtual account will be created.
 * @param preferredBank - The preferred bank slug, e.g., "titan-paystack".
 * @returns The response data containing virtual account details.
 */
export async function createVirtualAccount(
  {
    customerCode,
    preferredBank,
    first_name,
    last_name,
    phone
  }:{
    customerCode: string,
    preferredBank: 'test-bank' | 'wema-bank' | 'titan-paystack',
    first_name?: string,
    last_name?: string,
    phone?: string
  }
): Promise<CreateVirtualAccountResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not defined");
  }

  try {
    const response = await axios.post<CreateVirtualAccountResponse>(
      `${PAYSTACK_URL}/dedicated_account`,
      {
        customer: customerCode,
        preferred_bank: preferredBank,
        first_name,
        last_name,
        phone
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating virtual account:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create virtual account");
  }
}


/**
 * Fetches all dedicated virtual accounts from Paystack.
 * @returns The response data containing a list of virtual accounts.
 */
export async function listVirtualAccounts(): Promise<ListVirtualAccountsResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not defined");
  }

  try {
    const response = await axios.get<ListVirtualAccountsResponse>(
      `${PAYSTACK_URL}/dedicated_account`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching virtual accounts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch virtual accounts");
  }
}


/**
 * Fetches details of a specific dedicated virtual account from Paystack.
 * @param dedicatedAccountId - The ID of the dedicated virtual account to fetch.
 * @returns The response data containing details of the virtual account.
 */
export async function getVirtualAccount(
  dedicatedAccountId: string
): Promise<GetVirtualAccountResponse> {
  try {
    const response = await axios.get<GetVirtualAccountResponse>(
      `${PAYSTACK_URL}/dedicated_account/${dedicatedAccountId}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching virtual account:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch virtual account");
  }
}

/**
 * Requeries a customer's dedicated virtual account for any unprocessed transactions.
 * @param accountNumber - The account number of the dedicated virtual account.
 * @param providerSlug - The slug of the bank provider (e.g., "wema-bank" or "titan-paystack").
 * @param date - Optional: A specific date (in yyyy-mm-dd format) to check for transactions.
 * @returns The response message indicating that the requery process has been triggered.
 */
export async function requeryVirtualAccount(
  accountNumber: string,
  providerSlug: string,
  date?: string
): Promise<RequeryVirtualAccountResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not defined");
  }

  try {
    const response = await axios.get<RequeryVirtualAccountResponse>(
      `${PAYSTACK_URL}/dedicated_account/requery`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          account_number: accountNumber,
          provider_slug: providerSlug,
          ...(date && { date }),
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error requerying virtual account:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to requery virtual account");
  }
}
