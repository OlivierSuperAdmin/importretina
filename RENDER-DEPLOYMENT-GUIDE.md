# Guide de déploiement sur Render

## Configuration requise sur Render

### 1. Type de service
- **Type** : Web Service
- **Environment** : Node
- **Region** : Choisissez la plus proche

### 2. Commandes de build et de démarrage

Dans les paramètres de votre service Render, configurez :

- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm run start`

### 3. Variables d'environnement

Ajoutez ces variables dans Render :

```
NODE_VERSION=18.20.5
```

### 4. Configuration alternative (Site statique)

Si vous préférez utiliser un site statique sur Render :

1. Changez le type de service à "Static Site"
2. Configurez :
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

## Dépannage

### Le site ne se lance pas ?

1. **Vérifiez les logs** dans le dashboard Render
2. **Erreurs communes** :
   - Port non configuré : Le script start utilise maintenant `$PORT`
   - Build échoué : Vérifiez que toutes les dépendances sont installées
   - Timeout : Le build peut prendre 2-3 minutes

### Commandes de test local

```bash
# Tester le build
npm run build

# Tester le serveur (simuler Render)
PORT=3000 npm run start
```

## Structure des fichiers

```
/
├── dist/               # Dossier généré par le build
├── src/                # Code source
├── package.json        # Scripts npm
├── render.yaml         # Configuration Render (optionnel)
└── vite.config.ts      # Configuration Vite
```

## Étapes de déploiement

1. **Commit et push** des derniers changements
2. **Connectez votre repo GitHub** à Render
3. **Configurez les commandes** comme indiqué ci-dessus
4. **Déployez** et attendez 2-3 minutes

## URLs importantes

- Documentation API : `/` puis cliquer sur l'onglet "Documentation API"
- Convertisseur Excel : `/` puis cliquer sur l'onglet "Convertisseur Excel"

---

**Note** : Le fichier `render.yaml` est optionnel mais peut simplifier la configuration.
