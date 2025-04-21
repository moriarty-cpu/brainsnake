import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnwbqcenoawddpwwuka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobndicWNlbm9hd2RkcHd3dWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzMxNDksImV4cCI6MjA2MDQ0OTE0OX0.QjizSCJSvJhbOIVEJ-bWVyHZqgN49HunS7M8ggHhAT8'; 
export const supabase = createClient(supabaseUrl, supabaseKey);
