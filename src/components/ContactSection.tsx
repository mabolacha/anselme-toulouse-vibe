import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-montserrat text-gradient mb-4 tracking-wider">
            CONTACT
          </h2>
          <p className="text-xl text-muted-foreground font-montserrat tracking-wide max-w-3xl mx-auto">
            Prêt à faire vibrer votre événement ? Prenons contact pour discuter de votre projet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-card/80 backdrop-blur-sm border-gold/20 p-8">
            <h3 className="text-2xl font-bold font-montserrat text-gold mb-6">INFORMATIONS</h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-gold mr-4" />
                <div>
                  <div className="font-montserrat font-bold text-foreground">Toulouse, France</div>
                  <div className="text-muted-foreground font-montserrat">Disponible dans toute région Occitanie</div>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-gold mr-4" />
                <div>
                  <div className="font-montserrat font-bold text-foreground">info@djanselme.com</div>
                  <div className="text-muted-foreground font-montserrat">Réponse sous 24h</div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-gold mr-4" />
                <div>
                  <div className="font-montserrat font-bold text-foreground">+33 7 68 55 11 79</div>
                  <div className="text-muted-foreground font-montserrat">Lun-Dim 10h-22h</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button className="bg-gradient-gold text-deep-black font-montserrat font-bold flex-1">
                RÉSERVER MAINTENANT
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-montserrat text-gold">SERVICES</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Soirées Privées', 'Mariages', 'Événements Corporate', 'Clubs & Festivals'].map((service) => (
                <div key={service} className="bg-warm-black/50 border border-gold/20 rounded p-4 text-center">
                  <span className="font-montserrat font-bold text-gold">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;