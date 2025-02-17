// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 1500, perPage: 250 },
  MOBILE_APP: { base: 2000, platformMultiplier: 1.5 },
  SEO: 2000
};

// Initialize Supabase
const supabaseUrl = 'https://ttmecnsxujetavbknhnp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bWVjbnN4dWpldGF2YmtuaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU4NTUsImV4cCI6MjA1NTA4MTg1NX0.ot4EeZo4-IdYVcvUugGJUhP29HMMbvKonaUQ-cP6U38';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener to web checkbox to show/hide pages
  document.getElementById('webCheckbox').addEventListener('change', function() {
    const pagesField = document.querySelector('.pages-field');
    pagesField.style.display = this.checked ? 'block' : 'none';
    calculateEstimate(); // Update estimate on change
  });

  // Add event listeners to other checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', calculateEstimate);
  });

  // Add event listener to pages dropdown
  document.querySelector('select[name="pages"]').addEventListener('change', calculateEstimate);
});

async function submitAuditForm(event) {
  event.preventDefault(); // Prevent form submission

  const form = document.getElementById('auditForm');
  const services = {
    web: form.elements.web.checked,
    ios: form.elements.ios.checked,
    android: form.elements.android.checked,
    seo: form.elements.seo.checked
  };
  const pages = parseInt(form.elements.pages.value) || 0;
  const notes = form.elements.notes.value;
  const contact_id = await getOrCreateContact(); // Implement this!

  try {
    // Insert into audit_requests table
    const { data: auditData, error } = await supabase
      .from('audit_requests')
      .insert([{ 
        contact_id, 
        services: JSON.stringify(services), 
        pages, 
        notes,
        createdAt: new Date().toISOString() 
      }])
      .select();

    if (error) throw error;
    
    console.log('Audit saved:', auditData);
    alert('Audit saved successfully!');
    form.reset(); // Reset the form after submission
  } catch (err) {
    alert('Failed to save audit: ' + err.message);
  }
}

