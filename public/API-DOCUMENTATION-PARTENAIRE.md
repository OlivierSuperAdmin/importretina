# Documentation API Webhook - Vélos Cargo CEE 971/972

## Vue d'ensemble

Cette documentation décrit l'intégration du webhook pour l'envoi automatique des informations de devis vélos cargo dans le cadre du dispositif CEE (Certificats d'Économies d'Énergie) pour les DOM-TOM.

Le webhook doit être appelé dans **deux cas précis** :
1. **Lors de la création d'un devis** - avec toutes les informations disponibles
2. **Lors de la signature d'un devis** - avec la référence, la date et le fichier signé

## Informations de connexion

- **URL du webhook** : `https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0`
- **Méthode** : `POST`
- **Content-Type** : `application/json`
- **Timeout recommandé** : 30 secondes

## 1. Webhook de création de devis

### Déclencheur
Appelez ce webhook immédiatement après la création d'un nouveau devis dans votre système.

### Structure de la requête

```json
{
  "event": "quote_created",
  "timestamp": "2025-01-15T10:30:00Z",
  "quote": {
    "reference_interne": "DEVIS-2025-001",
    "date_creation": "2025-01-15",
    "statut": "en_cours",
    "client": {
      "nom": "Entreprise ABC",
      "siret": "12345678901234",
      "email": "contact@entreprise-abc.com",
      "telephone": "0596123456",
      "adresse": {
        "rue": "123 Rue de la République",
        "code_postal": "97200",
        "ville": "Fort-de-France",
        "departement": "Martinique"
      }
    },
    "beneficiaire": {
      "nom": "Jean Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com",
      "telephone": "0696123456"
    },
    "velos": [
      {
        "modele": "Urban Arrow Family",
        "type": "cargo_familial",
        "quantite": 2,
        "prix_unitaire_ht": 4500,
        "tva": 8.5,
        "options": ["Tente de pluie", "Siège enfant supplémentaire"]
      }
    ],
    "montant_total": {
      "ht": 12200,
      "tva": 1037,
      "ttc": 13237,
      "aide_cee_estimee": 9000
    },
    "documents": {
      "devis_pdf": "https://votre-serveur.com/devis/DEVIS-2025-001.pdf",
      "conditions_generales": "https://votre-serveur.com/cgv.pdf"
    }
  }
}
```

### Champs obligatoires

- `event` : Toujours "quote_created"
- `timestamp` : Date/heure de l'événement (format ISO 8601)
- `quote.reference_interne` : Référence unique du devis dans votre système
- `quote.date_creation` : Date de création du devis
- `quote.client.nom` : Nom du client
- `quote.client.siret` : SIRET du client
- `quote.velos` : Liste des vélos avec quantité et prix
- `quote.montant_total.ttc` : Montant total TTC

### Champs recommandés

- Tous les autres champs listés dans l'exemple pour un traitement optimal

## 2. Webhook de signature de devis

### Déclencheur
Appelez ce webhook immédiatement après qu'un client ait signé électroniquement un devis.

### Structure de la requête

```json
{
  "event": "quote_signed",
  "timestamp": "2025-01-16T14:45:00Z",
  "signature": {
    "reference_interne": "DEVIS-2025-001",
    "date_signature": "2025-01-16T14:45:00Z",
    "ip_signature": "192.168.1.100",
    "methode_signature": "electronique",
    "devis_signe": {
      "url": "https://votre-serveur.com/devis/signes/DEVIS-2025-001-signe.pdf",
      "hash_sha256": "a7d8c9e8f7d6c5b4a3d2c1b0a9d8c7b6a5d4c3b2a1d0c9b8a7d6c5b4a3d2c1b0"
    },
    "signataire": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com",
      "qualite": "Gérant"
    }
  }
}
```

### Champs obligatoires

- `event` : Toujours "quote_signed"
- `timestamp` : Date/heure de l'événement (format ISO 8601)
- `signature.reference_interne` : Référence du devis signé (doit correspondre à un devis créé précédemment)
- `signature.date_signature` : Date et heure de la signature
- `signature.devis_signe.url` : URL du fichier PDF signé

