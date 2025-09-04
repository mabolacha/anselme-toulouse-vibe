import { useState } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, Youtube, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '#home' },
    { name: 'À Propos', href: '#about' },
    { name: 'Musique', href: '#music' },
    { name: 'Événements', href: '#events' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/dj_anselme', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@djanselme', label: 'YouTube' },
    { icon: Facebook, href: 'https://www.facebook.com/djanselme', label: 'Facebook' }
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#home" className="text-2xl font-black font-montserrat text-gradient tracking-wider">
                DJ ANSELME
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-gold transition-colors duration-200 font-medium font-montserrat tracking-wide text-sm uppercase"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-gold"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-foreground hover:text-gold transition-colors duration-200 font-medium font-montserrat tracking-wide text-sm uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Social Media Sidebar */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-4">
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            className="p-3 bg-warm-black/80 backdrop-blur-sm border border-gold/20 rounded-full hover:border-gold hover:bg-gold/10 transition-all duration-300 group"
            aria-label={label}
          >
            <Icon className="h-5 w-5 text-gold group-hover:text-gold-muted transition-colors duration-300" />
          </a>
        ))}
      </div>
    </>
  );
};

export default Navigation;