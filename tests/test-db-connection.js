// Test database connection
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('\n📡 Attempting to connect to database...');
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!');
    
    const result = await client.query('SELECT NOW(), current_database(), current_user');
    console.log('✅ Query executed successfully!');
    console.log('📊 Database info:', {
      time: result.rows[0].now,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
    });
    
    // Check if Better Auth tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('auth_users', 'sessions', 'accounts', 'verification_tokens')
      ORDER BY table_name
    `);
    
    console.log('\n📋 Better Auth tables found:', tablesResult.rows.map(r => r.table_name));
    
    if (tablesResult.rows.length === 4) {
      console.log('✅ All Better Auth tables exist!');
    } else {
      console.log('⚠️ Missing tables:', 4 - tablesResult.rows.length);
    }
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    process.exit(1);
  }
}

testConnection();

