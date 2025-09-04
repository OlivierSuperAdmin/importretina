import { CheckCircle, Building2, Truck } from 'lucide-react';

interface FeatureItem {
  icon: string;
  title: string;
  text: string;
}

interface FeaturesProps {
  columns: number;
  items: FeatureItem[];
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

const iconMap = {
  CheckCircle: CheckCircle,
  Building2: Building2,
  Truck: Truck,
};

export default function Features({ columns, items, spacing = { pt: 8, pb: 28 } }: FeaturesProps) {
  const gridCols = columns === 3 ? 'md:grid-cols-3' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  return (
    <section 
      className="bg-gray-50"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-gray-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}