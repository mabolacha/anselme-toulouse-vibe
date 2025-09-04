import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    venue: '',
    guest_count: '',
    duration_hours: '',
    special_requests: '',
    budget_range: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      event_type: '',
      event_date: '',
      venue: '',
      guest_count: '',
      duration_hours: '',
      special_requests: '',
      budget_range: '',
      message: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          event_type: formData.event_type,
          event_date: formData.event_date || null,
          venue: formData.venue || null,
          guest_count: formData.guest_count ? parseInt(formData.guest_count) : null,
          duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
          special_requests: formData.special_requests || null,
          budget_range: formData.budget_range || null,
          message: formData.message || null
        }]);

      if (error) throw error;

      toast({
        title: "Demande de devis envoyée !",
        description: "Votre demande de devis a été envoyée. Nous vous enverrons une proposition détaillée sous 48h.",
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-gold/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-montserrat text-gold flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            DEMANDER UN DEVIS
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="event_type" className="text-foreground font-montserrat">Type d'événement *</Label>
              <Select onValueChange={(value) => handleSelectChange('event_type', value)} required>
                <SelectTrigger className="bg-background/50 border-gold/30 focus:border-gold">
                  <SelectValue placeholder="Sélectionnez votre événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mariage">Mariage</SelectItem>
                  <SelectItem value="anniversaire">Anniversaire</SelectItem>
                  <SelectItem value="soiree-privee">Soirée privée</SelectItem>
                  <SelectItem value="corporate">Événement corporate</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date" className="text-foreground font-montserrat">Date de l'événement</Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="bg-background/50 border-gold/30 focus:border-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-foreground font-montserrat">Lieu de l'événement</Label>
              <Input
                id="venue"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleInputChange}
                className="bg-background/50 border-gold/30 focus:border-gold"
                placeholder="Nom du lieu ou ville"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guest_count" className="text-foreground font-montserrat">Nombre d'invités</Label>
              <Input
                id="guest_count"
                name="guest_count"
                type="number"
                value={formData.guest_count}
                onChange={handleInputChange}
                className="bg-background/50 border-gold/30 focus:border-gold"
                placeholder="Ex: 150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_hours" className="text-foreground font-montserrat">Durée souhaitée (heures)</Label>
              <Select onValueChange={(value) => handleSelectChange('duration_hours', value)}>
                <SelectTrigger className="bg-background/50 border-gold/30 focus:border-gold">
                  <SelectValue placeholder="Sélectionnez la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 heures</SelectItem>
                  <SelectItem value="4">4 heures</SelectItem>
                  <SelectItem value="5">5 heures</SelectItem>
                  <SelectItem value="6">6 heures</SelectItem>
                  <SelectItem value="7">7 heures</SelectItem>
                  <SelectItem value="8">8 heures ou plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_range" className="text-foreground font-montserrat">Budget approximatif</Label>
            <Select onValueChange={(value) => handleSelectChange('budget_range', value)}>
              <SelectTrigger className="bg-background/50 border-gold/30 focus:border-gold">
                <SelectValue placeholder="Sélectionnez votre budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500-800">500€ - 800€</SelectItem>
                <SelectItem value="800-1200">800€ - 1200€</SelectItem>
                <SelectItem value="1200-2000">1200€ - 2000€</SelectItem>
                <SelectItem value="2000+">Plus de 2000€</SelectItem>
                <SelectItem value="a-discuter">À discuter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests" className="text-foreground font-montserrat">Demandes spéciales</Label>
            <Textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              className="bg-background/50 border-gold/30 focus:border-gold min-h-[100px]"
              placeholder="Équipements spécifiques, styles musicaux, éclairage, effets spéciaux..."
            />
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
              placeholder="Décrivez votre projet, l'ambiance souhaitée, vos attentes..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gold/50 text-gold hover:bg-gold hover:text-deep-black font-montserrat"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-gold text-deep-black font-montserrat font-bold hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Envoi...' : 'DEMANDER UN DEVIS'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;