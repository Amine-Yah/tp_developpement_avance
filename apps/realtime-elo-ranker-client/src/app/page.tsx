"use client";
import {
  MatchForm,
  MatchResult,
  PlayerData,
  PlayerForm,
  RankingLadder,
} from "@realtime-elo-ranker/libs/ui";
import { Poppins } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import fetchRanking from "../services/ranking/fetch-ranking";
import subscribeRankingEvents from "../services/ranking/subscribe-ranking-events";
import {
  RankingEvent,
  RankingEventType,
} from "../services/ranking/models/ranking-event";
import { motion } from "motion/react";
import postMatchResult from "../services/match/post-match-result";
import postPlayer from "../services/player/post-player";
import startAutoMatches from "../services/auto-match/start-auto-matches";
import stopAutoMatches from "../services/auto-match/stop-auto-matches";
import getAutoMatchStatus from "../services/auto-match/get-auto-match-status";

const poppinsBold = Poppins({
  weight: "600",
  style: "normal",
  variable: "--poppins-bold",
  subsets: ["latin"],
});

const poppinsSemiBold = Poppins({
  weight: "500",
  style: "normal",
  variable: "--poppins-semi-bold",
  subsets: ["latin"],
});

/**
 * Sorts the players by rank in descending order
 *
 * @param arr - The array of players to sort
 * @returns The sorted array of players
 */
function quickSortPlayers(arr: PlayerData[]): PlayerData[] {
  if (arr.length <= 1) {
    // Already sorted
    return arr;
  }
  const p = arr.pop();
  const left = [];
  const right = [];
  for (const el of arr) {
    if (el.rank >= p!.rank) {
      left.push(el);
    } else {
      right.push(el);
    }
  }
  return [...quickSortPlayers(left), p!, ...quickSortPlayers(right)];
}

/**
 * The home page
 * 
 * @returns The home page component
 */
export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const [ladderData, setLadderData] = useState<PlayerData[]>([]);
  const [isAutoMatchRunning, setIsAutoMatchRunning] = useState(false);

  const updateLadderData = useCallback((player: PlayerData) => {
    setLadderData((prevData) => {
      return quickSortPlayers(
        prevData.filter((p) => p.id !== player.id).concat(player)
      );
    });
  }, []);

  const reloadRanking = useCallback(() => {
    console.log("Reloading ranking from:", API_BASE_URL);
    fetchRanking(API_BASE_URL)
      .then((data) => {
        console.log("Ranking data received:", data);
        setLadderData(quickSortPlayers(data));
      })
      .catch((error) => {
        console.error("Error reloading ranking:", error);
      });
  }, [API_BASE_URL]);

  const handleStartAutoMatches = useCallback(async () => {
    try {
      await startAutoMatches(API_BASE_URL, 3000); // Match toutes les 3 secondes
      setIsAutoMatchRunning(true);
      console.log("Matches automatiques démarrés");
    } catch (error) {
      console.error("Erreur au démarrage des matches automatiques:", error);
      alert("Erreur: Impossible de démarrer les matches automatiques");
    }
  }, [API_BASE_URL]);

  const handleStopAutoMatches = useCallback(async () => {
    try {
      await stopAutoMatches(API_BASE_URL);
      setIsAutoMatchRunning(false);
      console.log("Matches automatiques arrêtés");
    } catch (error) {
      console.error("Erreur à l'arrêt des matches automatiques:", error);
      alert("Erreur: Impossible d'arrêter les matches automatiques");
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // Vérifier le statut au chargement
    try {
      getAutoMatchStatus(API_BASE_URL)
        .then((status) => {
          setIsAutoMatchRunning(status.isRunning);
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification du statut:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    try {
      fetchRanking(API_BASE_URL).then(setLadderData);
    } catch (error) {
      // TODO: toast error
      console.error(error);
    }
    const eventSource = subscribeRankingEvents(API_BASE_URL);
    eventSource.onmessage = (msg: MessageEvent) => {
      const event: RankingEvent = JSON.parse(msg.data);
      if (event.type === "Error") {
        console.error(event.message);
        return;
      }
      if (event.type === RankingEventType.RankingUpdate) {
        updateLadderData(event.player);
      }
    };
    eventSource.onerror = (err) => {
      // TODO: toast error
      console.error(err);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [API_BASE_URL, updateLadderData]);

  return (
    <div className="min-h-screen w-full">
      <motion.main
        className="flex flex-col gap-8 items-center sm:items-start max-w-full px-12 pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1
          className={`${poppinsBold.className} text-4xl font-bold text-center sm:text-left h-12`}
        >
          Realtime Elo Ranker
        </h1>
        <div className="w-full h-[610px] w-[95%]">
          <h2 className={`${poppinsSemiBold.className} text-2xl`}>
            Classement des joueurs
          </h2>
          <RankingLadder data={ladderData} />
        </div>
        <div className="flex mt-10 gap-12">
          <div className="flex flex-col gap-4">
            <h2 className={`${poppinsSemiBold.className} text-2xl`}>
              Déclarer un match
            </h2>
            <MatchForm
              callback={(
                adversaryA: string,
                adversaryB: string,
                result: MatchResult
              ) =>
                postMatchResult(API_BASE_URL, adversaryA, adversaryB, result)
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className={`${poppinsSemiBold.className} text-2xl`}>
              Déclarer un joueur
            </h2>
            <PlayerForm
              callback={(playerName: string) =>
                postPlayer(API_BASE_URL, playerName).then((res) => {
                  if (res.ok) {
                    // Attendre un peu puis recharger
                    setTimeout(() => {
                      console.log("Reloading after player creation...");
                      reloadRanking();
                    }, 500);
                  }
                  return res;
                })
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className={`${poppinsSemiBold.className} text-2xl`}>
              Matches Automatiques
            </h2>
            <div className="flex flex-col justify-center mb-4 gap-4 p-2 border border-gray-300 rounded-md">
              {isAutoMatchRunning ? (
                <button
                  onClick={handleStopAutoMatches}
                  className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                >
                  Arrêter les matches
                </button>
              ) : (
                <button
                  onClick={handleStartAutoMatches}
                  className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                >
                  Démarrer les matches
                </button>
              )}
              <p className="text-sm text-gray-500">
                Statut: {isAutoMatchRunning ? "En cours" : "Arrêté"}
              </p>
            </div>
          </div>
        </div>
      </motion.main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
