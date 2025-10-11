import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, Euro } from 'lucide-react';

interface Booking {
  id: string;
  status: string;
}

interface Quote {
  id: string;
  status: string;
  quote_amount: number | null;
}

interface AdminStatsProps {
  bookings: Booking[];
  quotes: Quote[];
}

const AdminStats = ({ bookings, quotes }: AdminStatsProps) => {
  const totalRequests = bookings.length + quotes.length;
  const pendingRequests = [...bookings, ...quotes].filter(item => item.status === 'pending').length;
  const confirmedRequests = [...bookings, ...quotes].filter(item => item.status === 'confirmed').length;
  const confirmationRate = totalRequests > 0 ? Math.round((confirmedRequests / totalRequests) * 100) : 0;
  const estimatedRevenue = quotes.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

  const stats = [
    {
      title: 'Total demandes',
      value: totalRequests,
      icon: Users,
      description: `${bookings.length} réservations, ${quotes.length} devis`
    },
    {
      title: 'En attente',
      value: pendingRequests,
      icon: Clock,
      description: 'Nécessitent votre attention'
    },
    {
      title: 'Taux de confirmation',
      value: `${confirmationRate}%`,
      icon: CheckCircle,
      description: `${confirmedRequests} confirmées sur ${totalRequests}`
    },
    {
      title: 'Revenus estimés',
      value: `${estimatedRevenue.toLocaleString('fr-FR')}€`,
      icon: Euro,
      description: 'Montant total des devis'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card/80 backdrop-blur-sm border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground font-montserrat">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
