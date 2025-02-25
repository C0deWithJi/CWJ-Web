import { addContact, createAuditRequest } from '../backend/queries.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async (event) => {
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
      const contactId = await addContact(formData);
      if (contactId) {
        showMessage('green', 'Form submitted successfully!');
        form.reset();
      } else {
        showMessage('red', 'Failed to add contact');
      }
    } catch (err) {
      console.error('Error:', err);
      showMessage('red', 'There was an error submitting the form.');
    }
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