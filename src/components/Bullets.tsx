import { Check } from 'lucide-react';

interface BulletsProps {
  title: string;
  items: string[];
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function Bullets({ title, items, spacing = { pt: 10, pb: 18 } }: BulletsProps) {
  return (
    <section 
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Dark green box with white text matching CTA style */}
          <div className="bg-primary text-white rounded-lg p-8 mx-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}