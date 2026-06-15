import { initCatalogPage } from './catalog.js';
import { initCartPage } from './cart.js';
import { initLoginPage } from './login.js';
import { initRegisterPage } from './register.js';
import { initProfilePage } from './profile.js';
import * as GLOBAL from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.toLowerCase();
  handleGlobalFeatures();

  if (path.includes('catalog.html')) {
    initCartPage();
    initCatalogPage();
  }
  else if (path.includes('login.html')) {
    initLoginPage();
  }
  else if (path.includes('register.html')) {
    initRegisterPage();
  }
  else if (path.includes('profile.html')) {
    initProfilePage();
  }
});

function handleGlobalFeatures() {
  const signingBtn = document.getElementById('log-in-out');

  if (GLOBAL.isAuthorized && signingBtn) {
    signingBtn.innerText = "გამოსვლა";
  }
}