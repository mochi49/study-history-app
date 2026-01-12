export const env = {
  VITE_SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL as string) || "",
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string) || "",
  VITE_SUPABASE_DB_NAME:
    (import.meta.env.VITE_SUPABASE_DB_NAME as string) || "",
};
