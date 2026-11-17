# Affiches GEW 2026 — OKAY Students

Site statique pour créer une affiche et un texte de publication à l'occasion de la Semaine mondiale de l'Entrepreneuriat 2026 au Bénin, organisée par OKAY Students.

L'affiche est au format carré (1080 × 1080), prêt pour Facebook, LinkedIn, Instagram et TikTok. Les logos et les textes officiels sont déjà en place : chaque étudiant ajoute sa photo, la cadre, renseigne son nom, sa filière, son année et son université, puis télécharge le visuel. Le texte de publication, proposé en trois versions, reprend les cinq points demandés.

Les photos restent dans le navigateur : rien n'est envoyé sur un serveur.

## Utilisation

1. Entrez vos prénoms, nom, filière, année d'étude et université.
2. Ajoutez votre photo dans l'emplacement au centre, puis zoomez et déplacez-la pour la cadrer.
3. Téléchargez l'affiche en PNG.
4. Copiez le texte de publication et identifiez manuellement, sur chaque plateforme, les comptes officiels (Ministère des Petites et Moyennes Entreprises et de la Promotion de l'Emploi, ADPME, Global Entrepreneurship Network, GEW Benin, Olusegun Charles Vidjannagni).

Deux ou trois publications sont attendues d'ici le lundi 23 novembre 2026.

## Développement

```bash
npm install
npm run dev
```

## Déploiement sur Netlify

- Commande de build : `npm run build`
- Dossier publié : `dist`

Le fichier `netlify.toml` est déjà en place. Après le déploiement, il est utile de remplacer les balises Open Graph (`og:url`, `og:image`) par l'adresse absolue du site, pour un aperçu correct sur WhatsApp et Facebook.

## Licence

Le code est sous licence MIT, © 2026 Bienvenu ESSEGNON.

Les logos de Global Entrepreneurship Week, d'OKAY Students et du Mois de l'Entrepreneuriat au Bénin appartiennent à leurs titulaires respectifs.
