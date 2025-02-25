import { supabase } from '../backend/supabase-client.js';

// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 1500, perPage: 250 },
  MOBILE_APP: { base: 2000, platformMultiplier: 1.5 },
  SEO: 2000
};

// Modified calculateEstimate()
async function calculateEstimate() {
  Event.preventDefault(); // Prevent form submission

  const form = document.getElementById('auditForm');
  const resultDiv = document.getElementById('calculateEstimate');
  
  // Get form values
  const services = {
    web: form.elements.web.checked,
    ios: form.elements.ios.checked,
    android: form.elements.android.checked,
    seo: form.elements.seo.checked
  };

  const pages = parseInt(form.elements.pages.value) || 0;
  
  // Calculate total
  let total = 0;

  // Web Development
  if (services.web) {
    total += PRICING.WEB_APP.base + (pages * PRICING.WEB_APP.perPage);
  }

  // Mobile Apps
  if (services.ios || services.android) {
    const platforms = [services.ios, services.android].filter(Boolean).length;
    total += PRICING.MOBILE_APP.base * platforms * PRICING.MOBILE_APP.platformMultiplier;
  }

  // SEO
  if (services.seo) {
    total += PRICING.SEO;
  }

  // Display the result
  resultDiv.innerHTML = `Estimated Cost: $${total} - $${total * 1.4}`;
}

// Attach event listener to the form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auditForm');
  form.addEventListener('submit', submitAuditForm);
});

async function submitAuditForm(event) {
  event.preventDefault(); // Prevent form submission

  const form = document.getElementById('auditForm');
  const resultDiv = document.getElementById('calculateEstimate');

  // Get contact ID first
  const contact_id = await getOrCreateContact();
  if (!contact_id) return;

  // Get form data
  const services = {
    web: form.elements.web.checked,
    ios: form.elements.ios.checked,
    android: form.elements.android.checked,
    seo: form.elements.seo.checked
  };
  const pages = parseInt(form.elements.pages.value) || 0;
  const notes = form.elements.notes.value;

  const formData = {  
      contact_id, 
      services: JSON.stringify(services), 
      pages, 
      notes,
      email,
      createdAt: new Date().toISOString() 
  }

  try {
    // Insert into audit_requests table
    const { data: auditData, error } = await supabase
      .from('audit_requests')
      .insert([formData])
      .select();

    if (error) throw error;
    
    // Show success & reset form
    resultDiv.innerHTML = `
      <div class="p-4 mt-4 bg-green-50 text-green-700 rounded-lg">
        Success! We've received your request and will contact you at ${formData.email}.
      </div>
    `;
    
    form.reset();
    
  } catch (err) {
    resultDiv.innerHTML = `
      <div class="p-4 mt-4 bg-red-50 text-red-700 rounded-lg">
        Error submitting request: ${err.message}
      </div>
    `;
  }
}

async function getOrCreateContact() {
  const form = document.getElementById('auditForm');
  const email = form.elements.email.value.trim(); // Get email from form

  if (!email) {
    alert('Please provide your email address.');
    return null;
  }

  try {
    // Check if contact exists
    const { data: existingContact, error: lookupError } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .single(); // Assumes emails are unique

    if (existingContact) return existingContact.id;

    // Create new contact if not found
    const { data: newContact, error: createError } = await supabase
      .from('contacts')
      .upsert(
        { email },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single();

    if (createError) throw createError;
    
    return newContact.id;
    
  } catch (error) {
    console.error('Contact error:', error);
    alert('Error processing your contact information');
    return null;
  }
}
