import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
  "https://ttmecnsxujetavbknhnp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bWVjbnN4dWpldGF2YmtuaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU4NTUsImV4cCI6MjA1NTA4MTg1NX0.ot4EeZo4-IdYVcvUugGJUhP29HMMbvKonaUQ-cP6U38" // Use service_role here
)

// Add contact
export async function addContact(contactData) {
    // Check if the contact already exists by email and phone number
    const { data: existingContact, error: contactError } = await supabase
      .from('contacts')
      .select('id')
      .or(`email.eq.${contactData.email},phone.eq.${contactData.phone}`)
      .limit(1)
      
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
        .insert([{ email: contactData.email, phone: contactData.phone, name: contactData.name, company: contactData.company, brief: contactData.brief }])
        .select('id')
        .limit(1)
        
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
    .limit(1)
    
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
  const brief = document.getElementById('brief').value
  const company = document.getElementById('company').value  
  const name = document.getElementById('name').value
  const contactData = { email, phone, name, brief, company }
  
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