import React from 'react';
import { Play, Download, ExternalLink, Headphones, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AudioPlayer from '@/components/AudioPlayer';
import { useAudioContent } from '@/hooks/useAudioContent';

const MusicSection = () => {
  const { audioContent, loading, error, updatePlayCount } = useAudioContent();
  const [selectedTrack, setSelectedTrack] = React.useState<string | null>(null);

  // Filter content by type
  const tracks = audioContent.filter(item => 
    item.mix_type === 'original_track' || item.mix_type === 'mix'
  );
  
  const podcasts = audioContent.filter(item => 
    item.mix_type === 'podcast' || item.mix_type === 'live_set'
  );

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="music" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl text-gold font-montserrat">Chargement des contenus...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="music" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xl text-red-500 font-montserrat">Erreur: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="music" className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-gold rounded-full animate-float"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-gold rotate-45 animate-glow-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-montserrat text-gradient mb-4 tracking-wider">
            DERNIERS MIXES & PODCASTS
          </h2>
          <p className="text-xl text-muted-foreground font-montserrat tracking-wide max-w-3xl mx-auto">
            Découvrez mes dernières créations musicales, des sets exclusifs aux tracks originales, 
            une fusion parfaite entre les sons d'ajourd'hui et ceux d'hier.
          </p>
        </div>

        {/* Mix Sessions Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-montserrat text-gold mb-8 text-center">
            MIX SESSIONS
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hearthis Player */}
            <Card className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold font-montserrat text-gold mb-4">
                  Open Format Mix vol 04 - Afro, RnB-Hip Hop, Kompas, Zouk, DanceHall, Afrobeat, Latino
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    scrolling="no" 
                    style={{ borderRadius: '10px' }}
                    width="100%" 
                    height="150" 
                    src="https://app.hearthis.at/embed/12807924/transparent_black/?hcolor=&color=&style=2&block_size=2&block_space=1&background=1&waveform=0&cover=0&autoplay=0&css=" 
                    frameBorder="0" 
                    allowTransparency={true}
                    allow="autoplay"
                  />
                </div>
              </div>
            </Card>

            {/* YouTube Player - Placeholder */}
            <Card className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold font-montserrat text-gold mb-4">
                  YouTube Mix Session
                </h3>
                <div className="rounded-lg overflow-hidden bg-warm-black/50 aspect-video flex items-center justify-center">
                  <p className="text-muted-foreground font-montserrat">Lecteur YouTube à venir</p>
                </div>
              </div>
            </Card>

            {/* Mixcloud Player - Placeholder */}
            <Card className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold font-montserrat text-gold mb-4">
                  Mixcloud Mix Session
                </h3>
                <div className="rounded-lg overflow-hidden bg-warm-black/50 aspect-video flex items-center justify-center">
                  <p className="text-muted-foreground font-montserrat">Lecteur Mixcloud à venir</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Streaming Platforms */}
          <div className="text-center mt-12 p-8 bg-warm-black/50 backdrop-blur-sm border border-gold/20 rounded-lg">
            <h3 className="text-2xl font-bold font-montserrat text-gold mb-4">
              SUIVEZ-MOI SUR LES PLATEFORMES
            </h3>
            <p className="text-muted-foreground font-montserrat mb-6">
              Retrouvez tous mes sets et productions sur vos plateformes préférées
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-montserrat">
                Hear.this
              </Button>
              <Button className="bg-[#FA57C1] hover:bg-[#fb6bc4] text-white font-montserrat">
                Apple Music
              </Button>
              <Button className="bg-[#FF5500] hover:bg-[#ff6619] text-white font-montserrat">
                SoundCloud
              </Button>
              <Button className="bg-[#FF0000] hover:bg-[#ff1919] text-white font-montserrat">
                YouTube
              </Button>
            </div>
          </div>
        </div>

        {/* Latest Tracks */}
        <div>
          <h2 className="text-3xl font-bold font-montserrat text-gold mb-8 text-center">
            DERNIÈRES PRODUCTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track) => (
              <Card 
                key={track.id} 
                className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 group hover:shadow-gold overflow-hidden"
              >
                {/* Track Cover */}
                <div className="relative aspect-square bg-gradient-gold p-8 flex items-center justify-center">
                  <div className="text-deep-black text-center">
                    <Headphones className="h-16 w-16 mx-auto mb-4" />
                    <div className="font-black text-xl font-montserrat">{track.title}</div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 p-0">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Track Info */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold font-montserrat text-foreground group-hover:text-gold transition-colors duration-300">
                      {track.title}
                    </h4>
                    <div className="flex justify-between items-center text-sm text-muted-foreground font-montserrat mt-1">
                      <span>{track.genre || 'Electronic'}</span>
                      <span>{formatDuration(track.duration_seconds)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm font-montserrat mb-6">
                    {track.description}
                  </p>

                  {/* Audio Player or Actions */}
                  {selectedTrack === track.id ? (
                    <AudioPlayer 
                      title={track.title}
                      filePath={track.file_path}
                      duration={track.duration_seconds || 0}
                      onPlayCountUpdate={() => updatePlayCount(track.id)}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
                        onClick={() => setSelectedTrack(track.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        ÉCOUTER
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;