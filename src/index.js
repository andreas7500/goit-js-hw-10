import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const form = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

form.addEventListener('input', debounce(onFormData, DEBOUNCE_DELAY));

function onFormData(e) {
  e.preventDefault();
  const countryName = form.value.trim();

  if (countryName === '') {
    clearMarkUp();
    return;
  }

  fetchCountries(countryName)
    .then(countrys => {
      clearMarkUp();
      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countrys.length <= 10 && countrys.length >= 2) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countrys)
        );
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countrys)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryinfo(countrys)
        );
      }
    })
    .catch(error => {
      if ((error.message = 404)) {
        clearMarkUp();

        Notify.failure('Oops, there is no country with that name');
        form.value = '';
        console.log(error);
      }
    });

  function clearMarkUp() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }

  function renderCountryList(countrys) {
    const listMarkup = countrys
      .map(
        ({ name, flags }) =>
          `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
      )
      .join('');
    return listMarkup;
  }

  function renderCountryinfo(countrys) {
    const infoMarkup = countrys
      .map(({ capital, population, languages }) => {
        return `
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>
        `;
      })
      .join('');
    return infoMarkup;
  }
}
