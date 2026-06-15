export const isAuthorized = document.cookie.split('; ').some(row => row.startsWith('authorized=true'));
export const R2_BASE_Path = 'https://pub-c966a90ea96443f98cb7bede2669eb6f.r2.dev/';
export const CURRENT_CUSTOMER_ID = localStorage.getItem('userId');