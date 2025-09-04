interface MondayFormProps {
  title: string;
  description: string;
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function MondayForm({ 
  title, 
  description, 
  spacing = { pt: 16, pb: 26 } 
}: MondayFormProps) {
  return (
    <section 
      style={{ 
        paddingTop: `${spacing.pt * 4}px`, 
        paddingBottom: `${spacing.pb * 4}px` 
      }}
      id="form"
    >
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced header section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Réponse sous 24h</span>
              </div>
            </div>
          </div>

          {/* Form container with enhanced styling */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="px-8 py-6" style={{ background: 'linear-gradient(90deg, #0E7A57 0%, #0E7A57 100%)' }}>
              <div className="flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2">Test d'éligibilité CEE</h3>
                  <p className="text-white/90">Complétez le formulaire ci-dessous</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <iframe 
                src="https://forms.monday.com/forms/embed/789ac55d6f7b9feee3e9cf55a7447ca5?r=euc1" 
                width="100%" 
                height="1200" 
                style={{ 
                  border: 0, 
                  borderRadius: '0',
                  overflow: 'hidden'
                }}
                title="Formulaire d'éligibilité vélo-cargo CEE"
                loading="lazy"
              />
            </div>
          </div>

          {/* Additional trust elements below form */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              🔒 Vos données sont sécurisées et ne seront utilisées que pour évaluer votre éligibilité CEE. 
              Aucune revente à des tiers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}