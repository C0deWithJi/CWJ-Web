import { supabase } from '../backend/supabase-client.js';

// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 1500, perPage: 250 },
  MOBILE_APP: { base: 2000, platformMultiplier: 1.5 },
  SEO: 2000
};

// Function to calculate estimate
function calculateEstimate() {
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
  if (services.web) {
    total += PRICING.WEB_APP.base + (pages * PRICING.WEB_APP.perPage);
  }
  if (services.ios || services.android) {
    total += PRICING.MOBILE_APP.base * PRICING.MOBILE_APP.platformMultiplier;
  }
  if (services.seo) {
    total += PRICING.SEO;
  }

  // Display the result
  resultDiv.innerHTML = `Estimated Cost: $${total}`;
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('auditForm');
  const email = form.elements.email.value.trim(); // Get email from form

  if (!email) {
    alert('Please provide your email address.');
    return;
  }

  try {
    // Check if contact exists
    const { data: existingContact, error: lookupError } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .single(); // Assumes emails are unique

    if (lookupError && lookupError.code !== 'PGRST116') {
      throw lookupError;
    }

    let contactId;
    if (existingContact) {
      contactId = existingContact.id;
    } else {
      // Create new contact if not found
      const { data: newContact, error: createError } = await supabase
        .from('contacts')
        .insert({ email })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }
      contactId = newContact.id;
    }

    // Calculate and display the estimate
    calculateEstimate();

  } catch (error) {
    console.error('Contact error:', error);
    alert('Error processing your contact information');
  }
}

// Attach event listeners to the form and checkboxes
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auditForm');
  form.addEventListener('submit', handleFormSubmit);

  // Attach event listeners to checkboxes and pages input
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateEstimate);
  });

  const pagesInput = form.elements.pages;
  pagesInput.addEventListener('input', calculateEstimate);
});
