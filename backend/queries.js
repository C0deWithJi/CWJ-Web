import { addContact, addAuditRequest } from './database.js';

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
    total += PRICING.MOBILE_APP.base * PRICING.MOBILE_APP.platformMultiplier;
  }
  if (services.seo) {
    total += PRICING.SEO;
  }

  // Display the result
  resultDiv.innerHTML = `Estimated Cost: $${total}`;

  // Return the total for use in form submission
  return total;
}

// Handle audit request form submission
export async function handleAuditRequestFormSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const pages = document.getElementById('pages').value;
  const services = {
    web: document.getElementById('web').checked,
    ios: document.getElementById('ios').checked,
    android: document.getElementById('android').checked,
    seo: document.getElementById('seo').checked
  };
  const price = calculateEstimate(); // Calculate the price

  const auditData = { email, price, pages, services };

  const auditRequest = await addAuditRequest(auditData);
  if (auditRequest) {
    console.log('Audit request added:', auditRequest);
  } else {
    console.error('Failed to add audit request');
  }
}

// Handle contact form submission
export async function handleContactFormSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const name = document.getElementById('name').value;
  const company = document.getElementById('company').value;
  const brief = document.getElementById('brief').value;
  const contactData = { email, phone, name, company, brief };

  const contactId = await addContact(contactData);
  if (contactId) {
    console.log('Contact added with ID:', contactId);
  } else {
    console.error('Failed to add contact');
  }
}