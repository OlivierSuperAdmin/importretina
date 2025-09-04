import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface SimplifiedFAQProps {
  title: string;
  items: FAQItem[];
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function SimplifiedFAQ({ title, items, spacing = { pt: 8, pb: 26 } }: SimplifiedFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Show only the 3 most important FAQ items
  const essentialFAQ = items.slice(0, 3);

  return (
    <section 
      className="bg-gray-50"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {title}
          </h2>
          
          <div className="space-y-4">
            {essentialFAQ.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden card-shadow"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {item.q}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="#more-faq" 
              className="inline-flex items-center text-primary hover:text-primary-hover font-medium"
            >
              Plus de questions fréquentes
              <ChevronDown className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}