## Codes de réponse

- **200 OK** : Données reçues et traitées avec succès
- **400 Bad Request** : Données manquantes ou format incorrect
- **500 Server Error** : Erreur serveur, réessayer plus tard

## Exemples d'implémentation

### Node.js / JavaScript

```javascript
const axios = require('axios');

class VeloCargoWebhook {
  constructor() {
    this.webhookUrl = 'https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0';
    this.maxRetries = 3;
    this.timeout = 30000;
  }

  async sendQuoteCreated(quoteData) {
    const payload = {
      event: 'quote_created',
      timestamp: new Date().toISOString(),
      quote: quoteData
    };
    
    return this.sendWithRetry(payload);
  }

  async sendQuoteSigned(reference, signatureDate, fileUrl, signatoryInfo) {
    const payload = {
      event: 'quote_signed',
      timestamp: new Date().toISOString(),
      signature: {
        reference_interne: reference,
        date_signature: signatureDate,
        devis_signe: {
          url: fileUrl
        },
        signataire: signatoryInfo
      }
    };
    
    return this.sendWithRetry(payload);
  }

  async sendWithRetry(payload, attempt = 1) {
    try {
      const response = await axios.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: this.timeout
      });
      
      console.log(`✅ Webhook envoyé avec succès: ${payload.event}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Tentative ${attempt} échouée:`, error.message);
      
      if (attempt < this.maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.sendWithRetry(payload, attempt + 1);
      }
      
      throw error;
    }
  }
}

// Utilisation
const webhook = new VeloCargoWebhook();

// Création de devis
await webhook.sendQuoteCreated({
  reference_interne: "DEVIS-2025-001",
  date_creation: "2025-01-15",
  // ... autres données
});

// Signature de devis
await webhook.sendQuoteSigned(
  "DEVIS-2025-001",
  new Date().toISOString(),
  "https://example.com/devis-signe.pdf",
  {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com"
  }
);
```

### PHP

```php
<?php
class VeloCargoWebhook {
    private $webhookUrl = 'https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0';
    private $maxRetries = 3;
    private $timeout = 30;
    
    public function sendQuoteCreated($quoteData) {
        $payload = [
            'event' => 'quote_created',
            'timestamp' => date('c'),
            'quote' => $quoteData
        ];
        
        return $this->sendWebhook($payload);
    }
    
    public function sendQuoteSigned($reference, $signatureDate, $fileUrl, $signatoryInfo) {
        $payload = [
            'event' => 'quote_signed',
            'timestamp' => date('c'),
            'signature' => [
                'reference_interne' => $reference,
                'date_signature' => $signatureDate,
                'devis_signe' => [
                    'url' => $fileUrl
                ],
                'signataire' => $signatoryInfo
            ]
        ];
        
        return $this->sendWebhook($payload);
    }
    
    private function sendWebhook($payload) {
        $attempts = 0;
        
        while ($attempts < $this->maxRetries) {
            $ch = curl_init($this->webhookUrl);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode == 200) {
                error_log("✅ Webhook envoyé avec succès: {$payload['event']}");
                return true;
            }
            
            $attempts++;
            if ($attempts < $this->maxRetries) {
                $waitTime = pow(2, $attempts - 1);
                sleep($waitTime);
            }
        }
        
        error_log("❌ Échec après {$attempts} tentatives");
        return false;
    }
}

// Utilisation
$webhook = new VeloCargoWebhook();

// Création de devis
$webhook->sendQuoteCreated([
    'reference_interne' => 'DEVIS-2025-001',
    'date_creation' => '2025-01-15',
    // ... autres données
]);

// Signature de devis
$webhook->sendQuoteSigned(
    'DEVIS-2025-001',
    date('c'),
    'https://example.com/devis-signe.pdf',
    [
        'nom' => $_POST['nom'],
        'prenom' => $_POST['prenom'],
        'email' => $_POST['email']
    ]
);
?>
```

