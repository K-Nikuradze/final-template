import { adminLoginCheck, getJwtToken } from './api.js';

const loginForm = document.getElementById('admin-login-form');
const submitBtn = document.getElementById('btn-admin-login');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('admin-name').value.trim();
  const password = document.getElementById('admin-password').value;

  submitBtn.disabled = true;
  submitBtn.innerText = 'მოწმდება...⏳';

  try {
    const adminData = await adminLoginCheck(username, password);
    
    const token = await getJwtToken(username, password);

    localStorage.setItem('adminUser', adminData.username);
    localStorage.setItem('adminEmail', adminData.email);
    localStorage.setItem('adminToken', token);


    document.cookie = "isAdmin=true; path=/; SameSite=Strict";

    alert(`მოგესალმებით, ${adminData.username}! ავტორიზაცია წარმატებულია. ✨`);
    window.location.replace('admin-dashboard.html');

  } catch (error) {
    alert(error.message || 'ავტორიზაცია უარყოფილია. შეამოწმეთ მონაცემები.');
    
    submitBtn.disabled = false;
    submitBtn.innerText = 'სისტემაში შესვლა';
  }
});