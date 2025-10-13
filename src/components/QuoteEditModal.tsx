import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Calculator } from "lucide-react";

interface ExtraOption {
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
}

interface Quote {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  venue?: string;
  guest_count?: number;
  duration_hours?: number;
  budget_range?: string;
  message?: string;
  special_requests?: string;
  equipment_included?: boolean;
  base_package_with_equipment?: number;
  base_package_without_equipment?: number;
  venue_distance_km?: number;
  travel_fees?: number;
  dj_animation_included?: boolean;
  technical_installation_included?: boolean;
  custom_playlist_included?: boolean;
  extra_options?: ExtraOption[];
  deposit_percentage?: number;
  payment_terms?: string;
  quote_notes?: string;
  quote_amount?: number;
}

interface QuoteEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
  onQuoteUpdated: () => void;
}

const DEFAULT_PAYMENT_TERMS = `Acompte de 30% à la réservation (non remboursable).
Solde à régler le jour de l'événement en espèces ou virement bancaire.
Chèque d'acompte à l'ordre de DJ Anselme.`;

const PRESET_OPTIONS = [
  { name: "Photobooth", price: 250 },
  { name: "Machine à fumée", price: 80 },
  { name: "Heure supplémentaire", price: 150 },
  { name: "Éclairage décoratif supplémentaire", price: 120 },
];

export function QuoteEditModal({ open, onOpenChange, quote, onQuoteUpdated }: QuoteEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentIncluded, setEquipmentIncluded] = useState(false);
  const [basePriceWithEquipment, setBasePriceWithEquipment] = useState<number>(800);
  const [basePriceWithoutEquipment, setBasePriceWithoutEquipment] = useState<number>(500);
  const [venueDistance, setVenueDistance] = useState<number>(0);
  const [djAnimationIncluded, setDjAnimationIncluded] = useState(true);
  const [technicalInstallationIncluded, setTechnicalInstallationIncluded] = useState(true);
  const [customPlaylistIncluded, setCustomPlaylistIncluded] = useState(false);
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [depositPercentage, setDepositPercentage] = useState<number>(30);
  const [paymentTerms, setPaymentTerms] = useState(DEFAULT_PAYMENT_TERMS);
  const [quoteNotes, setQuoteNotes] = useState("");

  // Initialize form with quote data
  useEffect(() => {
    if (quote) {
      setEquipmentIncluded(quote.equipment_included ?? false);
      setBasePriceWithEquipment(quote.base_package_with_equipment ?? 800);
      setBasePriceWithoutEquipment(quote.base_package_without_equipment ?? 500);
      setVenueDistance(quote.venue_distance_km ?? 0);
      setDjAnimationIncluded(quote.dj_animation_included ?? true);
      setTechnicalInstallationIncluded(quote.technical_installation_included ?? true);
      setCustomPlaylistIncluded(quote.custom_playlist_included ?? false);
      setExtraOptions(quote.extra_options ?? []);
      setDepositPercentage(quote.deposit_percentage ?? 30);
      setPaymentTerms(quote.payment_terms ?? DEFAULT_PAYMENT_TERMS);
      setQuoteNotes(quote.quote_notes ?? "");
    }
  }, [quote]);

  // Calculate travel fees: free up to 20km, then 0.5€/km
  const calculateTravelFees = (distance: number): number => {
    if (distance <= 20) return 0;
    return (distance - 20) * 0.5;
  };

  const travelFees = calculateTravelFees(venueDistance);

  // Calculate base package price
  const basePackagePrice = equipmentIncluded ? basePriceWithEquipment : basePriceWithoutEquipment;

  // Calculate extra options total
  const extraOptionsTotal = extraOptions
    .filter(opt => opt.selected)
    .reduce((sum, opt) => sum + (opt.price * opt.quantity), 0);

  // Calculate total
  const totalAmount = basePackagePrice + travelFees + extraOptionsTotal;

  // Calculate deposit and balance
  const depositAmount = (totalAmount * depositPercentage) / 100;
  const balanceAmount = totalAmount - depositAmount;

  const handleAddOption = (presetOption?: { name: string; price: number }) => {
    const newOption: ExtraOption = presetOption
      ? { ...presetOption, selected: true, quantity: 1 }
      : { name: "", price: 0, selected: true, quantity: 1 };
    setExtraOptions([...extraOptions, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    setExtraOptions(extraOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: keyof ExtraOption, value: any) => {
    const updated = [...extraOptions];
    updated[index] = { ...updated[index], [field]: value };
    setExtraOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          equipment_included: equipmentIncluded,
          base_package_with_equipment: basePriceWithEquipment,
          base_package_without_equipment: basePriceWithoutEquipment,
          venue_distance_km: venueDistance,
          travel_fees: travelFees,
          dj_animation_included: djAnimationIncluded,
          technical_installation_included: technicalInstallationIncluded,
          custom_playlist_included: customPlaylistIncluded,
          extra_options: JSON.parse(JSON.stringify(extraOptions)),
          deposit_percentage: depositPercentage,
          deposit_amount: depositAmount,
          balance_amount: balanceAmount,
          payment_terms: paymentTerms,
          quote_notes: quoteNotes,
          quote_amount: totalAmount,
          quote_generated_at: new Date().toISOString(),
        })
        .eq("id", quote.id);

      if (error) throw error;

      toast({
        title: "Devis enregistré",
        description: `Le devis de ${totalAmount.toFixed(2)}€ a été enregistré avec succès.`,
      });

      onQuoteUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving quote:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du devis.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-2xl">
            Modifier le devis - {quote.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information (Read-only) */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h3 className="font-montserrat font-semibold text-lg mb-3">Informations client</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Email:</span> {quote.email}
              </div>
              <div>
                <span className="font-semibold">Téléphone:</span> {quote.phone || "Non renseigné"}
              </div>
              <div>
                <span className="font-semibold">Type d'événement:</span> {quote.event_type}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {quote.event_date ? new Date(quote.event_date).toLocaleDateString("fr-FR") : "Non renseignée"}
              </div>
              <div>
                <span className="font-semibold">Lieu:</span> {quote.venue || "Non renseigné"}
              </div>
              <div>
                <span className="font-semibold">Invités:</span> {quote.guest_count || "Non renseigné"}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Budget indicatif:</span> {quote.budget_range || "Non renseigné"}
              </div>
              {quote.special_requests && (
                <div className="col-span-2">
                  <span className="font-semibold">Demandes spéciales:</span> {quote.special_requests}
                </div>
              )}
            </div>
          </div>

          {/* Package Configuration */}
          <div className="space-y-4">
            <h3 className="font-montserrat font-semibold text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Configuration du forfait
            </h3>
            
            <div className="space-y-3">
              <Label className="font-montserrat">Type de forfait (4 heures)</Label>
              <RadioGroup
                value={equipmentIncluded ? "with" : "without"}
                onValueChange={(value) => setEquipmentIncluded(value === "with")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="with" id="with-equipment" />
                  <Label htmlFor="with-equipment" className="font-normal cursor-pointer">
                    Avec matériel (son/lumières/micros)
                  </Label>
                  <Input
                    type="number"
                    value={basePriceWithEquipment}
                    onChange={(e) => setBasePriceWithEquipment(Number(e.target.value))}
                    className="w-24 ml-auto"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm">€</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="without" id="without-equipment" />
                  <Label htmlFor="without-equipment" className="font-normal cursor-pointer">
                    Sans matériel
                  </Label>
                  <Input
                    type="number"
                    value={basePriceWithoutEquipment}
                    onChange={(e) => setBasePriceWithoutEquipment(Number(e.target.value))}
                    className="w-24 ml-auto"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm">€</span>
                </div>
              </RadioGroup>
            </div>

            {/* Travel Fees */}
            <div className="space-y-2">
              <Label htmlFor="distance" className="font-montserrat">
                Distance depuis le studio (km)
              </Label>
              <Input
                id="distance"
                type="number"
                value={venueDistance}
                onChange={(e) => setVenueDistance(Number(e.target.value))}
                min="0"
                step="0.1"
              />
              <p className="text-sm text-muted-foreground">
                {travelFees === 0 
                  ? "✓ Frais de déplacement offerts (≤ 20 km)" 
                  : `Frais de déplacement: ${travelFees.toFixed(2)}€ (${(venueDistance - 20).toFixed(1)} km × 0,5€/km)`}
              </p>
            </div>
          </div>

          {/* Included Services */}
          <div className="space-y-3">
            <h3 className="font-montserrat font-semibold text-lg">Prestations incluses</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dj-animation"
                  checked={djAnimationIncluded}
                  onCheckedChange={(checked) => setDjAnimationIncluded(checked as boolean)}
                />
                <Label htmlFor="dj-animation" className="font-normal cursor-pointer">
                  DJ animation / playlist adaptée
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technical"
                  checked={technicalInstallationIncluded}
                  onCheckedChange={(checked) => setTechnicalInstallationIncluded(checked as boolean)}
                />
                <Label htmlFor="technical" className="font-normal cursor-pointer">
                  Installation technique et régie lumière
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="playlist"
                  checked={customPlaylistIncluded}
                  onCheckedChange={(checked) => setCustomPlaylistIncluded(checked as boolean)}
                />
                <Label htmlFor="playlist" className="font-normal cursor-pointer">
                  Playlist personnalisée sur demande
                </Label>
              </div>
            </div>
          </div>

          {/* Extra Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-semibold text-lg">Options supplémentaires</h3>
              <div className="flex gap-2">
                {PRESET_OPTIONS.map((preset) => (
                  <Button
                    key={preset.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(preset)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {extraOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
                <Checkbox
                  checked={option.selected}
                  onCheckedChange={(checked) => handleOptionChange(index, "selected", checked)}
                />
                <Input
                  placeholder="Nom de l'option"
                  value={option.name}
                  onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Prix"
                  value={option.price}
                  onChange={(e) => handleOptionChange(index, "price", Number(e.target.value))}
                  className="w-24"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm">€ ×</span>
                <Input
                  type="number"
                  value={option.quantity}
                  onChange={(e) => handleOptionChange(index, "quantity", Math.max(1, Number(e.target.value)))}
                  className="w-16"
                  min="1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddOption()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une option personnalisée
            </Button>
          </div>

          {/* Price Summary */}
          <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-lg space-y-2">
            <h3 className="font-montserrat font-semibold text-lg mb-3">Récapitulatif</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Forfait de base ({equipmentIncluded ? "avec" : "sans"} matériel):</span>
                <span className="font-semibold">{basePackagePrice.toFixed(2)}€</span>
              </div>
              {extraOptionsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Options supplémentaires:</span>
                  <span className="font-semibold">{extraOptionsTotal.toFixed(2)}€</span>
                </div>
              )}
              {travelFees > 0 && (
                <div className="flex justify-between">
                  <span>Frais de déplacement:</span>
                  <span className="font-semibold">{travelFees.toFixed(2)}€</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL:</span>
                  <span className="text-primary">{totalAmount.toFixed(2)}€</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span>Acompte ({depositPercentage}%):</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={depositPercentage}
                    onChange={(e) => setDepositPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-16 h-8 text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm">%</span>
                  <span className="font-semibold ml-2">{depositAmount.toFixed(2)}€</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Solde à régler le jour J:</span>
                <span className="font-semibold">{balanceAmount.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor="payment-terms" className="font-montserrat">
              Modalités de paiement
            </Label>
            <Textarea
              id="payment-terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              rows={4}
            />
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <Label htmlFor="quote-notes" className="font-montserrat">
              Notes internes (non visible dans le devis final)
            </Label>
            <Textarea
              id="quote-notes"
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
              placeholder="Notes privées pour votre gestion..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer le devis
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
