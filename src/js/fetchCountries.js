const url = 'https://restcountries.com/v3.1/name/';
const filter = '?fields=name,flags,population,capital,languages';
export function fetchCountries(name) {
  return fetch(`${url}${name}${filter}`).then(recponce => {
    if (!recponce.ok) {
      throw new Error(recponce.status);
    }
    return recponce.json();
  });
}
