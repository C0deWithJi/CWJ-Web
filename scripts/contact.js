const supabaseurl = process.env.SUPABASE_URL
    const supabasekey = process.env.SUPABASE_KEY
    const supabase = window.supabase.createClient(supabaseurl, supabasekey)

async function submitContactForm(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const message = document.getElementById('brief').value;
  
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, phone, email, company, message }])
        .select();
  
      if (error) throw error;
      
      alert('Thank you! We’ll be in touch soon.');
      document.getElementById('contactForm').reset();
    } catch (err) {
      alert('Submission failed: ' + err.message);
    }
  }
  
  async function getOrCreateContact() {
    const email = document.getElementById('email').value; // From your form
    if (!email) return null;
  
    try {
      // Check if contact exists
      const { data: existing, error: existingError } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', email)
        .single();
  
      if (existingError && existingError.code !== 'PGRST116') {
        // Handle error if it's not a "No rows found" error
        throw existingError;
      }
  
      if (existing) return existing.id;
  
      // Create new contact
      const { data: newContact, error: newContactError } = await supabase
        .from('contacts') // Changed from 'users' to 'contacts'
        .insert([{ email }])
        .select();
  
      if (newContactError) throw newContactError;
  
      return newContact[0].id;
    } catch (err) {
      console.error('Contact error:', err);
      return null;
    }
  }
  
  // Attach to form submit
  document.getElementById('contactForm').addEventListener('submit', submitContactForm);