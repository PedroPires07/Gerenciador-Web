import admin from 'firebase-admin';
import { readFileSync, writeFileSync } from 'fs';
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

async function separarTermosCientificosEPopulares() {
  console.log('🔄 Iniciando análise: separando termos científicos de termos populares...\n');
  
  try {
    // Buscar todos os termos
    const termosRef = db.collection('termos');
    const snapshot = await termosRef.get();
    
    console.log(`📊 Total de termos encontrados: ${snapshot.size}\n`);
    
    const cientificos = [];
    const populares = [];
    const mistos = [];
    
    // Classificar cada termo
    snapshot.forEach((doc) => {
      const termo = { id: doc.id, ...doc.data() };
      
      const temCientifico = termo.cientifico && termo.cientifico.trim() !== '';
      const temPopulares = Array.isArray(termo.populares) && termo.populares.length > 0;
      
      if (temCientifico && temPopulares) {
        mistos.push(termo);
      } else if (temCientifico) {
        cientificos.push(termo);
      } else if (temPopulares) {
        populares.push(termo);
      }
    });
    
    // Exibir relatório detalhado
    console.log('='.repeat(70));
    console.log('📋 TERMOS CIENTÍFICOS PUROS');
    console.log('='.repeat(70));
    console.log(`Total: ${cientificos.length}\n`);
    cientificos.forEach(t => {
      console.log(`🔬 ${t.cientifico}`);
      console.log(`   📁 Categoria: ${t.categoria} | Área: ${t.area}`);
      console.log(`   📅 Atualizado: ${t.atualizadoEm} | Status: ${t.status}`);
      console.log('');
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('💬 TERMOS POPULARES PUROS');
    console.log('='.repeat(70));
    console.log(`Total: ${populares.length}\n`);
    populares.forEach(t => {
      console.log(`💬 ${t.populares.join(', ')}`);
      console.log(`   📁 Categoria: ${t.categoria} | Área: ${t.area}`);
      console.log(`   📅 Atualizado: ${t.atualizadoEm} | Status: ${t.status}`);
      console.log('');
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔀 TERMOS MISTOS (Científico + Populares)');
    console.log('='.repeat(70));
    console.log(`Total: ${mistos.length}\n`);
    mistos.forEach(t => {
      console.log(`🔬 Científico: ${t.cientifico}`);
      console.log(`💬 Populares: ${t.populares.join(', ')}`);
      console.log(`   📁 Categoria: ${t.categoria} | Área: ${t.area}`);
      console.log(`   📅 Atualizado: ${t.atualizadoEm} | Status: ${t.status}`);
      console.log('');
    });
    
    // Resumo estatístico
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO ESTATÍSTICO');
    console.log('='.repeat(70));
    console.log(`🔬 Termos Científicos Puros: ${cientificos.length}`);
    console.log(`💬 Termos Populares Puros: ${populares.length}`);
    console.log(`🔀 Termos Mistos: ${mistos.length}`);
    console.log(`📦 Total: ${snapshot.size}`);
    console.log('='.repeat(70));
    
    // Opção de exportar para JSON
    const exportData = {
      cientificos: cientificos.map(t => ({
        id: t.id,
        cientifico: t.cientifico,
        categoria: t.categoria,
        area: t.area,
        status: t.status,
        atualizadoEm: t.atualizadoEm,
        descricao: t.descricao || ''
      })),
      populares: populares.map(t => ({
        id: t.id,
        populares: t.populares,
        categoria: t.categoria,
        area: t.area,
        status: t.status,
        atualizadoEm: t.atualizadoEm,
        descricao: t.descricao || ''
      })),
      mistos: mistos.map(t => ({
        id: t.id,
        cientifico: t.cientifico,
        populares: t.populares,
        categoria: t.categoria,
        area: t.area,
        status: t.status,
        atualizadoEm: t.atualizadoEm,
        descricao: t.descricao || ''
      }))
    };
    
    const exportPath = join(__dirname, 'termos-separados.json');
    writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`\n💾 Dados exportados para: ${exportPath}`);
    
  } catch (error) {
    console.error('❌ Erro na análise:', error);
    process.exit(1);
  }
}

// Executar análise
separarTermosCientificosEPopulares()
  .then(() => {
    console.log('\n✨ Análise concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
