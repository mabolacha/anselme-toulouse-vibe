import { useState } from 'react';
import { useGalleryPhotos, GalleryPhoto } from '@/hooks/useGalleryPhotos';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const AdminGallery = () => {
  const { photos, loading, refetch } = useGalleryPhotos(false);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_type: '',
    location: '',
    featured: false,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-photos')
          .getPublicUrl(filePath);

        // Insert into database
        const { error: insertError } = await supabase
          .from('gallery_photos')
          .insert({
            image_url: publicUrl,
            title: formData.title || file.name,
            event_date: formData.event_date || null,
            event_type: formData.event_type || null,
            location: formData.location || null,
            featured: formData.featured,
          });

        if (insertError) throw insertError;
      }

      toast({
        title: 'Succès',
        description: `${files.length} photo(s) ajoutée(s) avec succès`,
      });

      // Reset form
      setFormData({
        title: '',
        event_date: '',
        event_type: '',
        location: '',
        featured: false,
      });
      e.target.value = '';
      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    try {
      // Extract filename from URL
      const urlParts = photo.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('event-photos')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      toast({
        title: 'Succès',
        description: 'Photo supprimée avec succès',
      });
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (photo: GalleryPhoto) => {
    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update({ featured: !photo.featured })
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: photo.featured ? 'Photo retirée de la une' : 'Photo mise en avant',
      });
      refetch();
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter des photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Soirée entreprise..."
              />
            </div>
            <div>
              <Label htmlFor="event_date">Date de l'événement</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="event_type">Type d'événement</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                placeholder="Mariage, Anniversaire..."
              />
            </div>
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Toulouse..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Mettre en avant sur la page d'accueil
            </Label>
          </div>
          <div>
            <Label htmlFor="photos">Photos (plusieurs fichiers acceptés)</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Upload en cours...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Galerie ({photos.length} photos)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : photos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune photo pour le moment
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-3">
                    <div>
                      <h4 className="text-white font-semibold text-sm truncate">
                        {photo.title}
                      </h4>
                      {photo.event_type && (
                        <p className="text-white/80 text-xs">{photo.event_type}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={photo.featured ? "default" : "secondary"}
                        onClick={() => toggleFeatured(photo)}
                        className="flex-1"
                      >
                        <Star className={`h-4 w-4 ${photo.featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(photo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGallery;