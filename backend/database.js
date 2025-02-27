import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to add a contact
export async function addContact(contactData) {
  const { data: existingContact, error: contactError } = await supabase
    .from('contacts')
    .select('id')
    .or(`email.eq.${contactData.email},phone.eq.${contactData.phone}`)
    .single();
    
  if (contactError && contactError.code !== 'PGRST116') {
    console.error(contactError);
    return null;
  }

  if (existingContact) {
    return existingContact.id;
  } else {
    const { data: newContactData, error: newContactError } = await supabase
      .from('contacts')
      .insert([{ email: contactData.email, phone: contactData.phone, name: contactData.name, company: contactData.company, brief: contactData.brief }])
      .select('id')
      .single();
      
    if (newContactError) {
      console.error(newContactError);
      return null;
    }
    return newContactData.id;
  }
}

// Function to add an audit request
export async function addAuditRequest(auditData) {
  const { data, error } = await supabase
    .from('audit_requests')
    .insert([auditData])
    .select();
    
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

export default supabase;