interface StepItem {
  title: string;
  text: string;
}

interface StepsProps {
  title: string;
  items: StepItem[];
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function Steps({ title, items, spacing = { pt: 16, pb: 22 } }: StepsProps) {
  return (
    <section 
      className="bg-gray-50"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
      id="process"
    >
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-8 top-16 bottom-0 w-px bg-gray-300"></div>
            
            <div className="space-y-12">
              {items.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                    {index + 1}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}