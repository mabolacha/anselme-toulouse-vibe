import React from 'react';

interface MixPlayerEmbedProps {
  platform: 'hearthis' | 'youtube' | 'mixcloud';
  embedUrl: string;
  title: string;
}

const MixPlayerEmbed: React.FC<MixPlayerEmbedProps> = ({ platform, embedUrl, title }) => {
  // Si pas d'URL, afficher un placeholder
  if (!embedUrl || embedUrl.trim() === '') {
    return (
      <div className="rounded-lg overflow-hidden bg-warm-black/50 aspect-video flex items-center justify-center">
        <p className="text-muted-foreground font-montserrat">
          Lecteur {platform.charAt(0).toUpperCase() + platform.slice(1)} à configurer
        </p>
      </div>
    );
  }

  // Configuration par plateforme
  const getPlayerConfig = () => {
    switch (platform) {
      case 'hearthis':
        return {
          height: '250px', // Hauteur augmentée pour afficher le lecteur complet
          aspectRatio: undefined
        };
      case 'youtube':
        return {
          height: undefined,
          aspectRatio: 'aspect-video'
        };
      case 'mixcloud':
        return {
          height: '200px',
          aspectRatio: undefined
        };
      default:
        return {
          height: '200px',
          aspectRatio: undefined
        };
    }
  };

  const config = getPlayerConfig();

  return (
    <div className={`rounded-lg overflow-hidden ${config.aspectRatio || ''}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height={config.height}
        style={{ borderRadius: '10px' }}
        frameBorder="0"
        allow="autoplay"
        allowTransparency={true}
        title={title}
        className="w-full"
      />
    </div>
  );
};

export default MixPlayerEmbed;
