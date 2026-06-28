import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://onouxbiwzovtwkueyrnn.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fd11qwM94g3q8uip0GDOqA_KYxgJ9-R';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function resendConfirmation() {
  const email = 'gilberto010396@gmail.com';
  
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    console.error('Erro ao reenviar:', error.message);
  } else {
    console.log('Email de confirmação reenviado com sucesso para', email);
  }
}

resendConfirmation();
