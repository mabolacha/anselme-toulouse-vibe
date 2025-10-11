# Guide de déploiement sur Hostinger

## Configuration GitHub Actions

Le projet est configuré pour builder automatiquement via GitHub Actions à chaque push.

### Étapes de déploiement :

1. **Connecter à GitHub** (si pas déjà fait)
   - Cliquer sur le bouton GitHub dans Lovable
   - Autoriser et créer le repository

2. **Après chaque modification dans Lovable** :
   - Les changements se synchronisent automatiquement sur GitHub
   - GitHub Actions démarre un build automatique
   - Attendez 2-3 minutes que le build se termine

3. **Télécharger le package de build** :
   - Allez sur GitHub : `https://github.com/VOTRE-USERNAME/VOTRE-REPO/actions`
   - Cliquez sur le dernier workflow réussi (coche verte ✓)
   - Descendez à la section "Artifacts"
   - Téléchargez `dist-package.zip`

4. **Déployer sur Hostinger** :
   - Connectez-vous à hPanel Hostinger
   - Allez dans "Gestionnaire de fichiers"
   - Naviguez vers `public_html/`
   - **Supprimez tout le contenu actuel** de `public_html/`
   - Uploadez le fichier `dist-package.zip`
   - Extrayez le contenu directement dans `public_html/`
   - Le fichier `.htaccess` doit être présent (il est déjà dans le package)

5. **Configurer SSL (première fois seulement)** :
   - Dans hPanel, allez dans "SSL"
   - Activez le certificat SSL gratuit pour votre domaine

6. **Vérifier le déploiement** :
   - Visitez votre domaine
   - Testez la navigation entre les pages
   - Vérifiez que HTTPS fonctionne

## Structure du déploiement

```
public_html/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   └── images/
├── .htaccess (important pour le routing React)
└── autres fichiers...
```

## Notes importantes

- ✅ Le fichier `.htaccess` gère automatiquement :
  - Le routing React (SPA)
  - La redirection HTTPS
  - La compression GZIP
  - Le cache des fichiers statiques

- ✅ Votre base de données Supabase reste hébergée sur Supabase
- ✅ Seuls les fichiers frontend sont sur Hostinger
- ✅ Pas besoin de Node.js sur le serveur

## Mises à jour futures

Pour déployer une nouvelle version :
1. Faites vos modifications dans Lovable
2. Attendez le build GitHub Actions
3. Téléchargez le nouveau `dist-package.zip`
4. Remplacez les fichiers dans `public_html/`

## Dépannage

**Le site affiche une page blanche** :
- Vérifiez que le fichier `.htaccess` est présent
- Vérifiez que tous les fichiers sont extraits directement dans `public_html/` (pas dans un sous-dossier)

**Erreur 404 sur les routes** :
- Assurez-vous que `.htaccess` est bien présent et non corrompu

**Le site ne force pas HTTPS** :
- Vérifiez que SSL est activé dans hPanel
- Vérifiez que `.htaccess` contient les règles de redirection HTTPS
