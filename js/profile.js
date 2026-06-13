import { getOrders, cancelOrder, changeUsername, changePassword } from './api.js';

const CURRENT_CUSTOMER_ID = localStorage.getItem('userId');

const usernameInput = document.getElementById('profile-username');
const emailInput = document.getElementById('profile-email');
const passwordInput = document.getElementById('profile-password');
const ordersListContainer = document.getElementById('orders-list-container');
const signingBtn = document.getElementById('log-in-out');
const dataUpdateBtn = document.getElementById('data-update');
const oldPasswordInput = document.getElementById('profile-old-password');

const isAuthorized = document.cookie.split('; ').some(row => row.startsWith('authorized=true'));

if (!isAuthorized) {
  window.location.href = 'login.html';
}

if (isAuthorized) {
  signingBtn.innerText = "გამოსვლა";
}

function loadInitialUserData() {
  const currentUsername = localStorage.getItem('user');
  const currentEmail = localStorage.getItem('userEmail');

  if (currentUsername) {
    usernameInput.value = currentUsername;
  }
  if (currentEmail) {
    emailInput.value = currentEmail;
  }
}

async function handleDataUpdate(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    e.preventDefault(); 

    const currentUsername = localStorage.getItem('user');
    const newUsername = usernameInput.value.trim();
    const oldPassword = oldPasswordInput.value;
    const newPassword = passwordInput.value;

    if (!newUsername) {
      alert('მომხმარებლის სახელი არ შეიძლება იყოს ცარიელი!');
      return;
    }

    try {
      let isUsernameChanged = false;
      let isPasswordChanged = false;

      if (newUsername !== currentUsername) {
        await changeUsername(CURRENT_CUSTOMER_ID, newUsername);
        localStorage.setItem('user', newUsername);
        isUsernameChanged = true;
      }

      if (newPassword) {
        if (!oldPassword) {
          alert('პაროლის შესაცვლელად აუცილებელია მიმდინარე (ძველი) პაროლის მითითება!');
          return;
        }
        
        await changePassword(CURRENT_CUSTOMER_ID, oldPassword, newPassword);
        oldPasswordInput.value = '';
        passwordInput.value = '';
        isPasswordChanged = true;
      }

      if (isUsernameChanged || isPasswordChanged) {
        alert('მონაცემები წარმატებით განახლდა სერვერზე! ✨');
      } else {
        alert('ცვლილებები არ დაფიქსირებულა.');
      }

    } catch (error) {
      alert(error.message || 'მონაცემების განახლებისას მოხდა შეცდომა.');
    }
  }
}

usernameInput.addEventListener('keydown', handleDataUpdate);
oldPasswordInput.addEventListener('keydown', handleDataUpdate);
passwordInput.addEventListener('keydown', handleDataUpdate);
dataUpdateBtn.addEventListener('click', handleDataUpdate);

async function loadOrders() {
  try {
    const orders = await getOrders(CURRENT_CUSTOMER_ID);
    ordersListContainer.innerHTML = '';

    if (!orders || orders.length === 0) {
      ordersListContainer.innerHTML = '<p class="loading-orders">თქვენ ჯერ არ გაქვთ განხორციელებული შეკვეთა.</p>';
      return;
    }

    orders.reverse().forEach(order => {
      const orderDate = new Date(order.createdAt || order.orderDate || Date.now()).toLocaleDateString('ka-GE');
      
      let statusClass = 'status-pending';
      let statusText = order.status || 'Completed';
      if (statusText === 'Completed' || statusText === 'Completed') statusClass = 'status-completed';
      if (statusText === 'Cancelled' || statusText === 'Cancelled') statusClass = 'status-cancelled';

      const orderBox = document.createElement('div');
      orderBox.className = 'order-box';
      orderBox.innerHTML = `
        <div class="order-header">
          <span class="order-id">შეკვეთა #${order.id}</span>
          <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        <div class="order-body">
          <div class="order-details-row">
            <span class="order-label">თარიღი:</span>
            <span class="order-value">${orderDate}</span>
          </div>
          <div class="order-details-row">
            <span class="order-label">ჯამური თანხა:</span>
            <span class="order-total">${(order.totalPrice || 0).toFixed(2)} ₾</span>
          </div>
            <button class="btn-cancel-order" data-order-id="${order.id}">შეკვეთის გაუქმება ❌</button>
        </div>
      `;
      ordersListContainer.appendChild(orderBox);
    });

  } catch (error) {
    ordersListContainer.innerHTML = '<p class="loading-orders" style="color: red;">შეკვეთების ჩატვირთვა ვერ მოხერხდა.</p>';
  }
}

ordersListContainer.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('btn-cancel-order')) return;
  const orderId = e.target.getAttribute('data-order-id');
  if (!confirm(`ნამდვილად გსურთ შეკვეთის #${orderId} გაუქმება?`)) return;

  try {
    e.target.disabled = true;
    e.target.innerText = 'უქმდება...';
    await cancelOrder(CURRENT_CUSTOMER_ID, orderId);
    await loadOrders();
  } catch (error) {
    alert('შეკვეთის გაუქმება ვერ მოხერხდა.');
    e.target.disabled = false;
    e.target.innerText = 'შეკვეთის გაუქმება ❌';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadInitialUserData();
  loadOrders();
});