# 🔍 Debug du Webhook Make.com

## Structure des données envoyées

Le webhook reçoit maintenant les données dans ce format :

```json
{
  "timestamp": "2025-09-04T12:00:00.000Z",
  "fileName": "votre-fichier.xlsx",
  "dataCount": 10,
  "data": {
    // Vos données Excel converties en JSON
  }
}
```

## Pour vérifier la réception dans Make.com :

1. **Dans Make.com**, allez dans votre scénario
2. Cliquez sur le webhook
3. Activez **"Show advanced settings"**
4. Activez **"Get request headers"** et **"Get request body"**
5. Sauvegardez et réactivez le scénario

## Test depuis le terminal

Exécutez cette commande pour tester directement :

```bash
node test-webhook.js
```

Si vous recevez "Accepted", le webhook fonctionne.

## Dans l'application

1. Ouvrez la **Console du navigateur** (F12)
2. Essayez le bouton **"Tester le webhook avec des données exemple"**
3. Vérifiez les logs dans la console :
   - 📤 Envoi au webhook...
   - 📨 Réponse: 200 Accepted

## Structure attendue par Make.com

Make.com peut avoir besoin que les données soient dans un format spécifique. Essayez :

### Option 1 : Données plates
```json
{
  "row1_col1": "valeur1",
  "row1_col2": "valeur2"
}
```

### Option 2 : Tableau simple
```json
[
  {"col1": "valeur1", "col2": "valeur2"},
  {"col1": "valeur3", "col2": "valeur4"}
]
```

### Option 3 : Objet avec clé data
```json
{
  "data": [/* vos données */]
}
```

## Problèmes courants

1. **CORS** : Le webhook Make.com accepte les requêtes cross-origin (vérifié ✅)
2. **Format JSON** : Make.com pourrait nécessiter un format spécifique
3. **Taille des données** : Testez d'abord avec peu de données
4. **Encoding** : UTF-8 est utilisé par défaut

## Pour voir les données dans Make.com

1. Après l'envoi, allez dans l'**historique d'exécution** du scénario
2. Cliquez sur l'exécution
3. Cliquez sur le module webhook
4. Vous verrez les données reçues dans "Output"
