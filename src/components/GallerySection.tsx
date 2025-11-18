import { useGalleryPhotos } from '@/hooks/useGalleryPhotos';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';

const GallerySection = () => {
  const { photos, loading } = useGalleryPhotos(true);

  // Show only first 6 featured photos
  const displayPhotos = photos.slice(0, 6);

  return (
    <section id="galerie" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="h-8 w-8 text-gold" />
            <h2 className="text-4xl md:text-5xl font-black text-gradient">
              GALERIE
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez les meilleurs moments de mes soirées à Toulouse
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : displayPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gold/20 hover:border-gold/50 transition-all duration-300"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-gold font-bold text-xl mb-2">
                      {photo.title}
                    </h3>
                    {photo.event_type && (
                      <p className="text-white/90 text-sm">
                        {photo.event_type}
                      </p>
                    )}
                    {photo.location && (
                      <p className="text-white/70 text-sm mt-1">
                        📍 {photo.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gold/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Les photos arrivent bientôt...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;