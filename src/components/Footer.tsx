interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links: FooterLink[];
  smallprint: string;
  spacing?: {
    pt?: number;
    pb?: number;
  };
}

export default function Footer({ links, smallprint, spacing = { pt: 22, pb: 22 } }: FooterProps) {
  return (
    <footer 
      className="bg-gray-900 text-white"
      style={{ 
        paddingTop: `${spacing.pt}px`, 
        paddingBottom: `${spacing.pb}px` 
      }}
    >
      <div className="container">
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center space-x-6 mb-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <p className="text-gray-400 text-sm">
            {smallprint}
          </p>
        </div>
      </div>
    </footer>
  );
}