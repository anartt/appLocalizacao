import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL e chave pública do Supabase
const supabaseUrl = "https://yiexskxnzhyxnmhiujvx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZXhza3huemh5eG5taGl1anZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgzMTIsImV4cCI6MjA3NzIzNDMxMn0.T0RLiHXcYffQCkiDXr8EKXCeJ1sXz41f-M5B7tRFYdI";

// Cria o cliente compatível com React Native (sem ws/realtime)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // necessário no Expo
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

// -------------------------
// Função para salvar local
// -------------------------
export const saveLocation = async (name, latitude, longitude) => {
  try {
    const { data, error } = await supabase.from('locations').insert([
      {
        nome: name,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar local:', error);
    return { success: false, error: error.message };
  }
};

// -------------------------
// Função para listar locais
// -------------------------
export const getLocations = async () => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    return { success: false, error: error.message };
  }
};

// -------------------------
// Função para deletar local
// -------------------------
export const deleteLocation = async (id) => {
  try {
    const { error } = await supabase.from('locations').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar local:', error);
    return { success: false, error: error.message };
  }
};
