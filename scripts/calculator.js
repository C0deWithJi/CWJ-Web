// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 1500, perPage: 250 },
  MOBILE_APP: { base: 2000, platformMultiplier: 1.5 },
  SEO: 2000
};

// Modified calculateEstimate()
async function calculateEstimate() {
  const form = document.getElementById('auditForm');
  const resultDiv = document.getElementById('estimateResult');
  
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

  // Display result
  resultDiv.innerHTML = `
    <div class="p-4 mt-4 bg-blue-50 rounded-lg">
      <h3 class="text-xl font-semibold">
        Estimated Cost: $${total.toLocaleString()} – $${Math.round(total * 1.2).toLocaleString()}
      </h3>
      <p class="text-sm text-gray-600 mt-2">
        (Higher range accounts for potential complexity)
      </p>
    </div>
  `;


  // Get contact ID (assuming you have one)
  const contact_id = await getOrCreateContact(); // Implement this!

  // Save audit request
  await submitAuditForm({
    services: selectedServices,
    pages: pageCount,
    notes: specialNotes,
    contact_id
  });
}


// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener to web checkbox to show/hide pages
  document.getElementById('webCheckbox').addEventListener('change', function() {
    const pagesField = document.querySelector('.pages-field');
    pagesField.style.display = this.checked ? 'block' : 'none';
  });
});

async function submitAuditForm(data) {
  const { services, pages, notes, contact_id } = data;

  try {
    // Insert into audit_requests table
    const { data: auditData, error } = await supabase
      .from('audit_requests')
      .insert([{ 
        contact_id, 
        services: JSON.stringify(services), 
        pages, 
        notes 
      }])
      .select();

    if (error) throw error;
    
    console.log('Audit saved:', auditData);
    return auditData[0].id;
  } catch (err) {
    alert('Failed to save audit: ' + err.message);
    return null;
  }
}