### Python

```python
import requests
import json
from datetime import datetime
import time
import logging

class VeloCargoWebhook:
    def __init__(self):
        self.webhook_url = "https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0"
        self.timeout = 30
        self.max_retries = 3
        
    def send_quote_created(self, quote_data):
        """Envoie les données lors de la création d'un devis"""
        payload = {
            "event": "quote_created",
            "timestamp": datetime.now().isoformat(),
            "quote": quote_data
        }
        return self._send_webhook(payload)
    
    def send_quote_signed(self, reference, signature_date, file_url, signatory_info):
        """Envoie les données lors de la signature d'un devis"""
        payload = {
            "event": "quote_signed",
            "timestamp": datetime.now().isoformat(),
            "signature": {
                "reference_interne": reference,
                "date_signature": signature_date,
                "devis_signe": {
                    "url": file_url
                },
                "signataire": signatory_info
            }
        }
        return self._send_webhook(payload)
    
    def _send_webhook(self, payload):
        """Envoie le webhook avec retry automatique"""
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.webhook_url,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    logging.info(f"✅ Webhook envoyé avec succès: {payload['event']}")
                    return True
                else:
                    logging.warning(f"⚠️ Réponse HTTP {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                logging.error(f"❌ Erreur webhook tentative {attempt + 1}: {str(e)}")
                
            if attempt < self.max_retries - 1:
                wait_time = (2 ** attempt) * 1
                time.sleep(wait_time)
        
        return False

# Utilisation
webhook = VeloCargoWebhook()

# Création de devis
webhook.send_quote_created({
    "reference_interne": "DEVIS-2025-001",
    "date_creation": "2025-01-15",
    # ... autres données
})

# Signature de devis
webhook.send_quote_signed(
    reference="DEVIS-2025-001",
    signature_date=datetime.now().isoformat(),
    file_url="https://example.com/devis-signe.pdf",
    signatory_info={
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@email.com"
    }
)
```

## Bonnes pratiques

### 1. Gestion des erreurs et retry
- Implémentez un système de retry avec backoff exponentiel
- Maximum 3 tentatives espacées de 1, 2 et 4 secondes
- Loggez toutes les tentatives pour faciliter le débogage

### 2. Queue asynchrone
- Ne bloquez pas l'expérience utilisateur
- Utilisez une queue de messages (RabbitMQ, Redis, etc.)
- Traitez les webhooks en arrière-plan

### 3. Monitoring
- Conservez des logs détaillés de tous les appels
- Surveillez le taux de succès/échec
- Alertez en cas de taux d'échec élevé

### 4. Sécurité
- Stockez l'URL du webhook dans les variables d'environnement
- Utilisez HTTPS pour tous les liens de documents
- Validez les données avant envoi

### 5. Performance
- Timeout de 30 secondes maximum
- Payload JSON < 10MB
- Compressez les gros fichiers si nécessaire

## Format des dates

Toutes les dates doivent être au format ISO 8601 :
- Date seule : `2025-01-15`
- Date et heure : `2025-01-15T10:30:00Z` (UTC)
- Avec timezone : `2025-01-15T10:30:00+04:00`

## Types de vélos acceptés

- `cargo_familial` : Vélo cargo pour transport d'enfants
- `cargo_professionnel` : Vélo cargo pour usage professionnel
- `cargo_mixte` : Usage familial et professionnel

## Départements concernés

- Martinique (972)
- Guadeloupe (971)
- Guyane (973)
- La Réunion (974)

## Support

Pour toute question technique ou problème d'intégration :
- Email : support@renovelo-cargos.com
- Délai de réponse : 24-48h en jours ouvrés

## Changelog

### Version 1.0 (Janvier 2025)
- Version initiale de l'API
- Support des événements `quote_created` et `quote_signed`

---

**Note importante** : Cette documentation est susceptible d'évoluer. Assurez-vous d'utiliser la version la plus récente disponible sur le site.
