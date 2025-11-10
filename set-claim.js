const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Inicializa o admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    // Obtém o usuário pelo email
    const user = await admin.auth().getUserByEmail(email);
    
    // Define a claim de admin
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });

    console.log(`Claims de admin definidas com sucesso para ${email}`);
    
    // Atualiza o role no profile
    const profileRef = admin.firestore().collection('profiles').doc(user.uid);
    await profileRef.set({
      role: 'admin'
    }, { merge: true });
    
    console.log(`Role atualizada no profile com sucesso para ${email}`);
  } catch (error) {
    console.error('Erro ao definir claims:', error);
  }
}

// Substitua 'seu-email@exemplo.com' pelo email do usuário que você quer tornar admin
const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.error('Por favor, forneça um email como argumento.');
  console.log('Uso: node set-claim.js seu-email@exemplo.com');
  process.exit(1);
}

setAdminClaim(emailToPromote).then(() => {
  process.exit(0);
});