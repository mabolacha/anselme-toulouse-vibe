import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const EventsSection = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Nuit Électronique',
      venue: 'Le Connexion Live',
      date: '2024-02-15',
      time: '23:00',
      location: 'Toulouse, France',
      description: 'Soirée électronique avec les meilleurs DJs de Toulouse',
      price: '15€',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Festival Summer Vibes',
      venue: 'Parc des Expositions',
      date: '2024-03-22',
      time: '20:00',
      location: 'Toulouse, France',
      description: 'Festival outdoor avec DJ sets en plein air',
      price: '25€',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Soirée Privée Corporate',
      venue: 'Événement Privé',
      date: '2024-04-05',
      time: '19:30',
      location: 'Toulouse, France',
      description: 'Animation DJ pour événement corporate',
      price: 'Sur devis',
      status: 'private'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventStatus = (eventDate: string, originalStatus: string) => {
    const today = new Date();
    const eventDateTime = new Date(eventDate);
    
    // Réinitialiser l'heure pour comparer seulement les dates
    today.setHours(0, 0, 0, 0);
    eventDateTime.setHours(0, 0, 0, 0);
    
    if (eventDateTime < today) {
      return 'finished';
    }
    return originalStatus;
  };

  return (
    <section id="events" className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-gold rotate-45"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-gold rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-gold rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-montserrat text-gradient mb-4 tracking-wider">
            ÉVÉNEMENTS À VENIR
          </h2>
          <p className="text-xl text-muted-foreground font-montserrat tracking-wide max-w-3xl mx-auto">
            Découvrez mes prochaines performances à Toulouse et dans la région. 
            Réservez vos places pour une expérience musicale inoubliable.
          </p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold hover:text-deep-black font-montserrat tracking-wide"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              VOIR TOUS LES ÉVÉNEMENTS
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => {
            const currentStatus = getEventStatus(event.date, event.status);
            
            return (
            <Card 
              key={event.id} 
              className="bg-card/80 backdrop-blur-sm border-gold/20 hover:border-gold transition-all duration-300 group hover:shadow-gold overflow-hidden"
            >
              <div className="p-6">
                {/* Event Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-montserrat tracking-wide ${
                    currentStatus === 'confirmed' ? 'bg-gold text-deep-black' :
                    currentStatus === 'private' ? 'bg-toulouse-brick text-foreground' :
                    currentStatus === 'finished' ? 'bg-muted text-muted-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {currentStatus === 'confirmed' ? 'CONFIRMÉ' :
                     currentStatus === 'private' ? 'PRIVÉ' :
                     currentStatus === 'finished' ? 'TERMINÉ' : 'EN ATTENTE'}
                  </span>
                  <span className="text-gold font-bold font-montserrat">{event.price}</span>
                </div>

                {/* Event Title */}
                <h3 className="text-xl font-bold font-montserrat text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                  {event.title}
                </h3>

                {/* Venue */}
                <p className="text-gold font-medium font-montserrat mb-4">{event.venue}</p>

                {/* Date & Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-gold" />
                    <span className="font-montserrat text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-gold" />
                    <span className="font-montserrat text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-gold" />
                    <span className="font-montserrat text-sm">{event.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm font-montserrat mb-6 line-clamp-2">
                  {event.description}
                </p>

                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-gold hover:bg-gold-muted text-deep-black font-bold font-montserrat tracking-wide transition-all duration-300"
                  disabled={currentStatus === 'private' || currentStatus === 'finished'}
                >
                  {currentStatus === 'private' ? 'ÉVÉNEMENT PRIVÉ' :
                   currentStatus === 'finished' ? 'ÉVÉNEMENT TERMINÉ' : 'RÉSERVER'}
                </Button>
              </div>
            </Card>
            );
          })}
        </div>

        {/* Contact for Booking */}
        <div className="text-center mt-16 p-8 bg-warm-black/50 backdrop-blur-sm border border-gold/20 rounded-lg">
          <h3 className="text-2xl font-bold font-montserrat text-gold mb-4">
            Besoin d'un DJ pour votre événement ?
          </h3>
          <p className="text-muted-foreground font-montserrat mb-6 max-w-2xl mx-auto">
            Soirées privées, mariages, événements corporatifs... 
            Contactez-moi pour un devis personnalisé et une prestation sur mesure.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-gold hover:bg-gold-muted text-deep-black font-bold px-8 py-4 font-montserrat tracking-wide shadow-gold hover:shadow-glow transition-all duration-300"
          >
            DEMANDER UN DEVIS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;