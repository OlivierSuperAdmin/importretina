import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2, Copy, AlertTriangle, FileText, Send, Calendar, FileSignature, Link2, Shield, Clock, Database, Download } from 'lucide-react';
import { Button } from './ui/button';

const ApiDocumentation: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const webhookUrl = "https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Documentation API Webhook</h1>
          <p className="text-lg text-gray-600">Guide d'intégration pour l'envoi des devis vélos cargo</p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge variant="secondary" className="px-3 py-1">Version 1.0</Badge>
            <Badge variant="outline" className="px-3 py-1 text-green-700 border-green-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Webhook Actif
            </Badge>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/API-DOCUMENTATION-PARTENAIRE.md';
                link.download = 'API-DOCUMENTATION-VELOS-CARGO.md';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger la documentation complète
            </Button>
          </div>
        </div>

        {/* Alerte importante */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Important :</strong> Ce webhook doit être appelé dans deux cas précis : lors de la création d'un devis et lors de la signature d'un devis.
          </AlertDescription>
        </Alert>

        {/* URL du webhook */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            URL du Webhook
          </h2>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-gray-100 p-3 rounded-md text-sm font-mono break-all">
              {webhookUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(webhookUrl)}
              className="shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary">POST</Badge>
            <Badge variant="secondary">Content-Type: application/json</Badge>
          </div>
        </Card>

        {/* Tabs pour les deux cas d'usage */}
        <Tabs defaultValue="creation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="creation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Création de devis
            </TabsTrigger>
            <TabsTrigger value="signature" className="flex items-center gap-2">
              <FileSignature className="w-4 h-4" />
              Signature de devis
            </TabsTrigger>
          </TabsList>

          {/* Création de devis */}
          <TabsContent value="creation" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">1. Lors de la création d'un devis</h3>
              <p className="text-gray-600 mb-4">
                Appelez le webhook immédiatement après la création d'un nouveau devis avec toutes les informations disponibles.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Structure de la requête :</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
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
      },
      {
        "modele": "Babboe City",
        "type": "cargo_professionnel",
        "quantite": 1,
        "prix_unitaire_ht": 3200,
        "tva": 8.5,
        "options": []
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
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Exemple d'implémentation (Node.js) :</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const axios = require('axios');

async function sendQuoteCreatedWebhook(quoteData) {
  const payload = {
    event: 'quote_created',
    timestamp: new Date().toISOString(),
    quote: quoteData
  };

  try {
    const response = await axios.post(
      '${webhookUrl}',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 secondes
      }
    );
    
    console.log('✅ Webhook envoyé avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur webhook:', error.message);
    throw error;
  }
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Signature de devis */}
          <TabsContent value="signature" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">2. Lors de la signature d'un devis</h3>
              <p className="text-gray-600 mb-4">
                Appelez le webhook immédiatement après qu'un client ait signé un devis.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Structure de la requête :</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
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
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Exemple d'implémentation (PHP) :</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`function sendQuoteSignedWebhook($referenceInterne, $dateSignature, $fileUrl) {
    $payload = [
        'event' => 'quote_signed',
        'timestamp' => date('c'),
        'signature' => [
            'reference_interne' => $referenceInterne,
            'date_signature' => $dateSignature,
            'ip_signature' => $_SERVER['REMOTE_ADDR'],
            'methode_signature' => 'electronique',
            'devis_signe' => [
                'url' => $fileUrl,
                'hash_sha256' => hash_file('sha256', $fileUrl)
            ],
            'signataire' => [
                'nom' => $_POST['nom'],
                'prenom' => $_POST['prenom'],
                'email' => $_POST['email'],
                'qualite' => $_POST['qualite']
            ]
        ]
    ];

    $ch = curl_init('${webhookUrl}');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode == 200) {
        error_log('✅ Webhook signature envoyé avec succès');
        return true;
    } else {
        error_log('❌ Erreur webhook: HTTP ' . $httpCode);
        return false;
    }
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Codes de réponse */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Codes de réponse
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Badge className="bg-green-600">200 OK</Badge>
              <span className="text-sm">Données reçues et traitées avec succès</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Badge className="bg-yellow-600">400 Bad Request</Badge>
              <span className="text-sm">Données manquantes ou format incorrect</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <Badge className="bg-red-600">500 Server Error</Badge>
              <span className="text-sm">Erreur serveur, réessayer plus tard</span>
            </div>
          </div>
        </Card>

        {/* Bonnes pratiques */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Bonnes pratiques
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Retry automatique</p>
                <p className="text-sm text-gray-600">Implémentez un système de retry en cas d'échec (3 tentatives max avec délai exponentiel)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Timeout approprié</p>
                <p className="text-sm text-gray-600">Utilisez un timeout de 30 secondes pour éviter les blocages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Logs détaillés</p>
                <p className="text-sm text-gray-600">Conservez des logs de tous les appels webhook pour le débogage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Queue asynchrone</p>
                <p className="text-sm text-gray-600">Utilisez une queue pour ne pas bloquer l'expérience utilisateur</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Exemple Python */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Exemple complet (Python)
          </h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import requests
import json
from datetime import datetime
import time
import logging

class VeloCargoWebhook:
    def __init__(self):
        self.webhook_url = "${webhookUrl}"
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
                
            # Attendre avant de réessayer (backoff exponentiel)
            if attempt < self.max_retries - 1:
                wait_time = (2 ** attempt) * 1
                time.sleep(wait_time)
        
        return False

# Utilisation
webhook = VeloCargoWebhook()

# Lors de la création d'un devis
quote_data = {
    "reference_interne": "DEVIS-2025-001",
    "date_creation": "2025-01-15",
    "client": {
        "nom": "Entreprise ABC",
        "siret": "12345678901234"
    },
    "velos": [
        {
            "modele": "Urban Arrow",
            "quantite": 2,
            "prix_unitaire_ht": 4500
        }
    ],
    "montant_total": {
        "ttc": 9765
    }
}
webhook.send_quote_created(quote_data)

# Lors de la signature
webhook.send_quote_signed(
    reference="DEVIS-2025-001",
    signature_date=datetime.now().isoformat(),
    file_url="https://example.com/devis-signe.pdf",
    signatory_info={
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@email.com"
    }
)`}
          </pre>
        </Card>

        {/* Contact */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Support technique
          </h2>
          <p className="text-gray-700">
            Pour toute question technique ou problème d'intégration, n'hésitez pas à nous contacter.
            Notre équipe technique est disponible pour vous accompagner dans l'intégration.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm"><strong>Email :</strong> support@renovelo-cargos.com</p>
            <p className="text-sm"><strong>Délai de réponse :</strong> 24-48h en jours ouvrés</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocumentation;
