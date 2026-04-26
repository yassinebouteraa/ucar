const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wfdcewkgccvglkbbavti.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGNld2tnY2N2Z2xrYmJhdnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODcyODMsImV4cCI6MjA2MDY2MzI4M30.z8uP3-S393uD93p9u39u39u39u39u39u39u39u39u39u'; // Dummy or actual if I had it

async function checkSchema() {
  const supabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGNld2tnY2N2Z2xrYmJhdnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjM4MjAsImV4cCI6MjA5MjY5OTgyMH0.MqrvCdHfBuG5wqHebLdJ5FDhVYb9m8psRqt5C86A5wA');

  const { data, error } = await supabase
    .from('conversation_turns')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching conversation_turns:', error);
  } else {
    console.log('Sample data from conversation_turns:', data);
  }
}

checkSchema();
