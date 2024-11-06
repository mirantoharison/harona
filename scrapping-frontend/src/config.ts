const getApiUrl = () => {
  // Utilisez `window` pour accéder à des variables globales, ou remplacez par des valeurs d'environnement lors du build.
  //return "https://harona-eight.vercel.app/api"; // valeur par défaut pour dev
  return "http://3.144.174.201/api"; // valeur par défaut pour dev
};

export default getApiUrl;