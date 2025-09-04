interface Card {
  title: string;
  text: string;
  cta: {
    label: string;
    href: string;
    track?: string;
  };
}

interface SplitCardsProps {
  title: string;
  cards: Card[];
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function SplitCards({ title, cards, spacing = { pt: 10, pb: 24 } }: SplitCardsProps) {
  const handleCardCtaClick = (track?: string) => {
    if (track) {
      console.log(`Track event: ${track}`);
    }
  };

  return (
    <section 
      className="bg-white"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
      id="regions"
    >
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-8 card-shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {card.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {card.text}
              </p>
              
              <a 
                href={card.cta.href}
                onClick={() => handleCardCtaClick(card.cta.track)}
                className="btn-primary inline-block text-center w-full"
              >
                {card.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}