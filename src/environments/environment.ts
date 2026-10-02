// App-wide settings. TMDB keys are free: create your own at
// https://www.themoviedb.org/settings/api and put it here.
// A browser app can't keep this key secret (it travels in every request),
// so use a key from an account made for this app only.
export const environment = {
  tmdb: {
    apiKey: 'a6493890665a35d49413ed72aa7c489c',
    apiUrl: 'https://api.themoviedb.org/3',
    imageUrl: 'https://image.tmdb.org/t/p',
  },
};
