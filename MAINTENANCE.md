# Guide de Maintenance - Site DJ Anselme

## 📋 Vue d'ensemble du site

Site web professionnel pour DJ Anselme avec :
- Présentation et portfolio
- Lecteur audio pour mix (Hearthis, YouTube, Mixcloud)
- Système de réservation et demandes de devis
- Interface d'administration sécurisée
- Upload et gestion de contenu audio

---

## 🏗️ Architecture du Site

### Frontend (Hébergé sur Hostinger)
```
public_html/
├── index.html              # Point d'entrée de l'application
├── assets/                 # Fichiers compilés (JS, CSS, images)
├── .htaccess              # Configuration Apache (routing, HTTPS, cache)
├── robots.txt             # Configuration SEO pour moteurs de recherche
├── sitemap.xml            # Plan du site pour référencement
└── lovable-uploads/       # Images uploadées
```

### Backend (Supabase Cloud)
- **Base de données PostgreSQL** : Données (bookings, quotes, mix sessions, audio content)
- **Storage** : Fichiers audio uploadés
- **Authentication** : Gestion des utilisateurs et admin
- **Edge Functions** : Logique serveur (notifications email)

---

## 📁 Fichiers de Configuration Importants

### 1. `.env` (Racine du projet)
**Rôle** : Variables d'environnement pour la connexion Supabase
```env
VITE_SUPABASE_PROJECT_ID="mcbdsmtxzyyeitjagmjb"
VITE_SUPABASE_PUBLISHABLE_KEY="[clé publique]"
VITE_SUPABASE_URL="https://mcbdsmtxzyyeitjagmjb.supabase.co"
```
⚠️ **Ne jamais modifier ces valeurs** sauf si vous changez de projet Supabase

### 2. `public/.htaccess`
**Rôle** : Configuration Apache pour Hostinger
- Force HTTPS
- Gère le routing React (SPA)
- Active la compression GZIP
- Configure le cache des fichiers statiques
- Sécurise les fichiers sensibles

⚠️ **Critique** : Sans ce fichier, le site ne fonctionnera pas sur Hostinger

### 3. `supabase/config.toml`
**Rôle** : Configuration du projet Supabase
```toml
project_id = "mcbdsmtxzyyeitjagmjb"

[functions.send-booking-notification]
verify_jwt = false
```

### 4. `src/integrations/supabase/client.ts`
**Rôle** : Configuration du client Supabase pour l'application
- Initialise la connexion à Supabase
- Configure l'authentification
- Utilisé partout dans le code pour accéder aux données

### 5. `tailwind.config.ts`
**Rôle** : Configuration du système de design
- Définit les couleurs, espacements, typographies
- Configure les thèmes (clair/sombre)

### 6. `src/index.css`
**Rôle** : Design system avec tokens CSS
- Variables CSS pour couleurs (mode clair/sombre)
- Tokens sémantiques (--primary, --secondary, etc.)
- Styles globaux

### 7. `vite.config.ts`
**Rôle** : Configuration du bundler Vite
- Définit les alias de chemins (`@/` = `src/`)
- Configure les plugins React
- Paramètres de build

---

## 🗄️ Structure de la Base de Données Supabase

### Tables principales

#### `audio_content`
Contenu audio uploadé par l'admin
- `id`, `title`, `description`
- `file_path` : Chemin dans Supabase Storage
- `genre`, `mix_type`, `duration_seconds`
- `play_count`, `featured`, `release_date`

#### `mix_sessions`
Mix intégrés depuis plateformes externes
- `id`, `title`, `description`
- `platform` : 'youtube', 'hearthis', 'mixcloud'
- `embed_url` : URL d'intégration du lecteur
- `display_order`, `is_active`

#### `bookings`
Demandes de réservation
- `id`, `name`, `email`, `phone`
- `event_type`, `event_date`, `venue`
- `guest_count`, `budget_range`, `message`
- `status` : 'pending', 'confirmed', 'cancelled'

#### `quotes`
Demandes de devis
- Structure similaire à `bookings`
- Inclut `quote_amount`, `duration_hours`

#### `user_roles`
Rôles des utilisateurs
- `user_id` : Référence à auth.users
- `role` : 'admin' ou 'user'

### Storage Buckets

#### `audio-content` (Public)
Fichiers audio uploadés (.mp3, .wav, etc.)

---

## 🔐 Sécurité

### Row Level Security (RLS)
Toutes les tables ont des politiques RLS activées :

**Lecture publique** :
- `audio_content` : Tout le monde peut voir
- `mix_sessions` : Seulement les actifs (`is_active = true`)

**Opérations admin uniquement** :
- Toutes les opérations sur `bookings` et `quotes` (SELECT, INSERT, UPDATE, DELETE)
- Modifications sur `audio_content` et `mix_sessions`
- Gestion des `user_roles`

**Rate Limiting** :
- Fonction `check_booking_rate_limit()` : Max 3 demandes/heure par email
- Fonction `check_quote_rate_limit()` : Max 3 demandes/heure par email

### Secrets Supabase
Stockés dans Supabase (Project Settings → Edge Functions → Secrets) :
- `RESEND_API_KEY` : Pour l'envoi d'emails
- `SUPABASE_SERVICE_ROLE_KEY` : Clé admin pour Edge Functions

---

## 🚀 Workflow de Déploiement

### 1. Développement dans Lovable
- Modifications du code dans l'éditeur Lovable
- Synchronisation automatique vers GitHub

