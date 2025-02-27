import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Replace these with your actual Supabase URL and key
const SUPABASE_URL = 'https://ttmecnsxujetavbknhnp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bWVjbnN4dWpldGF2YmtuaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU4NTUsImV4cCI6MjA1NTA4MTg1NX0.ot4EeZo4-IdYVcvUugGJUhP29HMMbvKonaUQ-cP6U38';

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