import { supabase } from './backend/supabase-client.js'

// Fetch contacts
async function getContacts() {
  const { data, error } = await supabase
    .from('Contacts')
    .select('*')
    
  if (error) console.error(error)
  return data
}

// Insert audit request
async function createAuditRequest(requestData) {
  const { data, error } = await supabase
    .from('Audit_Requests')
    .insert([requestData])
    
  if (error) console.error(error)
  return data
}
