import { supabase } from '../backend/supabase-client.js'

// Add contact
export async function addContact(contactData) {
    // Check if the contact already exists by email and phone number
    const { data: existingContact, error: contactError } = await supabase
      .from('contacts')
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
        .from('contacts')
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
export async function createAuditRequest(requestData) {
  // Check if the contact already exists
  const { data: contactData, error: contactError } = await supabase
    .from('contacts')
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
      .from('contacts')
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
    .from('audit_requests')
    .insert([{ ...requestData, contact_id: contactId }])
    
  if (auditError) {
    console.error(auditError)
    return null
  }
  return auditData
}
// Handle contact form submission
export async function handleContactFormSubmit(event) {
  event.preventDefault()
  const email = document.getElementById('email').value
  const phone = document.getElementById('phone').value
  const contactData = { email, phone }
  const brief = document.getElementById('brief').value
  const company = document.getElementById('company').value  
  const name = document.getElementById('name').value
  
  const contactId = await addContact(contactData)
  if (contactId) {
    console.log('Contact added with ID:', contactId)
  } else {
    console.error('Failed to add contact')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contactForm').addEventListener('submit', handleContactFormSubmit)
})