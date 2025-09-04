
interface HeroProps {
  layout: 'one-column' | 'two-column';
  title: string;
  subtitle: string;
  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  primaryCta: {
    label: string;
    href: string;
    style: 'primary' | 'secondary';
    track?: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    style: 'link' | 'secondary';
  };
  badge?: {
    text: string;
    color: string;
    textColor: string;
  };
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function Hero({ 
  title, 
  subtitle, 
  media, 
  primaryCta, 
  secondaryCta, 
  badge,
  spacing = { pt: 36, pb: 20 }
}: HeroProps) {
  const handlePrimaryCtaClick = () => {
    if (primaryCta.track) {
      console.log(`Track event: ${primaryCta.track}`);
    }
  };

  return (
    <section 
      className="bg-white"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className="text-center">
          {badge && (
            <div className="inline-block mb-6">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: badge.color, 
                  color: badge.textColor 
                }}
              >
                {badge.text}
              </span>
            </div>
          )}

          <div className="mb-8">
            <img 
              src="/assets/velo1.jpg" 
              alt={media.alt || 'Vélo-cargo professionnel éligible CEE'} 
              className="w-full max-w-2xl mx-auto h-auto object-cover rounded-2xl shadow-lg"
              style={{ objectPosition: 'center', height: '400px' }}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={primaryCta.href}
              onClick={handlePrimaryCtaClick}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              {primaryCta.label}
            </a>
            
            {secondaryCta && (
              <a 
                href={secondaryCta.href}
                className="btn-link text-lg w-full sm:w-auto"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}