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

async function adicionarCampoTipo() {
  console.log('🔄 Iniciando migração: adicionando campo "tipo" aos termos...\n');
  
  try {
    // Buscar todos os termos
    const termosRef = db.collection('termos');
    const snapshot = await termosRef.get();
    
    console.log(`📊 Total de termos encontrados: ${snapshot.size}\n`);
    
    let cientificos = 0;
    let populares = 0;
    let mistos = 0;
    let jaComTipo = 0;
    
    // Atualizar cada termo em batch
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const termo = doc.data();
      
      // Se já tem o campo tipo, pular
      if (termo.tipo) {
        console.log(`⏭️  Termo já possui tipo: ${termo.cientifico || termo.populares?.join(', ')}`);
        jaComTipo++;
        return;
      }
      
      const temCientifico = termo.cientifico && termo.cientifico.trim() !== '';
      const temPopulares = Array.isArray(termo.populares) && termo.populares.length > 0;
      
      let tipo;
      if (temCientifico && temPopulares) {
        tipo = 'misto';
        mistos++;
      } else if (temCientifico) {
        tipo = 'cientifico';
        cientificos++;
      } else if (temPopulares) {
        tipo = 'popular';
        populares++;
      } else {
        tipo = 'indefinido';
      }
      
      batch.update(doc.ref, { tipo });
      console.log(`✅ ${tipo.toUpperCase()}: ${termo.cientifico || termo.populares?.join(', ')}`);
    });
    
    // Commit do batch
    const totalAtualizar = cientificos + populares + mistos;
    if (totalAtualizar > 0) {
      await batch.commit();
      console.log(`\n💾 ${totalAtualizar} termos foram atualizados no Firestore`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(50));
    console.log(`🔬 Científicos: ${cientificos}`);
    console.log(`💬 Populares: ${populares}`);
    console.log(`🔀 Mistos: ${mistos}`);
    console.log(`⏭️  Já tinham tipo: ${jaComTipo}`);
    console.log(`📦 Total: ${snapshot.size}`);
    console.log('='.repeat(50));
    console.log('\n✨ Migração concluída!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar migração
adicionarCampoTipo()
  .then(() => {
    console.log('\n👍 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
