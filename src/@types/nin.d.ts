
export interface NINRequestBody {
    nin: string;
  }
  
export interface NINResponseBody {
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
    responseBody: {
      nin: string;
      lastName: string;
      firstName: string;
      middleName?: string;
      dateOfBirth: string;
      gender: string;
      mobileNumber: string;
    } | null;
  }
  
export interface ServerActionResponse {
    data: NINResponseBody | null;
    error: string | null;
  }
  