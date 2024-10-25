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
  const { data: profile } = useGetProfile();

  const email = profile?.data?.email ?? "user@example.com";
  const name = profile?.data?.full_name ?? "User";

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandomChallenge = () =>
    crypto.getRandomValues(new Uint8Array(32));

  // Enhanced State Initialization Logic
  useEffect(() => {
    const initializeBiometricState = async () => {
      try {
        const storedState = localStorage.getItem(BIOMETRIC_ENABLED_KEY);
        let enabled = storedState === "true";

        if (enabled) {
          console.log("Checking if credentials exist...");

          // Try fetching existing credentials to verify they are available.
          const challenge = generateRandomChallenge();
          try {
            const assertion = await navigator.credentials.get({
              publicKey: {
                challenge,
                timeout: 5000,
                userVerification: "required",
                rpId: "isubscribe.vercel.app", // Make sure this matches your domain
              },
            });

            if (!assertion) {
              console.warn("No credentials returned, disabling biometrics.");
              enabled = false;
              localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
            } else {
              console.log("Credentials exist:", assertion);
            }
          } catch (error) {
            console.warn("Error fetching credentials:", error);
            enabled = false;
            localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
          }
        }

        setIsEnabled(enabled);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsEnabled(false);
      }
    };

    initializeBiometricState();
  }, []);

  const enableBiometrics = useCallback(async () => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error("Your device does not support biometric authentication.");
      }

      const challenge = generateRandomChallenge();

      const credentials = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "VTU Payment", id: "isubscribe.vercel.app" },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: name,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { userVerification: "required" },
        },
      });

      if (!credentials) {
        throw new Error("Failed to register biometric credentials.");
      }

      console.log("Biometric credentials created:", credentials);

      localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
      setIsEnabled(true);
      setError(null);
      toast.success("Biometric authentication enabled.");
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
          rpId: "isubscribe.vercel.app",
        },
      });

      if (!assertion) {
        throw new Error("Authentication failed.");
      }

      console.log("Authentication successful:", assertion);

      setError(null);
      toast.success("Authentication successful!");
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
      if (navigator.credentials?.preventSilentAccess) {
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




























// "use client";

// import { useGetProfile } from "@/lib/react-query/funcs/user";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";

// interface UseBiometricAuthResult {
//   isEnabled: boolean;
//   enableBiometrics: () => Promise<void>;
//   authenticate: () => Promise<boolean>;
//   error: string | null;
//   disableBiometrics: () => void;
// }

// export const BIOMETRIC_ENABLED_KEY = "biometric-enabled";

// export default function useBiometricAuth(): UseBiometricAuthResult {
//   const { data: profile } = useGetProfile();

//   const email = profile?.data?.email ?? "user@example.com";
//   const name = profile?.data?.full_name ?? "User";

//   const [isEnabled, setIsEnabled] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const generateRandomChallenge = () =>
//     crypto.getRandomValues(new Uint8Array(32));

//   // Enhanced state initialization with more checks and logging
//   useEffect(() => {
//     const initializeBiometricState = async () => {
//       try {
//         const storedState = localStorage.getItem(BIOMETRIC_ENABLED_KEY);
//         let enabled = storedState === "true";

//         // Extra validation: Attempt to fetch credentials only if stored state is true
//         if (enabled && navigator.credentials) {
//           try {
//             const result = await navigator.credentials.get({
//               publicKey: {
//                 challenge: generateRandomChallenge(),
//                 timeout: 5000, // Short timeout to check quickly
//                 userVerification: "required",
//               },
//             });

//             if (!result) {
//               console.warn("No credentials found, disabling biometric auth.");
//               enabled = false;
//               localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
//             }
//           } catch (getErr) {
//             console.warn("Credential fetch error:", getErr);
//             enabled = false;
//             localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
//           }
//         }

//         setIsEnabled(enabled);
//       } catch (initErr) {
//         console.error("Initialization error:", initErr);
//         setIsEnabled(false);
//       }
//     };

//     initializeBiometricState();
//   }, []);

//   const enableBiometrics = useCallback(async () => {
//     try {
//       if (!window.PublicKeyCredential) {
//         throw new Error("Your device does not support biometric authentication.");
//       }

//       const challenge = generateRandomChallenge();

//       const credentials = await navigator.credentials.create({
//         publicKey: {
//           challenge,
//           rp: { name: "VTU Payment", id: window.location.hostname },
//           user: {
//             id: new TextEncoder().encode(email),
//             name: email,
//             displayName: name,
//           },
//           pubKeyCredParams: [{ alg: -7, type: "public-key" }],
//           authenticatorSelection: { userVerification: "required" },
//         },
//       });

//       if (!credentials) {
//         throw new Error("Failed to register biometric credentials.");
//       }

//       // Store success state in localStorage and state
//       localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
//       setIsEnabled(true);
//       setError(null);
//       toast.success("Biometric authentication enabled.");
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "An error occurred.";
//       setError(message);
//       console.error("Enable biometrics error:", err);
//     }
//   }, [email, name]);

//   const authenticate = useCallback(async () => {
//     try {
//       if (!isEnabled) {
//         throw new Error("Biometric authentication is not enabled.");
//       }

//       const challenge = generateRandomChallenge();

//       const assertion = await navigator.credentials.get({
//         publicKey: {
//           challenge,
//           timeout: 60000,
//           userVerification: "required",
//           rpId: window.location.hostname,
//         },
//       });

//       if (!assertion) {
//         throw new Error("Authentication failed.");
//       }

//       setError(null);
//       toast.success("Authentication successful!");
//       return true;
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Authentication error.";
//       setError(message);
//       toast.error(
//         "Biometric authentication failed. Please try again or use another method."
//       )
//       console.error("Authentication error:", err);
//       return false;
//     }
//   }, [isEnabled]);

//   const disableBiometrics = useCallback(async () => {
//     try {
//       if (navigator.credentials?.preventSilentAccess) {
//         await navigator.credentials.preventSilentAccess();
//       }

//       localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
//       setIsEnabled(false);
//       setError(null);
//       toast.success("Biometric authentication has been disabled.");
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to disable biometrics.";
//       setError(message);
//       toast.error(message);
//       console.error("Disable biometrics error:", err);
//     }
//   }, []);

//   return { isEnabled, enableBiometrics, authenticate, error, disableBiometrics };
// }
