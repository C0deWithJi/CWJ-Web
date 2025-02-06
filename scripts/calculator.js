 // Pricing Configuration (2024 Averages)
const PRICING = {
    WEB_BASE: 3000,    // Base price for 5 pages
    WEB_PER_PAGE: 500, // Extra per page
    MOBILE_BASE: 5000, // Base per platform (iOS/Android)
    SEO: 2000          // Flat fee
  };
  
  function calculateEstimate() {
    const form = document.getElementById('auditForm');
    const resultDiv = document.getElementById('estimateResult');
    let total = 0;
  
    // Web Development
    if (form.web.checked) {
      const pages = parseInt(form.pages.value) || 5;
      total += PRICING.WEB_BASE + (pages - 5) * PRICING.WEB_PER_PAGE;
    }
  
    // Mobile Apps
    if (form.ios.checked) total += PRICING.MOBILE_BASE;
    if (form.android.checked) total += PRICING.MOBILE_BASE;
  
    // SEO
    if (form.seo.checked) total += PRICING.SEO;
  
    // Display Result
    resultDiv.innerHTML = `
      <h3>Estimated Cost: $${total.toLocaleString()} – $${(total * 1.2).toLocaleString()}</h3>
      <small>(Higher range accounts for potential complexity)</small>
    `;
  }
  
  // Show/hide pages field based on web checkbox
  document.querySelector('input[name="web"]').addEventListener('change', (e) => {
    document.getElementById('pagesField').style.display = e.target.checked ? 'block' : 'none';
  });
