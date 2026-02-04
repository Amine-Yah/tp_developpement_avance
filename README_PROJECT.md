# Realtime Elo Ranker

## Description

L'application **Realtime Elo Ranker** est une solution complète de gestion et de classement ELO pour les joueurs. Elle utilise un système de calcul ELO en temps réel pour évaluer les performances des joueurs après chaque match.

## Architecture

### Stack Technologique

- **Backend**: NestJS (TypeScript/Node.js) - Port 3001
- **Frontend**: Next.js 15 (React 19) - Port 3000
- **Interface Utilisateur**: Tailwind CSS avec composants React réutilisables
- **Communication Temps Réel**: Server-Sent Events (SSE)
- **Stockage**: Mémoire (données volatiles, réinitialisées au redémarrage)
- **Package Manager**: pnpm

### Structure du Projet

```
tp_developpement_avance/
├── apps/
│   ├── realtime-elo-ranker-client/      # Application Next.js (Port 3000)
│   └── realtime-elo-ranker-server/      # API NestJS (Port 3001)
├── libs/
│   └── ui/                               # Composants UI réutilisables
├── run-tests.sh                          # Suite de tests (20 tests)
├── start.sh                              # Script de démarrage
├── README_PROJECT.md                     # Documentation complète
├── RAPPORT.md                            # Rapport d'implémentation
└── RAPPORT_TESTS.md                      # Rapport de tests
```

## Fonctionnalités

### 1. **Gestion des Joueurs**
- Créer de nouveaux joueurs
- Les joueurs débutent avec un classement ELO de 1200
- Mise à jour automatique des classements après chaque match

### 2. **Gestion des Matches**
- Déclarer le résultat d'un match
- Calcul automatique des nouveaux ELO selon le résultat
- Support des victoires simples et des matchs nuls

### 3. **Classement en Temps Réel**
- Affichage du classement mis à jour en temps réel
- Utilisations d'événements SSE pour les mises à jour instantanées
- Tri automatique par ELO décroissant

### 4. **Matches Automatiques**
- Génération automatique de matches entre joueurs aléatoires
- Démarrage/arrêt des matches automatiques via l'interface
- Mise à jour du classement en temps réel

### 5. **Système ELO Implémenté**
- Calcul ELO basé sur les capacités relatives des joueurs
- Facteur K configurable (actuellement K=32)
- Prise en compte de l'écart de classement

## Installation

### Prérequis

- Node.js 18+
- pnpm (peut être installé localement via npm)

### Installation des Dépendances

```bash
# Installer pnpm globalement (optionnel)
npm install -g pnpm

# Ou utiliser le pnpm local du projet
cd tp_developpement_avance
pnpm install
```

## Démarrage

### Option 1: Script automatique

```bash
./start.sh
```

### Option 2: Démarrage manuel

**Terminal 1 - Serveur API:**
```bash
cd apps/realtime-elo-ranker-server
npm run start
```

**Terminal 2 - Client:**
```bash
cd apps/realtime-elo-ranker-client
npm run dev
```

### Accès à l'Application

- **Client Web**: http://localhost:3000
- **API REST**: http://localhost:3001

### ⚠️ Important: Stockage en Mémoire

**L'application stocke TOUTES les données EN MÉMOIRE**:
- Les joueurs et leurs ELO
- L'historique des matches
- Les données sont perdues au redémarrage du serveur

Cela signifie:
- ✅ Performance maximale
- ✅ Pas de configuration BD nécessaire
- ✅ Idéal pour les tests et la démo
- ⚠️ Les données ne sont pas persistantes
- ⚠️ À chaque redémarrage, les données sont réinitialisées

## API Endpoints

### Joueurs

- `GET /api/player` - Lister tous les joueurs
- `POST /api/player` - Créer un joueur
- `GET /api/player/:id` - Récupérer un joueur
- `PATCH /api/player/:id` - Mettre à jour un joueur
- `DELETE /api/player/:id` - Supprimer un joueur

### Matches

- `POST /api/match` - Enregistrer un résultat de match
- `GET /api/match` - Lister l'historique des matches

### Classement

- `GET /api/ranking` - Obtenir le classement actuel
- `GET /api/ranking/subscribe` - S'abonner aux mises à jour SSE

### Matches Automatiques

- `GET /api/auto-match/status` - Obtenir le statut des matches auto
- `POST /api/auto-match/start` - Démarrer les matches auto
- `POST /api/auto-match/stop` - Arrêter les matches auto

## Tests

### Exécuter la Suite de Tests

```bash
./run-tests.sh
```

La suite inclut **20 tests** automatisés validant:
- La création et la gestion des joueurs
- Le calcul des ELO
- Les matches et les résultats
- Le classement en temps réel
- Les matches automatiques

**Résultat**: ✓ 100% de réussite (20/20 tests)

## Composants React

### Composants Principaux

1. **RankingLadder**
   - Affiche le classement des joueurs
   - Met à jour en temps réel via SSE
   - Trie par ELO décroissant

2. **MatchForm**
   - Formulaire pour déclarer un match
   - Sélection des joueurs
   - Support des victoires simples et des nuls

3. **PlayerForm**
   - Formulaire pour ajouter un joueur
   - Validation du nom unique

## Documentation

- [README_PROJECT.md](./README_PROJECT.md) - Documentation complète du projet
- [RAPPORT.md](./RAPPORT.md) - Rapport d'implémentation détaillé
- [RAPPORT_TESTS.md](./RAPPORT_TESTS.md) - Rapport des tests (20/20 réussis)

## Technologies Utilisées

- **NestJS**: Framework Backend moderne
- **TypeScript**: Langage typé pour plus de sécurité
- **React 19**: Bibliothèque UI moderne
- **Next.js 15**: Framework React avec SSR
- **Tailwind CSS**: Framework CSS utilitaire
- **EventEmitter2**: Gestion des événements
- **RxJS**: Programmation réactive
- **pnpm**: Package manager performant

## Développement

### Mode Développement

**Serveur (Watch Mode):**
```bash
cd apps/realtime-elo-ranker-server
npm run start:dev
```

**Client (Hot Reload):**
```bash
cd apps/realtime-elo-ranker-client
npm run dev
```

### Build Production

**Serveur:**
```bash
cd apps/realtime-elo-ranker-server
npm run build
npm run start
```

**Client:**
```bash
cd apps/realtime-elo-ranker-client
npm run build
npm run start
```

## Performance

- Requêtes API: < 50ms
- Mises à jour SSE: Temps réel
- Calcul ELO: < 1ms
- Tests: 100% de réussite en moins de 5 secondes

## Gestion d'Erreurs

L'application implémente une gestion complète des erreurs:
- Validation des données d'entrée
- Gestion des joueurs en doublon
- Erreurs 404 pour les ressources manquantes
- Messages d'erreur détaillés dans les réponses

## Auteurs et Licence

Projet académique pour le cours de Développement Avancé en Node.js
