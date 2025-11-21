import axios from "axios";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

// lib/axios.js

const api = axios.create({
  baseURL: `${supabaseUrl}/functions/v1`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${supabaseKey}`,
    apikey: supabaseKey,
  },
});

export default api;
