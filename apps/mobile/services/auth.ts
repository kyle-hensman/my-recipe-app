import { createAuthClient } from "better-auth/react"
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins"
import * as SecureStore from "expo-secure-store";
import { Session, User } from "better-auth";

const authClient = createAuthClient({
  baseURL: "http://10.0.2.2:5050",
  plugins: [
    expoClient({
      scheme: "my-recipe-app",
      storagePrefix: "my-recipe-app_",
      storage: SecureStore,
    }),
    emailOTPClient()
  ]
});

type AuthStatus = 'unauthorized' | 'pending' | 'logged-in';

export function auth(): {
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  getSession: () => Promise<{ session: Session, user: User } | null>;
  verifyCode: (email: string, otp: string) => Promise<boolean>;
} {
  let status: AuthStatus = 'unauthorized';

  authClient.getSession().then((session) => {
    status = session !== null && session !== undefined ? 'logged-in' : 'unauthorized';
  });

  return {
    status,
    signIn: async (email: string, password: string) => {
      console.log("signing in...");

      try {
        const response = await authClient.signIn.email({
          email,
          password,
        });
  
        if (response.error) {
          console.error(response.error);
          return false;
        }
        
        if (response && response.data && response.data.user) {
          console.log("logged in...");
          return true;
        }
        
        console.error("Sign-in Error: Error signing in.");
        return false;
      } catch (error) {
        console.error("Sign-in Error: ", error);
        return false;
      }
    },
    signUp: async (name: string, email: string, password: string) => {
      console.log("signing up...");

      try {
        const response = await authClient.signUp.email({
          name,
          email,
          password,
        })
  
        if (response.error) {
          console.error(response.error);
          return false;
        }
        
        if (response && response.data && response.data.user) {
          return true;
        }
        
        console.error("Sign-up Error: Error signing up.");
        return false;
      } catch (error) {
        console.error("Sign-up Error: ", error);
        return false;
      }
    },
    signOut: async () => {
      console.log("signing out...");

      try {
        const response = await authClient.signOut();
  
        if (response.error) {
          console.error(response.error);
          return false;
        }
        
        if (response && response.data && response.data.success) {
          return true;
        }
        
        console.error("Sign-up Error: Error signing up.");
        return false;
      } catch (error) {
        console.error("Sign-up Error: ", error);
        return false;
      }
    },
    getSession: async () => {
      console.log("getting session...");

      try {
        const response = await authClient.getSession();
  
        if (response.error) {
          console.error(response.error);
          return Promise.resolve(null);
        }
        
        if (response && response.data) {
          return Promise.resolve(response.data);
        }
        
        // console.error("Get-session Error: Error getting session.");
        return Promise.resolve(null);
      } catch (error) {
        // console.error("Get-session Error: ", error);
        return Promise.resolve(null);
      }
    },
    verifyCode: async (email:string, otp: string) => {
      console.log("verifying code...");

      try {
        const response = await authClient.emailOtp.verifyEmail({
          email,
          otp
        });
  
        if (response.error) {
          console.error(response.error);
          return false;
        }
        
        if (response && response.data && response.data.user) {
          return true;
        }
        
        console.error("Verify-code Error: Error signing up.");
        return false;
      } catch (error) {
        console.error("Verify-code Error: ", error);
        return false;
      }
    }
  }
}