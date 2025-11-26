import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

// Inicializa o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

async function adicionarDescricaoAosTermos() {
  console.log('🔄 Iniciando migração: adicionando campo "descricao" aos termos...\n');
  
  try {
    // Buscar todos os termos
    const termosRef = db.collection('termos');
    const snapshot = await termosRef.get();
    
    console.log(`📊 Total de termos encontrados: ${snapshot.size}\n`);
    
    let atualizados = 0;
    let erros = 0;
    let jaComDescricao = 0;
    
    // Atualizar cada termo em batch
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const termoData = doc.data();
      
      // Verificar se já tem o campo descricao
      if (termoData.descricao === undefined) {
        batch.update(doc.ref, { descricao: '' });
        console.log(`✅ Termo "${termoData.cientifico}" será atualizado (ID: ${doc.id})`);
        atualizados++;
      } else {
        console.log(`⏭️  Termo "${termoData.cientifico}" já possui descrição (ID: ${doc.id})`);
        jaComDescricao++;
      }
    });
    
    // Commit do batch
    if (atualizados > 0) {
      await batch.commit();
      console.log(`\n💾 ${atualizados} termos foram atualizados no Firestore`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(50));
    console.log(`✅ Termos atualizados: ${atualizados}`);
    console.log(`⏭️  Termos já com descrição: ${jaComDescricao}`);
    console.log(`❌ Erros: ${erros}`);
    console.log('='.repeat(50));
    console.log('\n✨ Migração concluída!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar migração
adicionarDescricaoAosTermos()
  .then(() => {
    console.log('\n👍 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
