import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, User, MapPin, Users, Euro, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  guest_count: number | null;
  venue: string | null;
  budget_range: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  guest_count: number | null;
  venue: string | null;
  duration_hours: number | null;
  budget_range: string | null;
  special_requests: string | null;
  quote_amount: number | null;
  status: string;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      setBookings(bookingsData || []);
      setQuotes(quotesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Demande de réservation ${status === 'confirmed' ? 'confirmée' : status === 'rejected' ? 'refusée' : 'en attente'}`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => 
        prev.map(quote => 
          quote.id === id ? { ...quote, status } : quote
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Demande de devis ${status === 'confirmed' ? 'confirmée' : status === 'rejected' ? 'refusée' : 'en attente'}`,
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Refusé</Badge>;
      default:
        return <Badge className="bg-gold text-deep-black">En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl text-gold font-montserrat">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black font-montserrat text-gradient mb-4">
            GESTION DES DEMANDES
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Réservations et demandes de devis
          </p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="bookings">
              Réservations ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="quotes">
              Devis ({quotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-6">
              {bookings.length === 0 ? (
                <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-gold/20">
                  <p className="text-muted-foreground font-montserrat">
                    Aucune demande de réservation pour le moment
                  </p>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="p-6 bg-card/80 backdrop-blur-sm border-gold/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-deep-black" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-montserrat text-foreground">
                            {booking.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-montserrat">
                            {booking.event_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(booking.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gold" />
                        <span>{booking.email}</span>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gold" />
                          <span>{booking.phone}</span>
                        </div>
                      )}
                      {booking.event_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span>{new Date(booking.event_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {booking.venue && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gold" />
                          <span>{booking.venue}</span>
                        </div>
                      )}
                      {booking.guest_count && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gold" />
                          <span>{booking.guest_count} invités</span>
                        </div>
                      )}
                      {booking.budget_range && (
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-gold" />
                          <span>{booking.budget_range}</span>
                        </div>
                      )}
                    </div>

                    {booking.message && (
                      <div className="mb-6">
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-gold mt-1" />
                          <div>
                            <p className="font-medium text-foreground mb-1">Message:</p>
                            <p className="text-muted-foreground">{booking.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Refuser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'pending')}
                        className="border-gold text-gold hover:bg-gold hover:text-deep-black"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        En attente
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <div className="space-y-6">
              {quotes.length === 0 ? (
                <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-gold/20">
                  <p className="text-muted-foreground font-montserrat">
                    Aucune demande de devis pour le moment
                  </p>
                </Card>
              ) : (
                quotes.map((quote) => (
                  <Card key={quote.id} className="p-6 bg-card/80 backdrop-blur-sm border-gold/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                          <Euro className="h-6 w-6 text-deep-black" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-montserrat text-foreground">
                            {quote.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-montserrat">
                            {quote.event_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(quote.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(quote.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gold" />
                        <span>{quote.email}</span>
                      </div>
                      {quote.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gold" />
                          <span>{quote.phone}</span>
                        </div>
                      )}
                      {quote.event_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span>{new Date(quote.event_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {quote.venue && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gold" />
                          <span>{quote.venue}</span>
                        </div>
                      )}
                      {quote.guest_count && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gold" />
                          <span>{quote.guest_count} invités</span>
                        </div>
                      )}
                      {quote.duration_hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gold" />
                          <span>{quote.duration_hours}h</span>
                        </div>
                      )}
                      {quote.budget_range && (
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-gold" />
                          <span>{quote.budget_range}</span>
                        </div>
                      )}
                      {quote.quote_amount && (
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Euro className="h-4 w-4 text-gold" />
                          <span>{quote.quote_amount}€</span>
                        </div>
                      )}
                    </div>

                    {quote.special_requests && (
                      <div className="mb-6">
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-gold mt-1" />
                          <div>
                            <p className="font-medium text-foreground mb-1">Demandes spéciales:</p>
                            <p className="text-muted-foreground">{quote.special_requests}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateQuoteStatus(quote.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Refuser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuoteStatus(quote.id, 'pending')}
                        className="border-gold text-gold hover:bg-gold hover:text-deep-black"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        En attente
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBookings;