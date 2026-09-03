import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  UserProfile,
  EvaluationReport,
  InterviewConfig,
} from "../types";

import {
  INITIAL_USER,
  RECENT_EVALUATION_SAMPLE,
} from "../data/mockData";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => void;

  updateProfile: (
    updated: Partial<UserProfile>
  ) => void;

  evaluationHistory: EvaluationReport[];
  addEvaluationReport: (
    report: EvaluationReport
  ) => void;

  currentConfig: InterviewConfig | null;
  setCurrentConfig: (
    config: InterviewConfig | null
  ) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

const SUPABASE_SESSION_KEY = "supabase_session";
const EVALUATION_STORAGE_KEY =
  "intervuai_eval_history";
const THEME_STORAGE_KEY = "intervuai_theme";

/*
 * ---------------------------------------------------------
 * AUTH PROVIDER
 * ---------------------------------------------------------
 */

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /*
   * -------------------------------------------------------
   * USER
   * -------------------------------------------------------
   */

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /*
   * -------------------------------------------------------
   * EVALUATION HISTORY
   * -------------------------------------------------------
   */

  const [evaluationHistory, setEvaluationHistory] =
    useState<EvaluationReport[]>(() => {
      try {
        const saved = localStorage.getItem(
          EVALUATION_STORAGE_KEY
        );

        if (saved) {
          return JSON.parse(saved);
        }

        return [RECENT_EVALUATION_SAMPLE];
      } catch {
        return [RECENT_EVALUATION_SAMPLE];
      }
    });

  /*
   * -------------------------------------------------------
   * INTERVIEW CONFIG
   * -------------------------------------------------------
   */

  const [currentConfig, setCurrentConfig] =
    useState<InterviewConfig | null>(null);

  /*
   * -------------------------------------------------------
   * DARK MODE
   * -------------------------------------------------------
   */

  const [darkMode, setDarkMode] =
    useState<boolean>(() => {
      const saved =
        localStorage.getItem(
          THEME_STORAGE_KEY
        );

      return saved === "dark";
    });

  /*
   * -------------------------------------------------------
   * SESSION HELPERS
   * -------------------------------------------------------
   */

  const getSavedSession = () => {
    try {
      return localStorage.getItem(
        SUPABASE_SESSION_KEY
      );
    } catch {
      return null;
    }
  };

  const saveSession = (session: unknown) => {
    try {
      localStorage.setItem(
        SUPABASE_SESSION_KEY,
        JSON.stringify(session)
      );
    } catch (error) {
      console.error(
        "[Auth] Could not save session:",
        error
      );
    }
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(
        SUPABASE_SESSION_KEY
      );
    } catch {
      // Ignore localStorage errors
    }
  };

  /*
   * -------------------------------------------------------
   * RESTORE SESSION AFTER PAGE REFRESH
   * -------------------------------------------------------
   */

  useEffect(() => {
  try {
    const savedSession =
      localStorage.getItem("supabase_session");

    if (!savedSession) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    const session = JSON.parse(savedSession);

    if (!session?.access_token || !session?.user) {
      localStorage.removeItem(
        "supabase_session"
      );
      setUser(null);
      setAuthLoading(false);
      return;
    }

    const savedUser = session.user;

    setUser({
      ...INITIAL_USER,
      id: savedUser.id,
      name:
        savedUser.name ||
        savedUser.user_metadata?.full_name ||
        savedUser.email?.split("@")[0] ||
        "User",
      email: savedUser.email || "",
    });

    setAuthLoading(false);
  } catch (error) {
    console.error(
      "[Auth] Failed to restore session:",
      error
    );

    setUser(null);
    setAuthLoading(false);
  }
}, []);
  /*
   * -------------------------------------------------------
   * SAVE EVALUATION HISTORY
   * -------------------------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        EVALUATION_STORAGE_KEY,
        JSON.stringify(
          evaluationHistory
        )
      );
    } catch (error) {
      console.error(
        "[Evaluation] Save failed:",
        error
      );
    }
  }, [evaluationHistory]);

  /*
   * -------------------------------------------------------
   * THEME
   * -------------------------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        darkMode
          ? "dark"
          : "light"
      );

      if (darkMode) {
        document.documentElement.classList.add(
          "dark"
        );
      } else {
        document.documentElement.classList.remove(
          "dark"
        );
      }
    } catch {
      // Ignore theme storage errors
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(
      (previous) => !previous
    );
  };

  /*
   * -------------------------------------------------------
   * LOGIN
   * -------------------------------------------------------
   */

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !password
    ) {
      throw new Error(
        "Email and password are required."
      );
    }

    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      }
    );

    let data: any;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Invalid server response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Login failed."
      );
    }

    if (!data?.user) {
      throw new Error(
        "Login failed."
      );
    }

    /*
     * Save Supabase session so that
     * refreshing the browser keeps
     * the user logged in.
     */
    if (data.session) {
      saveSession({
        ...data.session,
        user: data.user,
    });
    }

    /*
     * Set application user.
     */
    setUser({
      ...INITIAL_USER,

      id: data.user.id,

      name:
        data.user.name ||
        normalizedEmail.split("@")[0],

      email:
        data.user.email ||
        normalizedEmail,
    });

    return true;
  };

  /*
   * -------------------------------------------------------
   * REGISTER
   * -------------------------------------------------------
   */

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const cleanName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!cleanName) {
      throw new Error(
        "Please enter your name."
      );
    }

    if (!normalizedEmail) {
      throw new Error(
        "Please enter your email."
      );
    }

    if (
      !normalizedEmail.includes("@")
    ) {
      throw new Error(
        "Please enter a valid email address."
      );
    }

    if (password.length < 6) {
      throw new Error(
        "Password must contain at least 6 characters."
      );
    }

    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name: cleanName,
          email: normalizedEmail,
          password,
        }),
      }
    );

    let data: any;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Invalid server response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Registration failed."
      );
    }

    if (!data?.user) {
      throw new Error(
        "Registration failed."
      );
    }

    /*
     * Save session if Supabase
     * returned one.
     *
     * IMPORTANT:
     * If email confirmation is enabled
     * in Supabase, session may be null.
     */
    if (data.session) {
      saveSession({
        ...data.session,
        user: data.user,
    });
    }

    /*
     * Set current user.
     */
    setUser({
      ...INITIAL_USER,

      id: data.user.id,

      name:
        data.user.name ||
        cleanName,

      email:
        data.user.email ||
        normalizedEmail,
    });

    return true;
  };

  /*
   * -------------------------------------------------------
   * LOGOUT
   * -------------------------------------------------------
   */

  const logout = () => {
    clearSession();
    setUser(null);
  };

  /*
   * -------------------------------------------------------
   * UPDATE PROFILE
   * -------------------------------------------------------
   */
  const updateProfile = async (
  updated: Partial<UserProfile>
): Promise<void> => {
  if (!user) {
    throw new Error("You must be logged in.");
  }

  const updatedUser: UserProfile = {
    ...user,
    ...updated,
  };

  try {
    const savedSession = getSavedSession();

    let accessToken: string | null = null;

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        accessToken = session?.access_token || null;
      } catch {
        accessToken = null;
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        degree: updatedUser.degree,
        branch: updatedUser.branch,
        graduationYear: updatedUser.graduationYear,
        targetCompany: updatedUser.targetCompany,
        dreamJob: updatedUser.dreamJob,
        yearsExperience: updatedUser.yearsExperience,
        skills: updatedUser.skills,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        portfolio: updatedUser.portfolio,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        "[Profile] Failed to save:",
        data?.error || "Unknown error"
      );

      throw new Error(
        data?.error || "Failed to save profile."
      );
    }

    // Update React state only after successful database save
    setUser(updatedUser);

    console.log(
      "[Profile] Saved successfully to Supabase:",
      data?.profile
    );
  } catch (error) {
    console.error("[Profile] Save error:", error);
    throw error;
  }
};
  /*
   * -------------------------------------------------------
   * EVALUATION HISTORY
   * -------------------------------------------------------
   */

  const addEvaluationReport = (
    report: EvaluationReport
  ) => {
    setEvaluationHistory(
      (previous) => [
        report,
        ...previous,
      ]
    );
  };

  /*
   * -------------------------------------------------------
   * PROVIDER
   * -------------------------------------------------------
   */

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated:
          Boolean(user),

        authLoading,

        login,
        register,
        logout,

        updateProfile,

        evaluationHistory,

        addEvaluationReport,

        currentConfig,

        setCurrentConfig,

        darkMode,

        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
 * ---------------------------------------------------------
 * USE AUTH
 * ---------------------------------------------------------
 */

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};