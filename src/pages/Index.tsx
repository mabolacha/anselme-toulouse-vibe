import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EventsSection from '@/components/EventsSection';
import MusicSection from '@/components/MusicSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <main className="min-h-screen bg-background font-montserrat">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <MusicSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-deep-black border-t border-gold/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-montserrat tracking-wide">
            © 2025 DJ Anselme - Toulouse, France. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
