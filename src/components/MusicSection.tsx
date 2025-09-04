import { Play, Download, ExternalLink, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MusicSection = () => {
  const latestTracks = [
    {
      id: 1,
      title: 'Toulouse Nights',
      genre: 'Deep House',
      duration: '5:23',
      releaseDate: '2024-01-15',
      coverUrl: '/api/placeholder/300/300',
      description: 'Un voyage musical à travers les nuits toulousaines',
      streamingLinks: {
        spotify: '#',
        apple: '#',
        soundcloud: '#'
      }
    },
    {
      id: 2,
      title: 'Best of 90s',
      genre: 'Généraliste',
      duration: '6:41',
      releaseDate: '2023-12-08',
      coverUrl: '/api/placeholder/300/300',
      description: 'Hommage aux sons des années 90',
      streamingLinks: {
        spotify: '#',
        apple: '#',
        soundcloud: '#'
      }
    },
    {
      id: 3,
      title: 'Garonne Flow',
      genre: 'Tech House',
      duration: '7:15',
      releaseDate: '2023-11-22',
      coverUrl: '/api/placeholder/300/300',
      description: 'Inspiré par les berges de la Garonne',
      streamingLinks: {
        spotify: '#',
        apple: '#',
        soundcloud: '#'
      }
    }
  ];

  const podcasts = [
    {
      id: 1,
      title: 'DJ Anselme Mix Sessions #012',
      description: 'Mix exclusif enregistré live au Festival du Fousseret',
      duration: '62 min',
      date: '2024-01-20',
      listeners: '12.5K'
    },
    {
      id: 2,
      title: 'DJ Anselme Mix Sessions #011',
      description: 'Set RnB Années 2000',
      duration: '58 min',
      date: '2024-01-05',
      listeners: '18.2K'
    }
  ];

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

        {/* Latest Tracks */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-montserrat text-gold mb-8 text-center">
            DERNIÈRES PRODUCTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestTracks.map((track) => (
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
                      <span>{track.genre}</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm font-montserrat mb-6">
                    {track.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      ÉCOUTER
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gold text-gold hover:bg-gold hover:text-deep-black"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Podcasts Section */}
        <div>
          <h2 className="text-3xl font-bold font-montserrat text-gold mb-8 text-center">
            MIX SESSIONS PODCAST
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {podcasts.map((podcast) => (
              <Card 
                key={podcast.id}
                className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 group hover:shadow-gold"
              >
                <div className="p-6 flex items-center gap-6">
                  {/* Play Button */}
                  <div className="flex-shrink-0">
                    <Button 
                      size="lg" 
                      className="rounded-full w-16 h-16 p-0 bg-gradient-gold hover:bg-gold-muted text-deep-black shadow-gold group-hover:shadow-glow transition-all duration-300"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>

                  {/* Podcast Info */}
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold font-montserrat text-foreground group-hover:text-gold transition-colors duration-300 mb-2">
                      {podcast.title}
                    </h4>
                    <p className="text-muted-foreground font-montserrat mb-3">
                      {podcast.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gold font-montserrat">
                      <span>{podcast.duration}</span>
                      <span>{podcast.date}</span>
                      <span>{podcast.listeners} écoutes</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="flex-shrink-0">
                    <Button 
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-deep-black"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
      </div>
    </section>
  );
};

export default MusicSection;