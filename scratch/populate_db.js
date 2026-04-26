
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wfdcewkgccvglkbbavti.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGNld2tnY2N2Z2xrYmJhdnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjM4MjAsImV4cCI6MjA5MjY5OTgyMH0.MqrvCdHfBuG5wqHebLdJ5FDhVYb9m8psRqt5C86A5wA'
const supabase = createClient(supabaseUrl, supabaseKey)

const institutions = [
  { id: 'inst-insat-0000', name: 'INSAT' },
  { id: 'inst-enit-0000', name: 'ENIT' },
  { id: 'inst-ihec-0000', name: 'IHEC Carthage' },
  { id: 'inst-enstab-0000', name: 'ENSTAB' },
  { id: 'inst-supcom-0000', name: 'SUP\'COM' },
  { id: 'inst-enic-0000', name: 'ENICarthage' },
  { id: 'inst-istic-0000', name: 'ISTIC Borj Cédria' },
  { id: 'inst-isste-0000', name: 'ISSTE Borj Cédria' },
  { id: 'inst-iscae-0000', name: 'ISCAE' },
  { id: 'inst-islt-0000', name: 'ISLT' },
];

async function populateInstitutions() {
  console.log('Populating institutions (ID and Name only)...');
  
  for (const inst of institutions) {
    const { error } = await supabase
      .from('institutions')
      .upsert(inst, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error inserting ${inst.name}:`, error.message);
    } else {
      console.log(`Successfully inserted/updated ${inst.name}`);
    }
  }
  
  console.log('Done!');
}

populateInstitutions();
