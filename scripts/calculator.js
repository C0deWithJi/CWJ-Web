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
  resultDiv.innerHTML = `Estimated Cost: $${total} - $${total * parseFloat(1.2)}`;
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
    // Store the email in the database
    const { data, error } = await supabase
      .from('contacts')
      .insert({ email });

    if (error) {
      throw error;
    }

    alert('Email stored successfully!');
    form.reset(); // Reset the form after submission

  } catch (error) {
    console.error('Error storing email:', error);
    alert('Error storing your email. Please try again.');
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
