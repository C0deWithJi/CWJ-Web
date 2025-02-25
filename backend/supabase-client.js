import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

export const supabase = createClient(
    "https://ttmecnsxujetavbknhnp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bWVjbnN4dWpldGF2YmtuaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU4NTUsImV4cCI6MjA1NTA4MTg1NX0.ot4EeZo4-IdYVcvUugGJUhP29HMMbvKonaUQ-cP6U38"
)

export default supabase;
