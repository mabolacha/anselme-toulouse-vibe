import { Play, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/dj-anselme-hero.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="DJ Anselme en action" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-black/70 via-deep-black/50 to-warm-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Main Title */}
          <h1 className="hero-title text-gradient mb-6 animate-glow-pulse">
            DJ ANSELME
          </h1>
          
          {/* Subtitle */}
          <div className="text-xl sm:text-2xl md:text-3xl font-light text-foreground mb-4 tracking-wider font-montserrat">
            DJ PROFESSIONNEL / PRODUCTEUR / TOULOUSE
          </div>
          
          {/* Location Badge */}
          <div className="flex items-center justify-center mb-8 text-gold font-medium">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg font-montserrat tracking-wide">Toulouse, France</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:bg-gold-muted text-deep-black font-bold px-8 py-4 text-lg tracking-wide font-montserrat shadow-gold hover:shadow-glow transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2" />
              ÉCOUTER MAINTENANT
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-deep-black font-bold px-8 py-4 text-lg tracking-wide font-montserrat transition-all duration-300"
            >
              <Calendar className="h-5 w-5 mr-2" />
              RÉSERVER ÉVÉNEMENT
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center animate-float">
            <span className="text-gold text-sm font-montserrat tracking-widest mb-2">DÉCOUVRIR</span>
            <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-5"></div>
    </section>
  );
};

export default HeroSection;