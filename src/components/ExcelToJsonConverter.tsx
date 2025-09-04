import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, Send, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

const ExcelToJsonConverter: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus({ type: null, message: '' });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Convertir toutes les feuilles en JSON
        const sheets: any = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        });

        // Si une seule feuille, on retourne directement son contenu
        const result = workbook.SheetNames.length === 1 
          ? sheets[workbook.SheetNames[0]] 
          : sheets;

        setJsonData(result);
        setStatus({ type: 'success', message: 'Fichier Excel converti avec succès!' });
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        setStatus({ type: 'error', message: 'Erreur lors de la lecture du fichier Excel' });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sendToWebhook = async () => {
    if (!jsonData) return;

    setLoading(true);
    setStatus({ type: null, message: '' });

    // Préparer les données avec métadonnées
    const payload = {
      timestamp: new Date().toISOString(),
      fileName: fileName,
      dataCount: Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length,
      data: jsonData
    };

    console.log('📤 Envoi au webhook...');
    console.log('Payload:', payload);

    try {
      const response = await fetch('https://hook.eu2.make.com/muvnq1jhdngry75l2g5oy9jid6u4e1v0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('📨 Réponse:', response.status, responseText);

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: `✅ Données envoyées avec succès! Réponse du serveur: "${responseText}"` 
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: `❌ Erreur lors de l'envoi: ${response.status} ${response.statusText}. Réponse: ${responseText}` 
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      setStatus({ 
        type: 'error', 
        message: `❌ Erreur de connexion au webhook: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Convertisseur Excel → JSON</h1>
          <p className="text-gray-600">Importez votre fichier Excel et envoyez-le au webhook</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* Zone de téléchargement */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <FileSpreadsheet className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {fileName || 'Cliquez pour sélectionner un fichier Excel'}
                  </p>
                  <p className="text-sm text-gray-500">Formats acceptés: .xlsx, .xls</p>
                </div>
                <Button type="button" variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Choisir un fichier
                </Button>
              </label>
            </div>

            {/* Statut */}
            {status.type && (
              <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                {status.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            {/* Aperçu JSON */}
            {jsonData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Aperçu du JSON généré</h2>
                  <span className="text-sm text-gray-500">
                    {Array.isArray(jsonData) ? `${jsonData.length} lignes` : `${Object.keys(jsonData).length} feuilles`}
                  </span>
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={sendToWebhook}
                    disabled={loading}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer sur le webhook
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Bouton de test webhook */}
            {!jsonData && (
              <div className="text-center pt-4">
                <Button
                  onClick={async () => {
                    const testData = {
                      test: true,
                      timestamp: new Date().toISOString(),
                      message: "Test direct depuis l'interface",
                      data: [{ nom: "Test", valeur: 123 }]
                    };
                    
                    setJsonData(testData);
                    setFileName("test-direct.json");
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Tester le webhook avec des données exemple
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExcelToJsonConverter;
