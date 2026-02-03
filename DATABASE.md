# Configuration de la Base de Données

## Aperçu

Le projet **Realtime Elo Ranker** utilise maintenant une **base de données SQLite** pour persister les données des joueurs et des matchs. Auparavant, les données étaient stockées uniquement en mémoire.

## Base de Données

- **Type:** SQLite (better-sqlite3)
- **Fichier:** `data/elo-ranker.db`
- **ORM:** TypeORM
- **Auto-synchronisation:** Activée (les schémas se créent automatiquement)

## Entités

### Players
```
- id (PrimaryColumn)
- rank (Column)
- createdAt (CreateDateColumn)
- updatedAt (UpdateDateColumn)
```

### Matches
```
- id (PrimaryGeneratedColumn)
- player1Id (Column)
- player2Id (Column)
- result (Column) - 'player1' | 'player2' | 'draw'
- player1OldRank (Column)
- player2OldRank (Column)
- player1NewRank (Column)
- player2NewRank (Column)
- timestamp (CreateDateColumn)
```

## Démarrage

Lors du premier démarrage du serveur NestJS, la base de données est créée automatiquement:

```bash
cd apps/realtime-elo-ranker-server
npm run start:dev
```

Un fichier `data/elo-ranker.db` sera créé dans le répertoire racine du serveur.

## Avantages

**Persistance des données** - Les joueurs et matchs sont conservés entre les redémarrages
**Performance** - SQLite est léger et rapide
**Zéro configuration** - Aucun serveur de base de données à installer
**TypeORM** - ORM puissant avec migrations et relations

## Réinitialiser la Base de Données

Pour recommencer avec une base vide, supprimez simplement le fichier:

```bash
rm data/elo-ranker.db
```

Lors du prochain démarrage, une nouvelle base de données vierge sera créée.

## Git

Le dossier `data/` est exclu de Git (voir `.gitignore`), donc la base de données locale ne sera pas synchronisée sur le serveur.
