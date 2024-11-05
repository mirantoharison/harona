const getApiUrl = () => {
  // Utilisez `window` pour accéder à des variables globales, ou remplacez par des valeurs d'environnement lors du build.
  return "http://3.15.171.43/api"; // valeur par défaut pour dev
};

export default getApiUrl;