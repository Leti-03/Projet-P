import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    const { data, error } = await supabase
      .from('factures')
      .insert({
        client_id: 'dummy-id',
        numero_facture: 'TEST-1234',
        montant_ht: 100,
        tva: 19,
        montant_ttc: 119,
        date_echeance: null,
        periode_debut: null,
        periode_fin: null,
        statut: 'impayee',
        date_paiement: null
      });
      
    if (error) {
      console.error('Insert Error Details:', error);
    } else {
      console.log('Success!', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testInsert();