### 2. Build automatique (GitHub Actions)
- À chaque push, GitHub Actions compile le projet
- Génère un fichier `dist-package.zip` téléchargeable
- Workflow défini dans `.github/workflows/build.yml`

### 3. Déploiement sur Hostinger
- Télécharger `dist-package.zip` depuis GitHub Actions
- Se connecter à hPanel Hostinger
- Supprimer le contenu de `public_html/`
- Uploader et extraire le zip dans `public_html/`
- Vérifier que `.htaccess` est présent

📖 **Détails complets** : Voir `DEPLOYMENT.md`

---

## 🛠️ Maintenance Courante

### Accéder à l'interface admin
1. Aller sur `https://votre-domaine.com/auth`
2. Se connecter avec le compte admin
3. Accéder au dashboard admin

### Ajouter un nouveau mix externe
1. Admin → Onglet "Mix Sessions"
2. Cliquer "Ajouter un Mix"
3. Entrer le titre, description, plateforme
4. Coller l'URL d'embed (YouTube, Hearthis, Mixcloud)
5. Définir l'ordre d'affichage

**Format URLs d'embed** :
- YouTube : `https://www.youtube.com/embed/VIDEO_ID`
- Hearthis : `https://app.hearthis.at/embed/TRACK_ID/`
- Mixcloud : `https://www.mixcloud.com/widget/iframe/?feed=URL_ENCODED_FEED`

### Uploader un fichier audio
1. Admin → Onglet "Upload Audio"
2. Remplir les informations (titre, description, genre)
3. Sélectionner le fichier audio
4. Cliquer "Upload"

### Gérer les demandes
- **Bookings** : Voir toutes les réservations, changer le statut
- **Quotes** : Voir les devis, ajouter un montant

### Ajouter un nouvel administrateur
```sql
-- Dans Supabase SQL Editor
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_FROM_AUTH_USERS', 'admin');
```

---

## 🔍 Dépannage

### Le site affiche une page blanche
✅ **Vérifier** :
- `.htaccess` est présent dans `public_html/`
- Les fichiers sont extraits directement dans `public_html/` (pas dans un sous-dossier)
- Le certificat SSL est activé dans hPanel

### Les mix ne se chargent pas
✅ **Vérifier** :
- L'URL d'embed est correcte dans la base de données
- Le mix est marqué `is_active = true`
- La console du navigateur pour les erreurs CORS

### Les fichiers audio ne jouent pas
✅ **Vérifier** :
- Le bucket `audio-content` est public dans Supabase
- Le fichier existe bien dans Supabase Storage
- RLS policy "Anyone can view audio content" est active

### Les emails ne partent pas
✅ **Vérifier** :
- Secret `RESEND_API_KEY` est configuré dans Supabase
- Edge Function `send-booking-notification` est déployée
- Logs de la fonction dans Supabase Dashboard

### Erreur d'authentification admin
✅ **Vérifier** :
- L'utilisateur a bien le rôle 'admin' dans `user_roles`
- RLS policies sont correctes
- La fonction `is_admin()` existe

---

## 📊 Accès aux Logs et Monitoring

### Supabase Dashboard
URL : `https://supabase.com/dashboard/project/mcbdsmtxzyyeitjagmjb`

**Sections importantes** :
- **Database → Tables** : Voir et éditer les données
- **Storage → Buckets** : Gérer les fichiers
- **Auth → Users** : Gérer les utilisateurs
- **Edge Functions → Logs** : Voir les logs des fonctions
- **SQL Editor** : Exécuter des requêtes SQL

### Console du navigateur
- F12 ou Clic droit → Inspecter
- Onglet **Console** : Erreurs JavaScript
- Onglet **Network** : Requêtes API et erreurs de chargement

---

## 📝 Modifications Courantes

### Changer les couleurs du site
Éditer `src/index.css` - Section `:root` :
```css
:root {
  --primary: [nouvelle couleur HSL];
  --secondary: [nouvelle couleur HSL];
  /* etc. */
}
```

### Ajouter une nouvelle section
1. Créer un composant dans `src/components/`
2. Importer et ajouter dans `src/pages/Index.tsx`

### Modifier les textes de la page d'accueil
Éditer les composants dans `src/components/` :
- `HeroSection.tsx` : Section d'en-tête
- `AboutSection.tsx` : À propos
- `MusicSection.tsx` : Section musique
- `EventsSection.tsx` : Événements
- `ContactSection.tsx` : Contact

### Changer le logo ou les images
1. Remplacer dans `src/assets/` ou `public/lovable-uploads/`
2. Mettre à jour les imports dans les composants

---

## 🆘 Support et Ressources

### Documentation Lovable
- [Guide Lovable](https://docs.lovable.dev/)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)

### Documentation Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

### Documentation Hostinger
- [hPanel Guide](https://support.hostinger.com/en/collections/1559819-cpanel)
- [.htaccess Guide](https://support.hostinger.com/en/articles/1583221-how-to-edit-htaccess)

### Technologies utilisées
- **React 18** : Framework frontend
- **TypeScript** : Langage typé
- **Tailwind CSS** : Framework CSS
- **Vite** : Build tool
- **React Router** : Navigation
- **Supabase** : Backend (BaaS)
- **React Query** : Gestion du state serveur

---

## 📞 Contact Technique

Pour toute question technique sur le code ou l'architecture :
- **Éditeur Lovable** : https://lovable.dev/projects/4041f5e9-5397-4de9-9cf9-088a876f94cb
- **Repository GitHub** : [Votre repo GitHub]
- **Projet Supabase** : mcbdsmtxzyyeitjagmjb

---

**Dernière mise à jour** : 2025-01-07
