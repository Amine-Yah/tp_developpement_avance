#!/bin/bash

# Démarrer le serveur NestJS
echo "Démarrage du serveur NestJS sur le port 3001..."
cd "apps/realtime-elo-ranker-server"
npm run start > /tmp/nest-server.log 2>&1 &
NEST_PID=$!
echo "PID du serveur NestJS: $NEST_PID"

# Attendre un moment que le serveur démarre
sleep 3

# Démarrer le client Next.js
echo "Démarrage du client Next.js sur le port 3000..."
cd "../realtime-elo-ranker-client"
npm run dev > /tmp/next-client.log 2>&1 &
NEXT_PID=$!
echo "PID du client Next.js: $NEXT_PID"

# Afficher les informations
echo ""
echo "========================================="
echo "Application démarrée avec succès!"
echo "========================================="
echo "Client Next.js: http://localhost:3000"
echo "Serveur API: http://localhost:3001"
echo ""
echo "Pour arrêter les serveurs, exécutez:"
echo "  kill $NEST_PID $NEXT_PID"
echo "========================================="

# Garder le script actif
wait
