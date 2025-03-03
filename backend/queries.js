import { addContact } from './database.js';

// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 1500, perPage: 250 },
  MOBILE_APP: { base: 2000, platformMultiplier: 1.5 },
  SEO: 2000
};

// Function to calculate estimate
export function calculateEstimate() {
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
    if (services.ios && services.android) {
      total += PRICING.MOBILE_APP.base * PRICING.MOBILE_APP.platformMultiplier;
    }
    total += PRICING.MOBILE_APP.base + (pages * PRICING.WEB_APP.perPage);
  }
  if (services.seo) {
    total += PRICING.SEO;
  }

  // Display the result
  resultDiv.innerHTML = `Estimated Cost: $${total}`;

  // Return the total for use in form submission
  return total;
}

// Handle contact form submission
export async function handleContactFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const name = document.getElementById('name').value;
  const company = document.getElementById('company').value;
  const brief = document.getElementById('brief').value;
  const contactData = { email, phone, name, company, brief };

  const contactId = await addContact(contactData);
  const formMessage = document.getElementById('formMessage');

  if (contactId) {
    formMessage.classList.remove('hidden');
    formMessage.classList.add('bg-green-100', 'text-green-700');
    formMessage.textContent = 'Thank you! Your information has been submitted. We will be in touch soon!';
    form.reset();
  } else {
    formMessage.classList.remove('hidden');
    formMessage.classList.add('bg-red-100', 'text-red-700');
    formMessage.textContent = 'Sorry for the inconveience, there was an error submitting your information. Please try again.';
  }
}