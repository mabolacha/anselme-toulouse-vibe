import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Music } from 'lucide-react';
import { signInSchema, signUpSchema } from '@/lib/validation';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validation Zod
      const validatedData = signInSchema.parse({
        email: formData.email,
        password: formData.password
      });

      setLoading(true);
      const { error } = await signIn(validatedData.email, validatedData.password);
      
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message === 'Invalid login credentials' 
            ? "Email ou mot de passe incorrect" 
            : error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
      }
    } catch (error) {
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
          description: Object.values(errors)[0],
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validation Zod (inclut la vérification password === confirmPassword)
      const validatedData = signUpSchema.parse(formData);

      setLoading(true);
      const { error } = await signUp(validatedData.email, validatedData.password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Compte existant",
            description: "Un compte avec cet email existe déjà",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur d'inscription",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
      }
    } catch (error) {
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
          description: Object.values(errors)[0],
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-8 w-8 text-gold" />
            <h1 className="text-3xl font-black font-montserrat text-gradient">
              DJ ANSELME
            </h1>
          </div>
          <p className="text-muted-foreground font-montserrat">
            Accès administrateur
          </p>
        </div>

        <Card className="p-6 bg-card/80 backdrop-blur-sm border-gold/20">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className={cn(validationErrors.email && "border-destructive")}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={cn(validationErrors.password && "border-destructive")}
                    required
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.password}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-deep-black border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className={cn(validationErrors.email && "border-destructive")}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={cn(validationErrors.password && "border-destructive")}
                    required
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={cn(validationErrors.confirmPassword && "border-destructive")}
                    required
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-gold hover:bg-gold-muted text-deep-black font-montserrat font-bold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-deep-black border-t-transparent rounded-full animate-spin" />
                      Inscription...
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground font-montserrat">
            Première connexion ? Contactez l'administrateur pour obtenir les droits d'accès.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;