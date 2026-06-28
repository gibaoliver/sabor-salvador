import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://onouxbiwzovtwkueyrnn.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fd11qwM94g3q8uip0GDOqA_KYxgJ9-R';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  const email = 'gilberto010396@gmail.com';
  const password = 'Giba0103+'; 

  console.log(`Tentando criar usuário: ${email}`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        is_super_admin: true
      }
    }
  });

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
  } else {
    console.log('Usuário criado/registrado com sucesso no Supabase!');
    console.log('Se a confirmação de email estiver ativada no seu Supabase, você receberá um link. Caso contrário, já pode logar.');
    console.log('User:', data.user?.id);
  }
}

createUser();
