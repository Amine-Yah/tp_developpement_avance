const startAutoMatches = async (apiUrl: string, interval: number = 5000) => {
  const response = await fetch(`${apiUrl}/api/auto-match/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interval }),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors du démarrage des matches: ${response.statusText}`);
  }

  return response.json();
};

export default startAutoMatches;
