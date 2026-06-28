import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://onouxbiwzovtwkueyrnn.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fd11qwM94g3q8uip0GDOqA_KYxgJ9-R';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function changePassword() {
  const email = 'gilberto010396@gmail.com';
  const oldPassword = 'SaborSalvador2024!';
  const newPassword = 'Giba0103+';

  console.log(`Tentando logar como ${email}...`);
  
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: oldPassword
  });

  if (signInError) {
    console.error('Erro ao logar:', signInError.message);
    // If we can't login, maybe we can just sign up again and hope it overrides?
    console.log('Tentando signUp novamente...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: newPassword,
      options: {
        data: {
          is_super_admin: true
        }
      }
    });
    if (signUpError) {
      console.error('Erro no signUp:', signUpError.message);
    } else {
      console.log('SignUp concluído com sucesso!');
    }
    return;
  }

  console.log('Login feito com sucesso! Atualizando senha...');

  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    console.error('Erro ao atualizar senha:', updateError.message);
  } else {
    console.log('Senha atualizada com sucesso para Giba0103+');
  }
}

changePassword();
