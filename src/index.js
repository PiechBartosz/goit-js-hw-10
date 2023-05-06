import './css/styles.css';

const DEBOUNCE_DELAY = 300;

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const API_URL = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
  const query = `${API_URL}${name}?fields=name,capital,population,flags,languages`;
  return fetch(query).then(response => {
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      throw new Error('Nie znaleziono kraju o podanej nazwie');
    }
    throw new Error('Błąd podczas pobierania danych o kraju');
  });
}

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function handleSearch() {
  const searchValue = searchBox.value.trim();

  if (!searchValue) {
    clearResults();
    return;
  }

  fetchCountries(searchValue)
    .then(countries => {
      clearResults();

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length > 1) {
        displayCountryList(countries);
      } else if (countries.length === 1) {
        displayCountryInfo(countries[0]);
      }
    })
    .catch(error => {
      clearResults();
      Notiflix.Notify.failure(error.message);
    });
}

function clearResults() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function displayCountryList(countries) {
  const listItems = countries.map(country => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="50"> ${country.name.common}`;
    return li;
  });

  countryList.append(...listItems);
}

function displayCountryInfo(country) {
  const info = `
    <img src="${country.flags.svg}" alt="Flag of ${
    country.name.common
  }" width="100">
    <h2>${country.name.common}</h2>
    <p>Capital: ${country.capital.join(', ')}</p>
    <p>Population: ${country.population.toLocaleString()}</p>
    <p>Languages: ${Object.values(country.languages).join(', ')}</p>
  `;

  countryInfo.innerHTML = info;
}

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
