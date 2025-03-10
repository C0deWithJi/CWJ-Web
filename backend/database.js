import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or Key');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// Function to add a contact
export async function addContact(contactData) {
  const { data: existingContact, error: contactError } = await supabase
    .from('contacts')
    .select('name')
    .eq('name', contactData.name)
    .limit(1);    

  if (contactError) {
    console.error("Error checking existing contact", contactError);
    return null;
  }

  if (existingContact.length > 0) {
    return existingContact.id[0].id;
  } else {
    const { data: newContactData, error: newContactError } = await supabase
      .from('contacts')
      .insert([{ email: contactData.email, phone: contactData.phone, name: contactData.name, company: contactData.company, brief: contactData.brief }])
      .select('id')
      .single();
      
    if (newContactError) {
      console.error("Error adding new contact", newContactError);
      return null;
    }
    return newContactData.id;
  }
}

export default supabase;