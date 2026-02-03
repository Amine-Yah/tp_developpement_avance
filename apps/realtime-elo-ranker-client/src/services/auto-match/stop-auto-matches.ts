const stopAutoMatches = async (apiUrl: string) => {
  const response = await fetch(`${apiUrl}/api/auto-match/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'arrêt des matches: ${response.statusText}`);
  }

  return response.json();
};

export default stopAutoMatches;
