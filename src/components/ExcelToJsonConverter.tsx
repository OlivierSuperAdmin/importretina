import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, Send, FileSpreadsheet, CheckCircle2, AlertCircle, TrendingUp, MapPin } from 'lucide-react';

interface Summary {
  totalQuantity: number;
  departmentDistribution: {
    Martinique: number;
    Guadeloupe: number;
    Guyane: number;
    Réunion: number;
  };
  rowsProcessed: number;
  details: any[];
}

const ExcelToJsonConverter: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [summary, setSummary] = useState<Summary | null>(null);

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
        // Déclencher les confettis
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
        });

        // Calculer le résumé
        const dataArray = Array.isArray(payload.data) ? payload.data : 
                         (payload.data && typeof payload.data === 'object' ? Object.values(payload.data).flat() : []);
        
        const summaryData: Summary = {
          totalQuantity: 0,
          departmentDistribution: {
            Martinique: 0,
            Guadeloupe: 0,
            Guyane: 0,
            Réunion: 0
          },
          rowsProcessed: dataArray.length,
          details: dataArray
        };

        // Calculer la somme et la distribution
        dataArray.forEach((row: any) => {
          // Rechercher le champ quantité (différentes variantes possibles)
          const quantity = row.quantité || row.quantite || row.Quantité || row.Quantite || row.quantity || row.Quantity || 0;
          summaryData.totalQuantity += Number(quantity) || 0;

          // Rechercher le département
          const dept = (row.département || row.departement || row.Département || row.Departement || 
                      row.region || row.Region || row.région || row.Région || '').toString();
          
          const deptLower = dept.toLowerCase();
          
          if (deptLower.includes('martinique') || dept === '972') {
            summaryData.departmentDistribution.Martinique += Number(quantity) || 0;
          } else if (deptLower.includes('guadeloupe') || dept === '971') {
            summaryData.departmentDistribution.Guadeloupe += Number(quantity) || 0;
          } else if (deptLower.includes('guyane') || dept === '973') {
            summaryData.departmentDistribution.Guyane += Number(quantity) || 0;
          } else if (deptLower.includes('réunion') || deptLower.includes('reunion') || dept === '974') {
            summaryData.departmentDistribution.Réunion += Number(quantity) || 0;
          }
        });

        setSummary(summaryData);
        setJsonData(null); // Vider le JSON affiché
        setFileName('');
        
        setStatus({ 
          type: 'success', 
          message: `✅ Données envoyées avec succès! ${dataArray.length} lignes traitées.` 
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

            {/* Résumé après envoi */}
            {summary && !jsonData && (
              <div className="space-y-4 animate-fade-in">
                <Card className="p-6 bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Résumé de l'envoi
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total des quantités</p>
                      <p className="text-2xl font-bold text-gray-800">{summary.totalQuantity.toLocaleString('fr-FR')}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Lignes traitées</p>
                      <p className="text-2xl font-bold text-gray-800">{summary.rowsProcessed}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Répartition par département
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(summary.departmentDistribution).map(([dept, qty]) => (
                        <div key={dept} className="flex justify-between items-center bg-white px-3 py-2 rounded">
                          <span className="text-sm font-medium text-gray-700">{dept}</span>
                          <span className="text-sm font-bold text-gray-900">{qty.toLocaleString('fr-FR')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {summary.details.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                        Voir le détail des lignes ({summary.details.length} lignes)
                      </summary>
                      <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded p-3">
                        <pre className="text-xs text-gray-600">{JSON.stringify(summary.details, null, 2)}</pre>
                      </div>
                    </details>
                  )}
                </Card>

                <Button
                  onClick={() => {
                    setSummary(null);
                    setStatus({ type: null, message: '' });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Nouvelle importation
                </Button>
              </div>
            )}

            {/* Bouton de test webhook */}
            {!jsonData && !summary && (
              <div className="text-center pt-4">
                <Button
                  onClick={async () => {
                    const testData = [
                      { nom: "Vélo cargo 1", quantité: 5, département: "Martinique", modèle: "Urban Arrow" },
                      { nom: "Vélo cargo 2", quantité: 3, département: "Guadeloupe", modèle: "Babboe" },
                      { nom: "Vélo cargo 3", quantité: 2, département: "Martinique", modèle: "Riese & Müller" },
                      { nom: "Vélo cargo 4", quantité: 4, département: "Guyane", modèle: "Urban Arrow" },
                      { nom: "Vélo cargo 5", quantité: 1, département: "Réunion", modèle: "Bakfiets" }
                    ];
                    
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
