import { supabase } from './backend/supabase-client.js'

// Add contact
async function addContact(contactData) {
    // Check if the contact already exists by email and phone number
    const { data: existingContact, error: contactError } = await supabase
      .from('Contacts')
      .select('id')
      .or(`email.eq.${contactData.email},phone.eq.${contactData.phone}`)
      .single()
      
    if (contactError && contactError.code !== 'PGRST116') {
      console.error(contactError)
      return null
    }
  
    if (existingContact) {
      // Contact already exists, return the existing contact_id
      return existingContact.id
    } else {
      // Contact does not exist, insert new contact
      const { data: newContactData, error: newContactError } = await supabase
        .from('Contacts')
        .insert([{ email: contactData.email, phone: contactData.phone }])
        .select('id')
        .single()
        
      if (newContactError) {
        console.error(newContactError)
        return null
      }
      return newContactData.id
    }
  }


// Insert audit request
async function createAuditRequest(requestData) {
  // Check if the contact already exists
  const { data: contactData, error: contactError } = await supabase
    .from('Contacts')
    .select('id')
    .eq('email', requestData.email)
    .single()
    
  if (contactError && contactError.code !== 'PGRST116') {
    console.error(contactError)
    return null
  }

  let contactId
  if (contactData) {
    // Contact exists, use the existing contact_id
    contactId = contactData.id
  } else {
    // Contact does not exist, insert new contact
    const { data: newContactData, error: newContactError } = await supabase
      .from('Contacts')
      .insert([{ email: requestData.email }])
      .select('id')
      .single()
      
    if (newContactError) {
      console.error(newContactError)
      return null
    }
    contactId = newContactData.id
  }

  // Insert audit request with the correct contact_id
  const { data: auditData, error: auditError } = await supabase
    .from('Audit_Requests')
    .insert([{ ...requestData, contact_id: contactId }])
    
  if (auditError) {
    console.error(auditError)
    return null
  }
  return auditData
}