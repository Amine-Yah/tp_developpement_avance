const getAutoMatchStatus = async (apiUrl: string) => {
  const response = await fetch(`${apiUrl}/api/auto-match/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du statut: ${response.statusText}`);
  }

  return response.json();
};

export default getAutoMatchStatus;
