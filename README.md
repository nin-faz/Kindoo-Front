# Kindoo Messenger Front

Kindoo, c'est un univers doux et bienveillant, pensé pour les gens heureux, optimistes et ouverts à la discussion. Ici, la messagerie instantanée rime avec convivialité, sécurité et simplicité. Rejoins une communauté positive où chaque échange se fait dans la bonne humeur !

## Fonctionnalités

### 1. Authentification 🔐

- Inscription, connexion et déconnexion des utilisateurs.
- Stockage sécurisé du token JWT dans le `localStorage`.
- Validation avancée des mots de passe (longueur, majuscules, chiffres, caractères spéciaux).
- Décodage et vérification automatique du token à chaque chargement.

---

### 2. Messagerie instantanée 💬

- Liste de conversations récentes.
- Création de nouvelles conversations avec d'autres utilisateurs.
- Envoi et réception de messages en temps réel grâce à WebSocket (Socket.io).
- Indicateur de saisie ("typing...") en direct via WebSocket.
- Affichage des messages avec avatars et timestamps.
- Séparation des messages par date.

---

### 3. Interface utilisateur moderne 🎨

- Design responsive et épuré avec Tailwind CSS.
- Thème coloré et convivial.
- Composants réutilisables (boutons, champs de formulaire, modales, avatars).

---

### 4. Notifications et gestion des erreurs 🚨

- Affichage des erreurs d’authentification et de validation.
- Indicateur de nouveaux messages non lus.
- Gestion des erreurs réseau et serveur.

---

## Technologies utilisées 💻

- **React** & **TypeScript** : Interface utilisateur moderne et typée.
- **Apollo Client** : Communication GraphQL avec le backend.
- **Socket.io (WebSocket)** : Messagerie en temps réel et indicateurs de saisie instantanés.
- **Tailwind CSS** : Style rapide et responsive.
- **Vite** : Build ultra-rapide.

---

## Prérequis & Installation

1. **Cloner le dépôt**

   ```sh
   git clone https://github.com/ton-utilisateur/kindoo-front.git
   cd kindoo-front
   ```

2. **Installer les dépendances**

   ```sh
   npm install
   ```

3. **Lancer le serveur de développement**

   ```sh
   npm run dev
   ```

4. **Accéder à l’application**
   - Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

---

## Déploiement 🌐

Le frontend est déployé ici :  
👉 [https://kindoo.netlify.app/](https://kindoo.netlify.app/)

---

## Backend 🚀

Le backend GraphQL (Nest.js) est disponible séparément.  
Assure-toi qu’il soit lancé pour utiliser toutes les fonctionnalités de Kindoo Messenger.

---

## Auteurs

- FAZER Nino
- PEREIRA-ELENGA MAKOUALA Jordy
- TRAN Huu-Nghia
- MONMARCHE Romain

---

## Licence

Ce projet est sous licence MIT.
