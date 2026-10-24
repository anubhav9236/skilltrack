import fs from 'fs';
import path from 'path';

/**
 * SkillTrack Appwrite TablesDB Automated Setup Script
 * Creates skilltrack_db database, opportunities collection, permissions, and 11 attributes.
 * 
 * Usage:
 *   node scripts/setup-db.mjs <PROJECT_ID> <API_KEY> [ENDPOINT]
 * Or set VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY in .env
 */

const envPath = path.resolve(process.cwd(), '.env');
let envConfig = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        envConfig[key] = value;
      }
    }
  });
}

const PROJECT_ID = process.argv[2] || envConfig.VITE_APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.argv[3] || envConfig.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;
const ENDPOINT = (process.argv[4] || envConfig.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1').replace(/\/$/, '');
const DATABASE_ID = envConfig.VITE_APPWRITE_DATABASE_ID || 'skilltrack_db';
const TABLE_ID = envConfig.VITE_APPWRITE_TABLE_ID || 'opportunities';

if (!PROJECT_ID || !API_KEY) {
  console.error('\n❌ Missing required arguments!');
  console.log('Usage: node scripts/setup-db.mjs <PROJECT_ID> <API_KEY>');
  console.log('Or set VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY in your .env file.\n');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function appwriteRequest(path, method = 'GET', body = null) {
  const res = await fetch(`${ENDPOINT}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('\n🚀 Setting up Appwrite TablesDB for SkillTrack...');
  console.log(`📡 Endpoint:    ${ENDPOINT}`);
  console.log(`🆔 Project ID:  ${PROJECT_ID}`);
  console.log(`📁 Database ID: ${DATABASE_ID}`);
  console.log(`📄 Table ID:    ${TABLE_ID}\n`);

  // 1. Create or verify Database
  console.log('1️⃣ Checking Database...');
  const checkDb = await appwriteRequest(`/databases/${DATABASE_ID}`);
  if (checkDb.ok) {
    console.log(`   Database '${DATABASE_ID}' already exists.`);
  } else {
    console.log(`   Creating Database '${DATABASE_ID}'...`);
    const createDb = await appwriteRequest('/databases', 'POST', {
      databaseId: DATABASE_ID,
      name: 'SkillTrack Database',
    });
    if (!createDb.ok && createDb.status !== 409) {
      console.error(`   ❌ Failed to create database:`, createDb.data?.message);
      process.exit(1);
    }
    console.log(`   Database '${DATABASE_ID}' created successfully!`);
  }

  // 2. Create or verify Table / Collection
  console.log('2️⃣ Checking Collection / Table...');
  const checkCol = await appwriteRequest(`/databases/${DATABASE_ID}/collections/${TABLE_ID}`);
  if (checkCol.ok) {
    console.log(`   Table '${TABLE_ID}' already exists.`);
  } else {
    console.log(`   Creating Table '${TABLE_ID}' with Document Security enabled...`);
    const createCol = await appwriteRequest(`/databases/${DATABASE_ID}/collections`, 'POST', {
      collectionId: TABLE_ID,
      name: 'Opportunities',
      permissions: ['create("users")'],
      documentSecurity: true,
    });
    if (!createCol.ok && createCol.status !== 409) {
      console.error(`   ❌ Failed to create collection:`, createCol.data?.message);
      process.exit(1);
    }
    console.log(`   Table '${TABLE_ID}' created successfully!`);
  }

  // 3. Create Attributes
  console.log('3️⃣ Creating Table Attributes...');
  const attributes = [
    { type: 'string', key: 'userId', size: 255, required: true },
    { type: 'string', key: 'title', size: 255, required: true },
    { type: 'string', key: 'organization', size: 255, required: true },
    { type: 'string', key: 'category', size: 50, required: true },
    { type: 'string', key: 'description', size: 5000, required: false },
    { type: 'string', key: 'applicationUrl', size: 2048, required: false },
    { type: 'string', key: 'deadline', size: 50, required: true },
    { type: 'string', key: 'status', size: 50, required: true },
    { type: 'string', key: 'priority', size: 50, required: true },
    { type: 'string', key: 'notes', size: 5000, required: false },
    { type: 'boolean', key: 'isSaved', required: false, default: false },
  ];

  for (const attr of attributes) {
    const attrPath = `/databases/${DATABASE_ID}/collections/${TABLE_ID}/attributes/${attr.type}`;
    const payload = {
      key: attr.key,
      required: attr.required,
      ...(attr.size ? { size: attr.size } : {}),
      ...(!attr.required && attr.default !== undefined ? { default: attr.default } : {}),
    };

    const res = await appwriteRequest(attrPath, 'POST', payload);
    if (res.ok) {
      console.log(`   Created attribute: ${attr.key} (${attr.type})`);
    } else if (res.status === 409) {
      console.log(`   Attribute already exists: ${attr.key}`);
    } else {
      console.warn(`   ⚠️ Warning on '${attr.key}':`, res.data?.message || res.status);
    }
    await sleep(250); // slight throttle
  }

  // Update .env file
  console.log('\n4️⃣ Updating .env file...');
  let updatedEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  if (!updatedEnv.includes('VITE_APPWRITE_PROJECT_ID=')) {
    updatedEnv += `\nVITE_APPWRITE_PROJECT_ID=${PROJECT_ID}\n`;
  } else {
    updatedEnv = updatedEnv.replace(/VITE_APPWRITE_PROJECT_ID=.*/g, `VITE_APPWRITE_PROJECT_ID=${PROJECT_ID}`);
  }
  fs.writeFileSync(envPath, updatedEnv, 'utf8');

  console.log('\n🎉 Setup Completed Successfully!');
  console.log('Next step:');
  console.log('👉 In Appwrite Console > Project Overview > Web App, add hostname "localhost" to allow requests.');
  console.log('👉 Restart your Vite server (or refresh browser) to start using Appwrite TablesDB!\n');
}

run().catch(err => {
  console.error('Fatal error during setup:', err);
  process.exit(1);
});
