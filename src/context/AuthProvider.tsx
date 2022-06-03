import { supabase } from "../config/supabaseClient";
import { useState, useEffect, useContext, createContext } from "react";
import { AuthSession, Provider, User } from "@supabase/supabase-js";

interface Props {
  children: React.ReactNode;
}

interface AuthContext {
  user: User | null;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithSocial: (provider: Provider | undefined) => Promise<void>;
}

const authContext = createContext<AuthContext>({
  user: null,
  error: "",
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signInWithSocial: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: Props) => {
  const auth = useProviderAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const useProviderAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const signIn = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signUp = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }
  };

  const signInWithSocial = async (provider: Provider | undefined) => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: provider,
    });
    if (error) {
      setError(error.message);
      return;
    }
  };

  useEffect(() => {
    const user = supabase.auth.user();
    setUser(user);

    const auth = supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        if (session === null) {
          setUser(null);
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      auth.data?.unsubscribe();
    };
  }, []);

  return {
    user,
    signIn,
    signOut,
    signUp,
    signInWithSocial,
    error,
  };
};
