// api.js — wrapper de Supabase para el sitio público
import { supabase } from '../lib/supabase';

// ── PRODUCTS ──
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  if (error) throw error;
  return data;
};

export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// ── GALLERY ──
export const getGallery = async (product = null) => {
  let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (product) query = query.eq('product', product);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// ── CONTACT ──
export const sendContact = async (formData) => {
  const { data, error } = await supabase.from('contacts').insert([formData]).select().single();
  if (error) throw error;
  return data;
};
