
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wfdcewkgccvglkbbavti.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGNld2tnY2N2Z2xrYmJhdnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjM4MjAsImV4cCI6MjA5MjY5OTgyMH0.MqrvCdHfBuG5wqHebLdJ5FDhVYb9m8psRqt5C86A5wA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkInstitutions() {
  const { data, error } = await supabase.from('institutions').select('*')
  if (error) {
    console.error('Error fetching institutions:', error)
    return
  }
  console.log('Institutions in DB:', data)
}

checkInstitutions()
