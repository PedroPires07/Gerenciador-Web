// scripts/promote-admin.mjs
import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.split('=');
    return [k, rest.join('=')];
  })
);

const uid = args.uid;
const role = args.role || 'admin';
const email = args.email || '';
const nome = args.nome || '';

if (!uid) {
  console.error('Uso: node scripts/promote-admin.mjs uid=<UID> [role=admin|moderador] [email=...] [nome=...]');
  process.exit(1);
}

await db.collection('profiles').doc(uid).set(
  {
    id: uid,
    role,
    ativo: true,
    ...(email ? { email } : {}),
    ...(nome ? { nome } : {}),
    ultimoAcesso: new Date().toISOString(),
  },
  { merge: true }
);

console.log(`OK: ${uid} promovido para ${role}`);
process.exit(0);
