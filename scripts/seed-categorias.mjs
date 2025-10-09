// scripts/seed-categorias.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'

// Lê a credencial do caminho em GOOGLE_APPLICATION_CREDENTIALS ou do arquivo padrão na raiz
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const today = new Date().toISOString().slice(0,10)


const categorias = [
  // Medicina
  'Alergologia','Anestesiologia','Cardiologia','Dermatologia','Endocrinologia','Gastroenterologia',
  'Geriatria','Ginecologia','Hematologia','Infectologia','Nefrologia','Neurologia','Oncologia',
  'Ortopedia','Otorrinolaringologia','Pediatria','Pneumologia','Psiquiatria','Reumatologia',
  // Odontologia
  'Cirurgia Oral','Dentística','Endodontia','Estomatologia','Implantodontia','Odontogeriatria',
  'Odontopediatria','Ortodontia','Patologia Oral','Periodontia','Prótese Dentária','Radiologia Odontológica'
].map(nome => {
  const area = [
    'Cirurgia Oral','Dentística','Endodontia','Estomatologia','Implantodontia','Odontogeriatria',
    'Odontopediatria','Ortodontia','Patologia Oral','Periodontia','Prótese Dentária','Radiologia Odontológica'
  ].includes(nome) ? 'Odontologia' : 'Medicina'
  return { nome, area }
})

async function ensureCategoria({ nome, area }) {
  const snap = await db.collection('categorias')
    .where('nome', '==', nome)
    .where('area', '==', area)
    .limit(1).get()

  if (!snap.empty) {
    console.log(`= já existe: ${area} / ${nome}`)
    return
  }
  await db.collection('categorias').add({
    nome, area,
    totalTermos: 0,
    criadoEm: today // se preferir Timestamp, use: admin.firestore.FieldValue.serverTimestamp()
  })
  console.log(`✓ criada: ${area} / ${nome}`)
}

async function run() {
  for (const c of categorias) {
    await ensureCategoria(c)
  }
  console.log('Concluído.')
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})