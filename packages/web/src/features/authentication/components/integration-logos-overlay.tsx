const CLIENTS = [
  {
    name: 'MoneyGram',
    src: 'https://www.wippa.com.au/logos/moneygram.svg',
  },
  { name: 'Red Bull', src: 'https://www.wippa.com.au/logos/redbull.svg' },
  { name: 'Rakuten', src: 'https://www.wippa.com.au/logos/rakuten.svg' },
  { name: 'DocuSign', src: 'https://www.wippa.com.au/logos/docusign.svg' },
  {
    name: 'Contentful',
    src: 'https://www.wippa.com.au/logos/contentful.svg',
  },
  { name: 'PostHog', src: 'https://www.wippa.com.au/logos/posthog.svg' },
  { name: 'Roblox', src: 'https://www.wippa.com.au/logos/roblox.svg' },
  { name: 'Alan', src: 'https://www.wippa.com.au/logos/alan.svg' },
  {
    name: 'Funding Societies',
    src: 'https://www.wippa.com.au/logos/fundingsocieties-sales.png',
  },
  { name: 'Plivo', src: 'https://www.wippa.com.au/logos/plivo.svg' },
  { name: 'Nedap', src: 'https://www.wippa.com.au/logos/nedap.svg' },
  {
    name: 'Experience.com',
    src: 'https://www.wippa.com.au/logos/experience.com.svg',
  },
] as const;

export const IntegrationLogosOverlay = () => {
  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-8 items-center">
      {CLIENTS.map(({ name, src }) => (
        <img
          key={name}
          src={src}
          alt={name}
          className="h-7 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ))}
    </div>
  );
};
