import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique d'envoi du formulaire
    console.log('Formulaire soumis:', formData);
    // Réinitialiser le formulaire après envoi
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-montserrat text-gradient mb-4 tracking-wider">
            CONTACT
          </h2>
          <p className="text-xl text-muted-foreground font-montserrat tracking-wide max-w-3xl mx-auto">
            Contactez-moi pour discuter de votre projet musical et obtenir un devis personnalisé.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <Card className="bg-card/80 backdrop-blur-sm border-gold/20 p-8">
            <h3 className="text-2xl font-bold font-montserrat text-gold mb-6">VOTRE DEMANDE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-montserrat">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-background/50 border-gold/30 focus:border-gold"
                  placeholder="Votre nom et prénom"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-montserrat">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background/50 border-gold/30 focus:border-gold"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-montserrat">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-background/50 border-gold/30 focus:border-gold"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-foreground font-montserrat">Type d'événement *</Label>
                  <Input
                    id="eventType"
                    name="eventType"
                    type="text"
                    required
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="bg-background/50 border-gold/30 focus:border-gold"
                    placeholder="Mariage, soirée privée, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-foreground font-montserrat">Date prévue</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="bg-background/50 border-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-montserrat">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-background/50 border-gold/30 focus:border-gold min-h-[120px]"
                  placeholder="Décrivez votre événement, vos attentes, le nombre d'invités, le lieu, etc."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-gold text-deep-black font-montserrat font-bold py-3 hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4 mr-2" />
                ENVOYER MA DEMANDE
              </Button>
            </form>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border-gold/20 p-6">
              <h3 className="text-xl font-bold font-montserrat text-gold mb-4">COORDONNÉES</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gold mr-3" />
                  <div>
                    <div className="font-montserrat font-bold text-foreground">Toulouse, France</div>
                    <div className="text-sm text-muted-foreground font-montserrat">Région Occitanie</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gold mr-3" />
                  <div>
                    <div className="font-montserrat font-bold text-foreground">info@djanselme.com</div>
                    <div className="text-sm text-muted-foreground font-montserrat">Réponse sous 24h</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gold mr-3" />
                  <div>
                    <div className="font-montserrat font-bold text-foreground">+33 7 68 55 11 79</div>
                    <div className="text-sm text-muted-foreground font-montserrat">Lun-Dim 10h-22h</div>
                  </div>
                </div>
              </div>
            </Card>

            <div id="services" className="space-y-4">
              <h3 className="text-xl font-bold font-montserrat text-gold">MES SERVICES</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Soirées Privées', 'Mariages', 'Événements Corporate', 'Clubs & Festivals'].map((service) => (
                  <div key={service} className="bg-warm-black/50 border border-gold/20 rounded p-3 text-center">
                    <span className="font-montserrat text-sm font-bold text-gold">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;