import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Building2, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { blink } from '../blink/client';

interface CompanyData {
  denomination: string;
  adresse: string;
  siren: string;
  dirigeant: string;
}

interface SirenVerificationProps {
  className?: string;
}

export default function SirenVerification({ className = '' }: SirenVerificationProps) {
  const [siren, setSiren] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyDetails, setCompanyDetails] = useState<CompanyData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchCompanyData = async (sirenNumber: string) => {
    if (sirenNumber.length !== 9) return;

    setLoading(true);
    setError('');
    setCompanyName('');
    setCompanyDetails(null);
    setShowDetails(false);

    try {
      console.log('Fetching data for SIREN:', sirenNumber);
      
      const response = await blink.data.fetch({
        url: `https://api.insee.fr/entreprises/sirene/V3/siret?q=siren:${sirenNumber}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer {{INSEE_API_KEY}}',
          'Accept': 'application/json',
        },
      });

      console.log('API Response:', response);

      if (response.status === 200 && response.body) {
        const data = response.body;
        
        if (data.etablissements && data.etablissements.length > 0) {
          const etablissement = data.etablissements[0];
          const uniteLegale = etablissement.uniteLegale;
          
          const denomination = uniteLegale.denominationUniteLegale || 
                             uniteLegale.prenom1UniteLegale + ' ' + uniteLegale.nomUniteLegale ||
                             'Nom non disponible';
          
          const adresse = `${etablissement.adresseEtablissement.numeroVoieEtablissement || ''} ${etablissement.adresseEtablissement.typeVoieEtablissement || ''} ${etablissement.adresseEtablissement.libelleVoieEtablissement || ''}, ${etablissement.adresseEtablissement.codePostalEtablissement || ''} ${etablissement.adresseEtablissement.libelleCommuneEtablissement || ''}`.trim();
          
          const dirigeant = uniteLegale.prenom1UniteLegale && uniteLegale.nomUniteLegale 
            ? `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`
            : 'Non disponible';

          setCompanyName(denomination);
          setCompanyDetails({
            denomination,
            adresse,
            siren: sirenNumber,
            dirigeant
          });
        } else {
          setError('Aucune entreprise trouvée avec ce SIREN');
        }
      } else {
        setError('Erreur lors de la recherche');
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Service temporairement indisponible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siren.length === 9) {
      const timeoutId = setTimeout(() => {
        fetchCompanyData(siren);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setCompanyName('');
      setCompanyDetails(null);
      setShowDetails(false);
    }
  }, [siren]);

  const handleSirenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Garder seulement les chiffres
    if (value.length <= 9) {
      setSiren(value);
      if (error) setError(''); // Effacer l'erreur quand l'utilisateur tape
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">
          Vérification SIREN instantanée
        </h3>
      </div>
      
      <div>
        <Label htmlFor="siren-input" className="text-sm font-medium text-gray-700 mb-2 block">
          Numéro SIREN (9 chiffres)
        </Label>
        <div className="relative">
          <Input
            id="siren-input"
            type="text"
            placeholder="Tapez votre SIREN..."
            value={siren}
            onChange={handleSirenChange}
            className="text-center font-mono text-lg tracking-wider pr-10"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {companyName && !error && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-3">
            <div 
              onClick={toggleDetails}
              className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded-lg transition-colors"
            >
              <div className="flex-1">
                <p className="text-blue-900 font-semibold text-lg">
                  {companyName}
                </p>
                <p className="text-blue-600 text-sm">
                  Cliquez pour voir les détails
                </p>
              </div>
              <div className="flex-shrink-0">
                {showDetails ? (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>

            {showDetails && companyDetails && (
              <div className="border-t border-blue-200 pt-3 space-y-3">
                <div className="grid gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">Nom de la société</span>
                    <span className="text-gray-900 font-medium">{companyDetails.denomination}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">Adresse</span>
                    <span className="text-gray-900">{companyDetails.adresse}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">SIREN</span>
                    <span className="text-gray-900 font-mono">{companyDetails.siren}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">Dirigeant</span>
                    <span className="text-gray-900">{companyDetails.dirigeant}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        La recherche automatique se déclenche quand vous tapez 9 chiffres.
      </p>
    </div>
  );
}