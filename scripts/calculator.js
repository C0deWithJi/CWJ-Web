// Pricing Configuration (Update values as needed)
const PRICING = {
  WEB_APP: { base: 3000, perPage: 500 },
  MOBILE_APP: { base: 5000, platformMultiplier: 1.5 },
  SEO: 2000
};

function calculateEstimate() {
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
  });
});