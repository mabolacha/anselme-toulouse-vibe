import { z } from 'zod';

// ==================== BOOKING SCHEMA ====================
export const bookingSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Le nom est requis" })
    .max(100, { message: "Le nom est trop long (max 100 caractères)" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom contient des caractères invalides" }),
  
  email: z.string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "Email trop long" })
    .toLowerCase(),
  
  phone: z.string()
    .trim()
    .max(20, { message: "Numéro trop long" })
    .regex(/^[0-9+\s\-().]*$/, { message: "Format de téléphone invalide" })
    .optional()
    .or(z.literal('')),
  
  event_type: z.enum(['mariage', 'anniversaire', 'soiree-privee', 'corporate', 'festival', 'autre'], {
    errorMap: () => ({ message: "Type d'événement invalide" })
  }),
  
  event_date: z.string()
    .optional()
    .or(z.literal('')),
  
  guest_count: z.string()
    .regex(/^\d*$/, { message: "Nombre d'invités invalide" })
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? '' : val)
    .refine(val => val === '' || (parseInt(val) >= 0 && parseInt(val) <= 10000), {
      message: "Nombre d'invités doit être entre 0 et 10000"
    }),
  
  venue: z.string()
    .trim()
    .max(200, { message: "Lieu trop long (max 200 caractères)" })
    .optional()
    .or(z.literal('')),
  
  budget_range: z.string()
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .trim()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" })
    .max(2000, { message: "Message trop long (max 2000 caractères)" })
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ==================== QUOTE SCHEMA ====================
export const quoteSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Le nom est requis" })
    .max(100, { message: "Le nom est trop long (max 100 caractères)" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom contient des caractères invalides" }),
  
  email: z.string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "Email trop long" })
    .toLowerCase(),
  
  phone: z.string()
    .trim()
    .max(20, { message: "Numéro trop long" })
    .regex(/^[0-9+\s\-().]*$/, { message: "Format de téléphone invalide" })
    .optional()
    .or(z.literal('')),
  
  event_type: z.enum(['mariage', 'anniversaire', 'soiree-privee', 'corporate', 'festival', 'autre'], {
    errorMap: () => ({ message: "Type d'événement invalide" })
  }),
  
  event_date: z.string()
    .optional()
    .or(z.literal('')),
  
  venue: z.string()
    .trim()
    .max(200, { message: "Lieu trop long (max 200 caractères)" })
    .optional()
    .or(z.literal('')),
  
  guest_count: z.string()
    .regex(/^\d*$/, { message: "Nombre d'invités invalide" })
    .optional()
    .or(z.literal(''))
    .refine(val => val === '' || (parseInt(val) >= 0 && parseInt(val) <= 10000), {
      message: "Nombre d'invités doit être entre 0 et 10000"
    }),
  
  duration_hours: z.string()
    .optional()
    .or(z.literal('')),
  
  special_requests: z.string()
    .trim()
    .max(1000, { message: "Demandes spéciales trop longues (max 1000 caractères)" })
    .optional()
    .or(z.literal('')),
  
  budget_range: z.string()
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .trim()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" })
    .max(2000, { message: "Message trop long (max 2000 caractères)" })
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

// ==================== AUDIO UPLOAD SCHEMA ====================
export const audioUploadSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Le titre est requis" })
    .max(200, { message: "Titre trop long (max 200 caractères)" }),
  
  description: z.string()
    .trim()
    .max(2000, { message: "Description trop longue (max 2000 caractères)" })
    .optional()
    .or(z.literal('')),
  
  genre: z.string()
    .trim()
    .max(100, { message: "Genre trop long (max 100 caractères)" })
    .optional()
    .or(z.literal('')),
  
  mix_type: z.enum(['original_track', 'mix', 'podcast', 'live_set'], {
    errorMap: () => ({ message: "Type de contenu invalide" })
  }),
  
  release_date: z.string()
    .optional()
    .or(z.literal(''))
});

export type AudioUploadFormData = z.infer<typeof audioUploadSchema>;

// Validation de fichier audio (séparée car non-Zod)
export const validateAudioFile = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "Aucun fichier sélectionné" };
  }
  
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/aac', 'audio/flac', 'audio/x-m4a'];
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Fichier trop volumineux (max 100MB). Taille actuelle: ${(file.size / 1024 / 1024).toFixed(1)}MB` };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé. Formats acceptés: MP3, WAV, OGG, AAC, FLAC, M4A` };
  }
  
  return { valid: true };
};

// ==================== MIX SESSION SCHEMA ====================
export const mixSessionSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Le titre est requis" })
    .max(200, { message: "Titre trop long (max 200 caractères)" }),
  
  description: z.string()
    .trim()
    .max(2000, { message: "Description trop longue (max 2000 caractères)" })
    .optional()
    .or(z.literal('')),
  
  platform: z.enum(['hearthis', 'youtube', 'mixcloud'], {
    errorMap: () => ({ message: "Plateforme invalide" })
  }),
  
  embedUrl: z.string()
    .trim()
    .min(1, { message: "L'URL d'embed est requise" })
    .max(500, { message: "URL trop longue" })
    .url({ message: "URL invalide" })
    .refine(url => url.startsWith('https://'), { 
      message: "L'URL doit commencer par https://" 
    }),
  
  displayOrder: z.number()
    .int({ message: "L'ordre doit être un nombre entier" })
    .min(0, { message: "L'ordre doit être positif" })
    .max(999, { message: "Ordre trop élevé (max 999)" }),
  
  isActive: z.boolean()
});

export type MixSessionFormData = z.infer<typeof mixSessionSchema>;

// ==================== AUTH SCHEMA ====================
export const signInSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "Email trop long" })
    .toLowerCase(),
  
  password: z.string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    .max(100, { message: "Mot de passe trop long" })
});

export const signUpSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "Email trop long" })
    .toLowerCase(),
  
  password: z.string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    .max(100, { message: "Mot de passe trop long" })
    .regex(/[A-Za-z]/, { message: "Le mot de passe doit contenir au moins une lettre" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
  
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
