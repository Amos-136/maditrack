# MediTrack.ai 🏥

Plateforme SaaS moderne de gestion médicale pour hôpitaux publics et cliniques privées.

## 🚀 Fonctionnalités

- 📊 **Tableau de bord** - Vue d'ensemble en temps réel
- 👨‍⚕️ **Gestion des patients** - CRUD complet avec recherche
- 📅 **Rendez-vous** - Calendrier et planification
- 💳 **Abonnements** - Plans Basic, Pro et Clinic
- 🧑‍⚕️ **Personnel** - Gestion de l'équipe médicale
- 🤖 **Assistant IA** - Chatbot médical intelligent (à activer avec Lovable Cloud)
- ⚙️ **Paramètres** - Configuration utilisateur et établissement

## 🎨 Design

- **Thème professionnel** : Bleu médical (#0284C7), blanc et vert menthe
- **Responsive** : Sidebar sur desktop, navigation bottom sur mobile
- **PWA** : Installable sur mobile et desktop
- **Animations fluides** : Transitions et micro-interactions

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui
- **Routing** : React Router v6
- **Storage** : LocalStorage (mode démo)
- **PWA** : vite-plugin-pwa

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/39a22967-e139-4360-b0b9-5901a1e85bd4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/39a22967-e139-4360-b0b9-5901a1e85bd4) and click on Share -> Publish.

The app is optimized for Vercel deployment and includes PWA support.

## 🔐 Prochaines étapes

Pour activer toutes les fonctionnalités backend :

1. **Activer Lovable Cloud** pour :
   - Authentication multi-tenant
   - Base de données PostgreSQL avec RLS
   - Edge Functions serverless

2. **Intégrations** :
   - OpenAI pour l'assistant IA médical
   - Paystack pour les paiements récurrents
   - SMS pour les notifications

## 📱 PWA Features

L'application est une Progressive Web App :
- ✅ Installable sur mobile et desktop
- ✅ Fonctionne hors ligne
- ✅ Icônes adaptatives
- ✅ Performance optimisée

## 🏗️ Architecture

```
src/
├── components/
│   ├── dashboard/      # Composants du dashboard
│   ├── layout/         # Layout (Sidebar, Header, MobileNav)
│   └── ui/             # shadcn/ui components
├── pages/              # Pages de l'application
├── lib/                # Utilitaires (storage, utils)
├── types/              # Types TypeScript
└── index.css           # Design system & tokens CSS
```

## 🎯 Mode Demo

L'application fonctionne actuellement en mode démo avec :
- Données en localStorage
- Organisation et utilisateur de démonstration
- Patients et rendez-vous pré-configurés

---

**MediTrack.ai** - Modernisons la santé ensemble 💙
