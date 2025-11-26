// Script para adicionar o campo 'descricao' aos termos existentes no Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

// Configuração do Firebase (use as mesmas credenciais do .env.local)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function adicionarDescricaoAosTermos() {
  console.log('🔄 Iniciando migração: adicionando campo "descricao" aos termos...\n')
  
  try {
    // Buscar todos os termos
    const termosRef = collection(db, 'termos')
    const snapshot = await getDocs(termosRef)
    
    console.log(`📊 Total de termos encontrados: ${snapshot.size}\n`)
    
    let atualizados = 0
    let erros = 0
    
    // Atualizar cada termo
    for (const documento of snapshot.docs) {
      const termoId = documento.id
      const termoData = documento.data()
      
      try {
        // Verificar se já tem o campo descricao
        if (termoData.descricao === undefined) {
          await updateDoc(doc(db, 'termos', termoId), {
            descricao: ''
          })
          console.log(`✅ Termo "${termoData.cientifico}" atualizado (ID: ${termoId})`)
          atualizados++
        } else {
          console.log(`⏭️  Termo "${termoData.cientifico}" já possui descrição (ID: ${termoId})`)
        }
      } catch (error) {
        console.error(`❌ Erro ao atualizar termo ${termoId}:`, error)
        erros++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📋 RESUMO DA MIGRAÇÃO')
    console.log('='.repeat(50))
    console.log(`✅ Termos atualizados: ${atualizados}`)
    console.log(`⏭️  Termos já com descrição: ${snapshot.size - atualizados - erros}`)
    console.log(`❌ Erros: ${erros}`)
    console.log('='.repeat(50))
    console.log('\n✨ Migração concluída!')
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  }
}

// Executar migração
adicionarDescricaoAosTermos()
  .then(() => {
    console.log('\n👍 Script finalizado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
