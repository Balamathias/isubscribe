"use client";

import { useGetProfile } from "@/lib/react-query/funcs/user";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseBiometricAuthResult {
  isEnabled: boolean;
  enableBiometrics: () => Promise<void>;
  authenticate: () => Promise<boolean>;
  error: string | null;
  disableBiometrics: () => void;
}

export const BIOMETRIC_ENABLED_KEY = "biometric-enabled";

export default function useBiometricAuth(): UseBiometricAuthResult {
  const { data: profile } = useGetProfile()

  const email = profile?.data?.email
  const name = profile?.data?.full_name

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedState = localStorage.getItem(BIOMETRIC_ENABLED_KEY);
    setIsEnabled(storedState === "true");
  }, []);

  const generateRandomChallenge = () => 
    crypto.getRandomValues(new Uint8Array(32));
  
  const enableBiometrics = useCallback(async () => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error("Your device does not support biometric authentication.");
      }
  
      const challenge = generateRandomChallenge();
  
      const credentials = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "VTU Payment" },
          user: {
            id: new TextEncoder().encode(email ?? "default-user"),
            name: email ?? "user",
            displayName: name ?? "user",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { userVerification: "required" },
        },
      });
  
      if (!credentials) {
        throw new Error("Failed to register biometric credentials.");
      }
  
      localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
      setIsEnabled(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
      console.error("Enable biometrics error:", err);
    }
  }, [email, name]);
  

  const authenticate = useCallback(async () => {
    try {
      if (!isEnabled) {
        throw new Error("Biometric authentication is not enabled.");
      }
  
      const challenge = generateRandomChallenge();
  
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        },
      });
  
      if (!assertion) {
        throw new Error("Authentication failed.");
      }
  
      setError(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication error.";
      setError(message);
      toast.error(message);
      console.error("Authentication error:", err);
      return false;
    }
  }, [isEnabled]);
  

  const disableBiometrics = useCallback(async () => {
    try {
      if (navigator.credentials && navigator.credentials.preventSilentAccess) {
        await navigator.credentials.preventSilentAccess();
      }
  
      localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
      setIsEnabled(false);
      setError(null);
  
      toast.success("Biometric authentication has been disabled.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to disable biometrics.";
      setError(message);
      toast.error(message);
      console.error("Disable biometrics error:", err);
    }
  }, []);
  

  return { isEnabled, enableBiometrics, authenticate, error, disableBiometrics };
}