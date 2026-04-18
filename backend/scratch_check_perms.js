import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_at', // Assuming database might be crm_at or projet-p, check db string in backend? Let's check environment later.
  password: 'admin',
  port: 5432,
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT r.nom, p.action 
    FROM ressources r
    LEFT JOIN permissions p ON p.ressource_id = r.id
    ORDER BY r.nom, p.action;
  `);
  console.table(res.rows);
  await client.end();
}

run().catch(console.error);
