import './css/styles.css';

import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

function infoInput() {
  const name = input.value.trim();
  if (name === '') {
    return (list.innerHTML = ''), (div.innerHTML = '');
  }

  fetchCountries(name)
    .then(elements => {
      list.innerHTML = '';
      div.innerHTML = '';
      if (elements.length === 1) {
        list.insertAdjacentHTML('beforeend', updateList(elements));
        div.insertAdjacentHTML('beforeend', updateDiv(elements));
      } else if (elements.length >= 10) {
        longValue();
      } else {
        list.insertAdjacentHTML('beforeend', updateList(elements));
      }
    })
    .catch(noName);
}

function updateList(elements) {
  const markup = elements
    .map(({ name, flags }) => {
      return `<li class="item"><img class="img__country" src="${flags.svg}" alt="${name.official}" width = "60" height = "40"><strong>${name.official}</strong></li>`;
    })
    .join('');
  return markup;
}

function updateDiv(elements) {
  const markup = elements
    .map(({ capital, population, languages }) => {
      return `<ul>
            <li><p>Capital: ${capital}</p></li>
            <li><p>Population: ${population}</p></li>
            <li><p>Languages: ${Object.values(languages).join(
              ', '
            )}</p></li></ul>`;
    })
    .join('');
  return markup;
}

function noName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function longValue() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
input.addEventListener('input', debounce(infoInput, DEBOUNCE_DELAY));
