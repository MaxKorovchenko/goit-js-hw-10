import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');

search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const country = e.target.value.trim();

  if (!country) {
    list.innerHTML = '';
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length >= 2 && data.length <= 10) {
        renderCountries(data);
      }

      if (data.length === 1) {
        renderCountry(data);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function renderCountries(countries) {
  const markup = countries
    .map(
      ({ name, flags }) => `
    <li>
        <img src="${flags.svg}" alt="national flag" width="30">
        <h2>${name.official}</h2>
    </li>
    `
    )
    .join('');

  list.innerHTML = markup;
}

function renderCountry(country) {
  const { name, flags, capital, population, languages } = country[0];
  const languagesArr = Object.values(languages);

  const markup = `
    <li>
        <img src="${flags.svg}" alt="national flag" width="30">
        <h2>${name.official}</h2>
        <h3>Capital: ${capital}</h3>
        <p>Population: ${population}</p>
        <p>Languages: ${languagesArr}</p>
    </li>
    `;

  list.innerHTML = markup;
}
