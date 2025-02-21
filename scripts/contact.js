// DOM Elements
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitButton = document.getElementById('submitButton');

// Form Validation
function validateForm(data) {
  const errors = [];
  
  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Valid email is required');
  
  return errors;
}

// UI Helpers
function showMessage(type, message) {
  formMessage.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');
  formMessage.classList.add(`bg-${type}-50`, `text-${type}-700`);
  formMessage.innerHTML = message;
  formMessage.classList.remove('hidden');
}

async function submitContactForm(event) {
  event.preventDefault();

  // Get form data
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone?.value.trim() || null,
    company: form.company?.value.trim() || null,
    message: form.brief?.value.trim() || null
  };

  // Validate
  const errors = validateForm(formData);
  if (errors.length > 0) {
    showMessage('red', errors.join('<br>'));
    return;
  }

  try {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([formData])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message);
      return;
    } else {

    // Success handling
    showMessage('green', 'Thank you! We\'ll be in touch soon.');
    form.reset();
    }
    // Log success to console
    console.log('Contact created:', data[0]);

  } catch (err) {
    console.error('Submission Error:', err);
    showMessage('red', `Submission failed: ${err.message}`);
  } finally {
    submitButton.disabled = false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', submitContactForm);
  
  // Real-time validation
  form.addEventListener('input', () => {
    const errors = validateForm({
      name: form.name.value,
      email: form.email.value
    });
    submitButton.disabled = errors.length > 0;
  });
});

function validateForm(formData) {
  const errors = [];
  if (!formData.name) errors.push('Name is required.');
  if (!formData.email) errors.push('Email is required.');
  if (!formData.phone) errors.push('Phone number is required.');
  if (!formData.message) errors.push('Brief project description is required.');
  return errors;
}

function showMessage(color, message) {
  const messageBox = document.getElementById('message-box');
  messageBox.innerHTML = message;
  messageBox.style.color = color;
}