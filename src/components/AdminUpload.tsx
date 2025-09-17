import React, { useState } from 'react';
import { Upload, FileAudio, Trash2, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAudioContent } from '@/hooks/useAudioContent';

interface AudioFileData {
  title: string;
  description: string;
  genre: string;
  mix_type: string;
  release_date: string;
}

const AdminUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<AudioFileData>({
    title: '',
    description: '',
    genre: '',
    mix_type: 'original_track',
    release_date: new Date().toISOString().split('T')[0]
  });
  
  const { toast } = useToast();
  const { audioContent, refetch } = useAudioContent();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier audio valide",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create file path with folder structure
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${formData.mix_type}s/${Date.now()}-${formData.title.replace(/[^a-zA-Z0-9]/g, '-')}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('audio-content')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get audio duration (if possible)
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(selectedFile);
      audio.src = audioUrl;
      
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration));
        });
        audio.addEventListener('error', () => {
          resolve(0);
        });
      });

      // Insert metadata into database
      const { error: dbError } = await supabase
        .from('audio_content')
        .insert({
          title: formData.title,
          description: formData.description || null,
          file_path: fileName,
          file_size: selectedFile.size,
          duration_seconds: duration,
          genre: formData.genre || null,
          mix_type: formData.mix_type,
          release_date: formData.release_date || null,
          play_count: 0,
          featured: false
        });

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Fichier uploadé avec succès !",
      });

      // Reset form
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
        genre: '',
        mix_type: 'original_track',
        release_date: new Date().toISOString().split('T')[0]
      });
      
      // Refresh audio content list
      refetch();

      // Clean up
      URL.revokeObjectURL(audioUrl);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('audio-content')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_content')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      });

      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black font-montserrat text-gradient mb-4">
            GESTION DES CONTENUS AUDIO
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Uploadez et gérez vos tracks, mixes et podcasts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-gold/20">
            <h2 className="text-2xl font-bold font-montserrat text-gold mb-6">
              Nouveau fichier audio
            </h2>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Fichier audio *
                </Label>
                <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                  <input
                    id="file-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    {selectedFile ? (
                      <>
                        <FileAudio className="h-8 w-8 text-gold" />
                        <span className="text-sm text-gold font-montserrat">
                          {selectedFile.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-montserrat">
                          Cliquez pour sélectionner un fichier audio
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nom de votre track"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de votre création..."
                  rows={3}
                />
              </div>

              {/* Genre */}
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  placeholder="House, Techno, Deep House..."
                />
              </div>

              {/* Mix Type */}
              <div>
                <Label>Type de contenu *</Label>
                <Select
                  value={formData.mix_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, mix_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original_track">Track Original</SelectItem>
                    <SelectItem value="mix">Mix/Remix</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="live_set">Live Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Release Date */}
              <div>
                <Label htmlFor="release_date">Date de sortie</Label>
                <Input
                  id="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full bg-gradient-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
              >
                {uploading ? 'Upload en cours...' : 'Uploader le fichier'}
              </Button>
            </div>
          </Card>

          {/* File List */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-gold/20">
            <h2 className="text-2xl font-bold font-montserrat text-gold mb-6">
              Fichiers existants
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {audioContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-warm-black/30 rounded-lg border border-gold/10"
                >
                  <div className="flex items-center space-x-3">
                    <Music className="h-5 w-5 text-gold" />
                    <div>
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.genre} • {item.mix_type}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.file_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;