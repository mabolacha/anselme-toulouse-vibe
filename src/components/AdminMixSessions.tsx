import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useMixSessions } from '@/hooks/useMixSessions';
import { parseEmbedUrl, isValidEmbedUrl } from '@/utils/embedUrlParser';
import MixPlayerEmbed from '@/components/MixPlayerEmbed';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Save, X } from 'lucide-react';
import { mixSessionSchema } from '@/lib/validation';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface MixSessionForm {
  title: string;
  description: string;
  platform: 'hearthis' | 'youtube' | 'mixcloud';
  embedUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const AdminMixSessions = () => {
  const { mixSessions, loading, createMixSession, updateMixSession, deleteMixSession, refetch } = useMixSessions();
  const { toast } = useToast();
  
  // Fetch all sessions including inactive ones for admin
  React.useEffect(() => {
    refetch(true);
  }, []);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<MixSessionForm>({
    title: '',
    description: '',
    platform: 'hearthis',
    embedUrl: '',
    displayOrder: 0,
    isActive: true
  });

  const [rawInput, setRawInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle raw input change and parse embed URL
  const handleRawInputChange = (value: string) => {
    setRawInput(value);
    
    if (!value.trim()) {
      setPreviewUrl(null);
      setForm(prev => ({ ...prev, embedUrl: '' }));
      return;
    }

    const parsed = parseEmbedUrl(value, form.platform);
    
    if (parsed && isValidEmbedUrl(parsed, form.platform)) {
      setPreviewUrl(parsed);
      setForm(prev => ({ ...prev, embedUrl: parsed }));
    } else {
      setPreviewUrl(null);
      setForm(prev => ({ ...prev, embedUrl: '' }));
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      platform: 'hearthis',
      embedUrl: '',
      displayOrder: mixSessions.length,
      isActive: true
    });
    setRawInput('');
    setPreviewUrl(null);
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Open form for editing
  const handleEdit = (id: string) => {
    const session = mixSessions.find(s => s.id === id);
    if (!session) return;

    setForm({
      title: session.title,
      description: session.description || '',
      platform: session.platform as 'hearthis' | 'youtube' | 'mixcloud',
      embedUrl: session.embed_url,
      displayOrder: session.display_order,
      isActive: session.is_active
    });
    setRawInput(session.embed_url);
    setPreviewUrl(session.embed_url);
    setEditingId(id);
    setIsFormOpen(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    if (!form.embedUrl || !isValidEmbedUrl(form.embedUrl, form.platform)) {
      toast({
        title: "Erreur",
        description: "L'URL d'embed n'est pas valide pour cette plateforme",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Validation Zod
      const validatedData = mixSessionSchema.parse({
        title: form.title,
        description: form.description,
        platform: form.platform,
        embedUrl: form.embedUrl,
        displayOrder: form.displayOrder,
        isActive: form.isActive
      });

      if (editingId) {
        const { error } = await updateMixSession(editingId, {
          title: validatedData.title,
          description: validatedData.description || null,
          platform: validatedData.platform,
          embed_url: validatedData.embedUrl,
          display_order: validatedData.displayOrder,
          is_active: validatedData.isActive
        });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Mix session mise à jour avec succès"
        });
      } else {
        const { error } = await createMixSession({
          title: validatedData.title,
          description: validatedData.description || null,
          platform: validatedData.platform,
          embed_url: validatedData.embedUrl,
          display_order: validatedData.displayOrder,
          is_active: validatedData.isActive
        });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Mix session créée avec succès"
        });
      }

      resetForm();
      refetch(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
        toast({
          title: "Erreur de validation",
          description: "Veuillez vérifier les champs du formulaire",
          variant: "destructive",
        });
      } else {
        if (import.meta.env.DEV) {
          console.error('Error message:', error.message);
        }
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete session
  const handleDelete = async (id: string) => {
    setSubmitting(true);
    try {
      const { error } = await deleteMixSession(id);
      if (error) throw error;

      toast({
        title: "Succès",
        description: "Mix session supprimée"
      });
      
      refetch(true);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await updateMixSession(id, { is_active: !currentStatus });
      if (error) throw error;

      toast({
        title: "Succès",
        description: currentStatus ? "Mix session désactivée" : "Mix session activée"
      });
      
      refetch(true);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-montserrat text-gold">Gestion des Mix Sessions</h2>
          <p className="text-muted-foreground font-montserrat mt-2">
            Gérez les lecteurs Hearthis, YouTube et Mixcloud affichés sur le site
          </p>
        </div>
        {!isFormOpen && (
          <Button
            onClick={() => {
              setForm(prev => ({ ...prev, displayOrder: mixSessions.length }));
              setIsFormOpen(true);
            }}
            className="bg-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une session
          </Button>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gold font-montserrat">
              {editingId ? 'Modifier la session' : 'Nouvelle session'}
            </CardTitle>
            <CardDescription className="font-montserrat">
              Collez le code iframe ou l'URL de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="font-montserrat">Titre *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Open Format Mix vol 04"
                      className={cn("font-montserrat", validationErrors.title && "border-destructive")}
                      required
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-montserrat">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du mix..."
                      className={cn("font-montserrat min-h-[80px]", validationErrors.description && "border-destructive")}
                    />
                    {validationErrors.description && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="platform" className="font-montserrat">Plateforme *</Label>
                    <Select
                      value={form.platform}
                      onValueChange={(value: 'hearthis' | 'youtube' | 'mixcloud') => {
                        setForm(prev => ({ ...prev, platform: value }));
                        handleRawInputChange(rawInput); // Re-parse with new platform
                      }}
                    >
                      <SelectTrigger className="font-montserrat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hearthis">Hearthis.at</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="mixcloud">Mixcloud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="embedInput" className="font-montserrat">
                      Code iframe ou URL *
                    </Label>
                    <Textarea
                      id="embedInput"
                      value={rawInput}
                      onChange={(e) => handleRawInputChange(e.target.value)}
                      placeholder={`<iframe src="https://app.hearthis.at/embed/..."></iframe>`}
                      className={cn("font-montserrat font-mono text-xs min-h-[120px]", validationErrors.embedUrl && "border-destructive")}
                      required
                    />
                    {validationErrors.embedUrl && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.embedUrl}</p>
                    )}
                    {!validationErrors.embedUrl && previewUrl && (
                      <p className="text-xs text-green-500 font-montserrat mt-1">
                        ✓ URL d'embed valide détectée
                      </p>
                    )}
                    {!validationErrors.embedUrl && rawInput && !previewUrl && (
                      <p className="text-xs text-destructive font-montserrat mt-1">
                        ✗ URL invalide ou format non reconnu
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label htmlFor="displayOrder" className="font-montserrat">Ordre d'affichage</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        value={form.displayOrder}
                        onChange={(e) => setForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                        className="font-montserrat"
                        min={0}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="isActive" className="font-montserrat">Active</Label>
                      <Switch
                        id="isActive"
                        checked={form.isActive}
                        onCheckedChange={(checked) => setForm(prev => ({ ...prev, isActive: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div>
                  <Label className="font-montserrat mb-2 block">Aperçu</Label>
                  <div className="border border-gold/20 rounded-lg p-4 bg-background/50">
                    {previewUrl ? (
                      <MixPlayerEmbed
                        platform={form.platform}
                        embedUrl={previewUrl}
                        title={form.title || 'Aperçu'}
                      />
                    ) : (
                      <div className="aspect-video flex items-center justify-center text-muted-foreground font-montserrat">
                        Aucun aperçu disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gold/20">
                <Button
                  type="submit"
                  disabled={submitting || !previewUrl}
                  className="bg-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                  className="font-montserrat"
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-montserrat text-foreground">
          Sessions existantes ({mixSessions.length})
        </h3>
        
        {mixSessions.length === 0 ? (
          <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground font-montserrat">
                Aucune mix session pour le moment. Créez-en une pour commencer !
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {mixSessions.map((session) => (
              <Card
                key={session.id}
                className="border-gold/20 bg-card/80 backdrop-blur-sm hover:border-gold transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview */}
                    <div className="md:w-1/2">
                      <MixPlayerEmbed
                        platform={session.platform as 'hearthis' | 'youtube' | 'mixcloud'}
                        embedUrl={session.embed_url}
                        title={session.title}
                      />
                    </div>

                    {/* Info & Actions */}
                    <div className="md:w-1/2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-bold font-montserrat text-gold">
                            {session.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {session.is_active ? (
                              <span className="flex items-center gap-1 text-xs text-green-500 font-montserrat">
                                <Eye className="h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground font-montserrat">
                                <EyeOff className="h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {session.description && (
                          <p className="text-sm text-muted-foreground font-montserrat mb-3">
                            {session.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-montserrat">
                          <span className="capitalize">{session.platform}</span>
                          <span>Ordre: {session.display_order}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(session.id)}
                          className="font-montserrat"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(session.id, session.is_active)}
                          className="font-montserrat"
                        >
                          {session.is_active ? (
                            <><EyeOff className="h-3 w-3 mr-1" /> Désactiver</>
                          ) : (
                            <><Eye className="h-3 w-3 mr-1" /> Activer</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(session.id)}
                          className="font-montserrat"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-montserrat">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="font-montserrat">
              Êtes-vous sûr de vouloir supprimer cette mix session ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-montserrat">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive hover:bg-destructive/90 font-montserrat"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMixSessions;
