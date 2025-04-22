import lang from "./lang.js";
import countries from "./countries.js";
import icon from "./icons.js";

function main() {
  'use strict';
  handleLanguageChange()
  floatingLabelInput('#email-phone', '#email-phone-label')
  floatingLabelInput('#password', '#password-label')
  showDialCodesSelectElement('#email-phone', '#country-code')
  populateSelectInput()
  togglePasswordVisibility()
  //handleFormSubmission()
  locationServices()
}

main()



//Show the dial codes if input is a phone number
function showDialCodesSelectElement(inputSelector, selectSelector) {
  const input = document.querySelector(inputSelector)
  const select = document.querySelector(selectSelector)

  if (!input || !select) {
    return
  }

  const showSelect = () => {
    select.classList.remove('hidden')
  }

  const hideSelect = () => {
    select.classList.add('hidden')
  }

  if (hasOnlyNumbers(input.value)) {
    showSelect()
  } else {
    hideSelect()
  }

  input.addEventListener('input', (event) => {
    const value = event.target?.value
    if (hasOnlyNumbers(value)) {
      showSelect()
      input.setAttribute('type', '')
    } else {
      hideSelect()
      input.setAttribute('type', 'email')
    }
  })
}

//Handle label animation
function floatingLabelInput(inputSelector, labelSelector) {
  const input = document.querySelector(inputSelector)
  const label = document.querySelector(labelSelector)

  if (!input || !label) {
    return
  }

  const raiseLabel = () => {
    label.style.fontSize = '1rem'
    label.style.transform = 'translateY(-10px)'
  }
  
  const dropLabel = () => {
    label.style.fontSize = '1.1rem'
    label.style.transform = 'translateY(0)'
  }

  if (input.value) {
    raiseLabel()
  } else {
    dropLabel()
  }

  input.addEventListener('focus', () => {
    raiseLabel()
  })
  
  input.addEventListener('blur', () => {
    input.value.length > 0 ? raiseLabel() : dropLabel()
  })
}

function togglePasswordVisibility() {
  const btn = document.querySelector('[data-password-toggler]')
  const input = document.querySelector('#password')

  if (!btn || !input) {
    return
  }

  const toggle = (event) => {
    event.stopPropagation()
    input.type = input.type === 'password' ? 'text' : 'password'
    btn.innerHTML = input.type === 'password' ? icon('visibility') : icon('visibility_off')
  }

  btn.addEventListener('click', toggle)
}

//Check if input has only numbers
function hasOnlyNumbers (value) {
  return /^[+,0-9]+$/.test(value)
}

// Translation function
function t(value, locale = 'en') {
  return lang[locale]?.[value] ?? value;
}

// Function to translate all elements with data-text attribute
function translatePage(locale) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(element => {
    const key = element.dataset.lang; // Get the translation key from data-text
    element.textContent = t(key, locale); // Translate and update the element's text
  });
}


// Handle language change
function handleLanguageChange() {
  // Get locale from URL search params or default to 'en'
  let locale = new URLSearchParams(window.location.search).get('lang') || 'en';

  // Add click event listeners to language buttons
  const btns = document.querySelectorAll('[data-lang-btn]');
  btns?.forEach(btn => {
    btn.addEventListener('click', changeLanguage);
  });

  // Translate the page initially
  translatePage(locale);
  showActiveButton(locale);

  // Function to change language on button click
  function changeLanguage(event) {
    const newLocale = event.target?.dataset.langBtn; // Get the new locale from the button's data-lang attribute
    if (newLocale) {
      // Update the URL with the new locale
      const url = new URL(window.location);
      url.searchParams.set('lang', newLocale);
      window.history.pushState({}, '', url);

      // Update the locale variable
      locale = newLocale;

      // Re-translate the page
      translatePage(newLocale);
      showActiveButton(newLocale);
    }
  }

  // Function to highlight the active button
  function showActiveButton(currentLocale) {
    btns?.forEach(btn => {
      btn.classList.remove('font-bold');
    });
    document.querySelector(`[data-lang-btn="${currentLocale}"]`)?.classList.add('font-bold');
  }
}

function populateSelectInput() {
  const select = document.querySelector('#country-code');
  if (!select) return;

  select.innerHTML = `
    <option value="0" disabled>Select a country</option>
    ${countries.map((country) => `<option value="${country.dial_code}">${country.name} (${country.dial_code})</option>`).join('')}
  `;

  // Add event listener for the 'change' event
  select.addEventListener('change', () => {
    setSelectValue();
  });

  const initialValue = select.value;
  if (initialValue && initialValue !== '0') {
    setSelectValue();
  }

  // Add event listener for the 'change' event
  select.addEventListener('change', () => {
    setSelectValue();
  });

  // Function to update the selected option's text
  function setSelectValue() {
    const selectedOption = select.options?.[select.selectedIndex];
    if (selectedOption && selectedOption.value !== '0') { // Skip the disabled option
      const dialingCode = select.value;
      selectedOption.textContent = dialingCode;
    }
  }
}

function locationServices() {
  const btn = document.querySelector('#location-btn')
  const close = document.querySelector('#close-btn')
  const overlay = document.querySelector('.overlay')
  const countries_1 = document.querySelector('#major-countries')
  const countries_2 = document.querySelector('#other-countries')

  if (!btn) {
    return
  }
  const flag = btn.querySelector('#country-flag')
  const us = countries.find((country) => country.code === 'US')
  if (us) {
    flag.textContent = us.emoji
  }

  btn.addEventListener('click', () => {
    overlay.classList.add('show')
  })

  close.addEventListener('click', () => {
    overlay.classList.remove('show')
  })

  const majorCountries = []
  const otherCountries = []

  countries.forEach((country) => {
    const majorCodes = ['US', 'DE', 'GB', 'AU', 'FR', 'IT', 'CA', 'ES']
    if (majorCodes.includes(country.code)) {
      majorCountries.push(country)
    } else {
      otherCountries.push(country)
    }
  })

  countries_1.innerHTML = majorCountries.map((country) => `<button class="country-btn cursor-pointer text-left flex items-center  gap-2">
    <span style="font-size: 1.25rem">${country.emoji}</span>
    <span class="font-bold text-slate-500">${country.name}</span>
  </button>`).join(' ')

  countries_2.innerHTML = otherCountries.map((country) => `<button class="country-btn cursor-pointer text-left flex items-center  gap-2">
    <span style="font-size: 1.25rem">${country.emoji}</span>
    <span class="font-bold text-slate-500">${country.name}</span>
  </button>`).join(' ')


  const countryBtns = document.querySelectorAll('.country-btn')
  countryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      overlay.classList.remove('show')
      flag.innerText = btn.querySelector('span:first-of-type').innerText
    })
  })
}