interface HeaderProps {
  logoUrl: string;
  cta: {
    label: string;
    href: string;
    style: 'primary' | 'secondary';
    track?: string;
  };
  paddingY?: number;
  sticky?: boolean;
}

export default function Header({ logoUrl, cta, paddingY = 14, sticky = false }: HeaderProps) {
  const handleCtaClick = () => {
    if (cta.track) {
      // Analytics tracking would go here
      console.log(`Track event: ${cta.track}`);
    }
  };

  return (
    <header className={`bg-white border-b border-gray-100 ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="container" style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Rénolib" 
              className="h-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href={cta.href}
              onClick={handleCtaClick}
              className={`${cta.style === 'primary' ? 'btn-primary' : 'btn-link'} hidden sm:inline-block`}
            >
              {cta.label}
            </a>
            
            {/* Mobile CTA */}
            <a 
              href={cta.href}
              onClick={handleCtaClick}
              className="sm:hidden btn-primary text-sm px-4 py-2"
            >
              Éligibilité
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}