// Test du webhook Make.com
const webhookUrl = 'https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0';

const testData = {
  test: true,
  timestamp: new Date().toISOString(),
  message: "Test depuis le script Node.js",
  data: [
    { nom: "Test1", valeur: 100 },
    { nom: "Test2", valeur: 200 }
  ]
};

console.log('📤 Envoi des données de test au webhook...');
console.log('URL:', webhookUrl);
console.log('Données:', JSON.stringify(testData, null, 2));

fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('\n✅ Réponse reçue!');
  console.log('Status:', response.status, response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  return response.text();
})
.then(body => {
  console.log('Body:', body);
})
.catch(error => {
  console.error('\n❌ Erreur:', error.message);
});
