// scripts/seed-estrutura.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import fs from 'fs'
import path from 'path'
import url from 'url'

// === ler credenciais ===
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'
if (!fs.existsSync(keyPath)) {
  console.error(`Arquivo de credencial não encontrado: ${keyPath}
Defina a variável GOOGLE_APPLICATION_CREDENTIALS ou coloque serviceAccountKey.json na raiz.`)
  process.exit(1)
}
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// === args CLI: --adminUid= --adminNome= --adminEmail= --noPlaceholders ===
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...rest] = a.replace(/^--/, '').split('=')
    return [k, rest.join('=')]
  })
)
const withPlaceholders = !('noPlaceholders' in args)
const todayStr = new Date().toISOString().slice(0,10)

// === util idempotente ===
async function ensureDoc(ref, data) {
  const snap = await ref.get()
  if (snap.exists) return false
  await ref.set(data)
  return true
}

async function ensureProfileAdmin({ uid, nome, email }) {
  if (!uid || !email) return
  const ref = db.collection('profiles').doc(uid)
  const created = await ensureDoc(ref, {
    id: uid,
    nome: nome || 'Administrador',
    email,
    role: 'admin',
    ativo: true,
    ultimoAcesso: FieldValue.serverTimestamp()
  })
  console.log(created ? `✓ profile admin criado: ${email}` : `= profile admin já existe: ${email}`)
}

// === placeholders de esquema ===
async function ensureSchemas() {
  if (withPlaceholders) {
    const catSchema = db.collection('categorias').doc('_schema')
    await catSchema.set({
      _isTemplate: true,
      nome: 'Exemplo de Categoria',
      area: 'Medicina',              // 'Medicina' | 'Odontologia'
      totalTermos: 0,
      criadoEm: todayStr             // ou FieldValue.serverTimestamp()
    }, { merge: true })
    console.log('✓ categorias/_schema pronto')

    const termoSchema = db.collection('termos').doc('_schema')
    await termoSchema.set({
      _isTemplate: true,
      cientifico: 'Hipertensão Arterial',
      populares: ['Pressão alta'],
      area: 'Medicina',              // 'Medicina' | 'Odontologia'
      categoria: 'Cardiologia',      // nome da categoria (ou use ID se preferir)
      status: 'Pendente',            // 'Verificado' | 'Pendente'
      atualizadoEm: todayStr         // ou FieldValue.serverTimestamp()
    }, { merge: true })
    console.log('✓ termos/_schema pronto')
  } else {
    console.log('= placeholders desabilitados (--noPlaceholders)')
  }
}

// === lista de categorias ===
const odonto = new Set([
  'Cirurgia Oral','Dentística','Endodontia','Estomatologia','Implantodontia','Odontogeriatria',
  'Odontopediatria','Ortodontia','Patologia Oral','Periodontia','Prótese Dentária','Radiologia Odontológica'
])
const nomesDefault = [
  // Medicina
  'Alergologia','Anestesiologia','Angiologia','Cardiologia','Cirurgia Geral','Cirurgia Plástica',
  'Dermatologia','Endocrinologia','Gastroenterologia','Geriatria','Ginecologia','Hematologia',
  'Infectologia','Medicina do Trabalho','Medicina Esportiva','Nefrologia','Neurologia','Nutrologia',
  'Oncologia','Oftalmologia','Ortopedia','Otorrinolaringologia','Pediatria','Pneumologia',
  'Psiquiatria','Reumatologia','Urologia',
  // Odontologia
  'Cirurgia Oral','Dentística','Endodontia','Estomatologia','Implantodontia','Odontogeriatria',
  'Odontopediatria','Ortodontia','Patologia Oral','Periodontia','Prótese Dentária','Radiologia Odontológica'
]

// permite sobrescrever via scripts/categories.json
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const jsonPath = path.join(__dirname, 'categories.json')
let categorias = nomesDefault.map(nome => ({ nome, area: odonto.has(nome) ? 'Odontologia' : 'Medicina' }))
if (fs.existsSync(jsonPath)) {
  try {
    const fromJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    if (Array.isArray(fromJson) && fromJson.length) {
      categorias = fromJson
      console.log(`= usando scripts/categories.json (${fromJson.length} categorias)`)
    }
  } catch (e) {
    console.warn('! erro lendo categories.json — usando lista padrão')
  }
}

async function ensureCategoria({ nome, area }) {
  const snap = await db.collection('categorias')
    .where('nome','==',nome)
    .where('area','==',area)
    .limit(1).get()
  if (!snap.empty) {
    console.log(`= já existe: ${area} / ${nome}`)
    return
  }
  await db.collection('categorias').add({
    nome, area,
    totalTermos: 0,
    criadoEm: todayStr
  })
  console.log(`✓ criada: ${area} / ${nome}`)
}

async function run() {
  console.log('== Seed Estrutura Firestore ==')

  // 1) garante profiles (admin opcional)
  if (args.adminUid || args.adminEmail) {
    await ensureProfileAdmin({
      uid: args.adminUid,
      nome: args.adminNome,
      email: args.adminEmail
    })
  } else {
    // cria só o _schema para materializar a coleção
    if (withPlaceholders) {
      const ref = db.collection('profiles').doc('_schema')
      await ref.set({
        _isTemplate: true,
        id: 'uid',
        nome: 'Nome Completo',
        email: 'email@exemplo.com',
        role: 'viewer',  // admin | moderador | viewer
        ativo: true,
        ultimoAcesso: FieldValue.serverTimestamp()
      }, { merge: true })
      console.log('✓ profiles/_schema pronto')
    }
  }

  // 2) placeholders de categorias/termos
  await ensureSchemas()

  // 3) popula categorias (idempotente)
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

