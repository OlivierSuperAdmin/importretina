interface ProductGalleryProps {
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function ProductGallery({ 
  spacing = { pt: 16, pb: 16 } 
}: ProductGalleryProps) {
  return (
    <section 
      className="bg-white"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vélos-cargos professionnels 100% financés
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Solutions de mobilité électrique adaptées aux DOM-TOM. Livraison et mise en service incluses en Guadeloupe (971) et Martinique (972).
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Vélo 1 - Cargo urbain */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div style={{paddingTop: '100%'}} className="relative overflow-hidden">
              <img 
                src="/assets/velo1.jpg" 
                alt="Vélo-cargo électrique urbain professionnel en Guadeloupe" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Vélo-cargo électrique professionnel
              </h3>
              <p className="text-gray-600 mb-4">
                Parfait pour la mobilité urbaine en Guadeloupe et Martinique. Capacité de charge optimisée, batterie longue durée ≥ 400 Wh.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  100% financé CEE
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Norme EN 15194
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Charge ≥ 175kg
                </span>
              </div>
            </div>
          </div>
          
          {/* Vélo 2 - Cargo triporteur */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div style={{paddingTop: '100%'}} className="relative overflow-hidden">
              <img 
                src="/assets/velo2.jpg" 
                alt="Vélo-cargo avec assistance électrique en Martinique" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Solution mobilité insulaire
              </h3>
              <p className="text-gray-600 mb-4">
                Idéal pour les professionnels des DOM-TOM. Solution écoresponsable adaptée au climat tropical et aux déplacements urbains.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  100% financé CEE
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Marquage FNUCI
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Ultra-stable
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ces modèles respectent toutes les normes CEE requises : batterie ≥ 400 Wh, charge totale ≥ 175 kg, conformité EN 15194.
          </p>
          <a 
            href="#form"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Vérifier mon éligibilité maintenant
          </a>
        </div>
      </div>
    </section>
  );
}