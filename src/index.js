import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
export const list = document.querySelector('.country-list');
export const countryInfo = document.querySelector('.country-info');

search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const country = e.target.value.trim();

  if (!country) {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        list.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length >= 2 && data.length <= 10) {
        countryInfo.innerHTML = '';
        renderCountries(data);
      }

      if (data.length === 1) {
        list.innerHTML = '';
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
        <img src="${flags.svg}" alt="national flag" width="50">
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
    <div>
        <div class="country-wrapper">
            <img class="country-img" src="${flags.svg}" alt="national flag" width="120">
            <h2 class="country-name">${name.official}</h2>
        </div>
        <p><span class="country-text">Capital:</span> ${capital}</p>
        <p><span class="country-text">Population:</span> ${population}</p>
        <p><span class="country-text">Languages:</span> ${languagesArr}</p>
    </div>
    `;

  countryInfo.innerHTML = markup;
}
