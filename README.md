# importretina

Convertisseur Excel vers JSON avec envoi webhook

## 🚀 Fonctionnalités

- 📊 Import de fichiers Excel (.xlsx, .xls)
- 🔄 Conversion automatique en JSON
- 📤 Envoi direct vers webhook Make.com
- 👁️ Aperçu du JSON généré
- ✅ Messages de statut en temps réel

## 💻 Installation locale

```bash
# Cloner le repository
git clone https://github.com/OlivierSuperAdmin/importretina.git
cd importretina

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🌐 Déploiement

### Option 1: GitHub Pages (recommandé)

```bash
# Build l'application
npm run build

# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter ce script dans package.json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}

# Déployer
npm run deploy
```

### Option 2: Netlify

1. Connectez votre repository GitHub à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Option 3: Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

## 📝 Utilisation

1. Cliquez sur "Choisir un fichier" ou glissez-déposez votre fichier Excel
2. Vérifiez le JSON généré dans l'aperçu
3. Cliquez sur "Envoyer sur le webhook" pour transmettre les données

## 🔧 Configuration

Le webhook est configuré dans `src/components/ExcelToJsonConverter.tsx` :
```javascript
https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0
```

## 📦 Technologies utilisées

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- xlsx (SheetJS)