import { EmailOtpType } from "@supabase/supabase-js";

type UserMetadata = {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
};
  
type IdentityData = {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
};
  
type Identity = {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: IdentityData;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
};
  
type User = {
    id: string;
    aud: string;
    role: string;
    email: string;
    phone: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: UserMetadata;
    identities: Identity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
};
  
type EmailData = {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: EmailOtpType;
    site_url: string;
    token_new: string;
    token_hash_new: string;
};
  
export type SupabaseAuthResponse = {
    user: User;
    email_data: EmailData;
};
  