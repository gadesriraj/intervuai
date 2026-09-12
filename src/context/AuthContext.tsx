import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createClient } from '@supabase/supabase-js';

import {
  UserProfile,
  EvaluationReport,
  InterviewConfig,
} from "../types";


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  ) => Promise<void>;

  evaluationHistory: EvaluationReport[];
  addEvaluationReport: (
    report: EvaluationReport
  ) => Promise<void>;

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

const mapProfileToUser = (
  authUser: any,
  profile: any
): UserProfile => ({
  id: authUser?.id || "",
  email: authUser?.email || "",

  name:
    profile?.full_name ||
    authUser?.user_metadata?.full_name ||
    authUser?.email?.split("@")[0] ||
    "User",

  college: profile?.college || "",
  degree: profile?.degree || "",
  branch: profile?.branch || "",
  graduationYear: profile?.graduation_year || "",

  targetCompany: profile?.target_company || "",
  dreamJob: profile?.dream_job || "",
  yearsExperience: profile?.years_experience || "",

  skills: Array.isArray(profile?.skills)
    ? profile.skills
    : [],

  github: profile?.github || "",
  linkedin: profile?.linkedin || "",
  portfolio: profile?.portfolio || "",

  resumeText: profile?.resume_text || "",
  resumeScore: Number(profile?.resume_score || 0),
  resumeFileName: profile?.resume_file_name || "",
});

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
  useState<EvaluationReport[]>([]); 
useEffect(() => {
  if (!user?.id) {
    setEvaluationHistory([]);
    return;
  }

  let cancelled = false;

  const loadEvaluations = async () => {
    const { data, error } = await supabase
      .from('interview_evaluations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to load interview evaluations:',
        error
      );
      return;
    }

    if (!cancelled) {
      setEvaluationHistory(
        (data || []).map((item: any) => ({
          ...item.evaluation,
          id: item.id,
          overallScore: Number(
            item.overall_score || 0
          ),
          config: item.config,
          answers: item.answers,
          createdAt: item.created_at,
        }))
      );
    }
  };

  loadEvaluations();

  return () => {
    cancelled = true;
  };
}, [user?.id]);
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
  const restoreSession = async () => {
    try {
      const savedSession =
        localStorage.getItem(SUPABASE_SESSION_KEY);

      if (!savedSession) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const session = JSON.parse(savedSession);

      if (!session?.access_token) {
        clearSession();
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const response = await fetch(
        "/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json().catch(
        () => null
      );

      if (!response.ok || !data?.user) {
        console.warn(
          "[Auth] Session is invalid or expired."
        );

        clearSession();
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const profile = data.profile || {};

      setUser({
        id: data.user.id,
        email:
          data.user.email ||
          session.user?.email ||
          "",

        name:
          profile.full_name ||
          data.user.name ||
          data.user.email?.split("@")[0] ||
          "User",

        college: profile.college || "",
        degree: profile.degree || "",
        branch: profile.branch || "",

        graduationYear:
          profile.graduation_year || "",

        targetCompany:
          profile.target_company || "",

        dreamJob:
          profile.dream_job || "",

        yearsExperience:
          profile.years_experience || "",

        skills:
          Array.isArray(profile.skills)
            ? profile.skills
            : [],

        github:
          profile.github || "",

        linkedin:
          profile.linkedin || "",

        portfolio:
          profile.portfolio || "",

        resumeText:
          profile.resume_text || "",

        resumeScore:
          profile.resume_score || 0,

        resumeFileName:
          profile.resume_file_name || "",
      });

      setAuthLoading(false);

    } catch (error) {
      console.error(
        "[Auth] Failed to restore session:",
        error
      );

      clearSession();
      setUser(null);
      setAuthLoading(false);
    }
  };

  restoreSession();
}, []);

  /*
   * -------------------------------------------------------
   * SAVE EVALUATION HISTORY
   * -------------------------------------------------------
   */

  

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
    const profile = data.profile || {};

setUser({
  id: data.user.id,

  name:
    profile.full_name ||
    data.user.name ||
    normalizedEmail.split("@")[0],

  email:
    data.user.email ||
    normalizedEmail,

  college: profile.college || "",
  degree: profile.degree || "",
  branch: profile.branch || "",

  graduationYear:
    profile.graduation_year || "",

  targetCompany:
    profile.target_company || "",

  dreamJob:
    profile.dream_job || "",

  yearsExperience:
    profile.years_experience || "",

  skills:
    Array.isArray(profile.skills)
      ? profile.skills
      : [],

  github:
    profile.github || "",

  linkedin:
    profile.linkedin || "",

  portfolio:
    profile.portfolio || "",

  resumeText:
    profile.resume_text || "",

  resumeScore:
    profile.resume_score || 0,

  resumeFileName:
    profile.resume_file_name || "",
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
    const profile = data.profile || {};

setUser({
  id: data.user.id,

  name:
    profile.full_name ||
    data.user.name ||
    cleanName,

  email:
    data.user.email ||
    normalizedEmail,

  college: profile.college || "",
  degree: profile.degree || "",
  branch: profile.branch || "",

  graduationYear:
    profile.graduation_year || "",

  targetCompany:
    profile.target_company || "",

  dreamJob:
    profile.dream_job || "",

  yearsExperience:
    profile.years_experience || "",

  skills:
    Array.isArray(profile.skills)
      ? profile.skills
      : [],

  github:
    profile.github || "",

  linkedin:
    profile.linkedin || "",

  portfolio:
    profile.portfolio || "",

  resumeText:
    profile.resume_text || "",

  resumeScore:
    profile.resume_score || 0,

  resumeFileName:
    profile.resume_file_name || "",
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

  const addEvaluationReport = async (
  report: EvaluationReport
): Promise<void> => {
  if (!user?.id) {
    throw new Error(
      "Cannot save evaluation: user is not authenticated."
    );
  }

  const savedSession = getSavedSession();

  if (!savedSession) {
    throw new Error(
      "No active session found. Please log in again."
    );
  }

  let accessToken: string | null = null;

  try {
    const session = JSON.parse(savedSession);
    accessToken = session?.access_token || null;
  } catch {
    accessToken = null;
  }

  if (!accessToken) {
    throw new Error(
      "No valid access token found. Please log in again."
    );
  }

  const userSupabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  const { data, error } = await userSupabase
    .from("interview_evaluations")
  .insert({
  user_id: user.id,
  overall_score: Number(report.overallScore || 0),
  config: report.config || null,
  answers: report.transcript || null,
  evaluation: report,
})
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to save interview evaluation:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to save interview evaluation."
    );
  }

  const savedReport: EvaluationReport = {
    ...report,
    id: data.id,
    createdAt: data.created_at,
  };

  setEvaluationHistory((previous) => [
    savedReport,
    ...previous,
  ]);
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