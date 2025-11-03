import { auth, provider, db, fetchAllData } from './firebase.js';
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const EMAILJS_PUBLIC_KEY = "8Cg6uj60f9oWuUiFp";
const EMAILJS_SERVICE_ID = "service_ryg4o2s";
const EMAILJS_SUBSCRIBE_TEMPLATE = "template_cqug4t8";
const EMAILJS_CONTACT_TEMPLATE = "template_6w8mnos";

// Stripe payment link (твой тестовый)
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_cNiaEQ5vB2vz6mAeYE6g800";

document.addEventListener('DOMContentLoaded', ()=>{
  // init emailjs
  if (window.emailjs) window.emailjs.init(EMAILJS_PUBLIC_KEY);

  // DOM refs
  const subForm = document.getElementById('subscribeForm');
  const subStatus = document.getElementById('subStatus');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const payNow = document.getElementById('payNow');
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const adminToggle = document.getElementById('adminToggle');
  const exportBtn = document.getElementById('exportBtn');

  // subscribe handler
  subForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    subscribeBtn.disabled = true;
    subStatus.textContent = 'Отправка...';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const lang = localStorage.getItem('fm_lang') || 'ru';
    try {
      await addDoc(collection(db,'subscriptions'), { name, email, phone, lang, price:2000, currency:'KZT', createdAt: serverTimestamp() });
      if (window.emailjs) {
        try {
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_SUBSCRIBE_TEMPLATE, { name, email, phone, lang, price:'2000 KZT' });
        } catch(err){ console.warn('EmailJS send failed', err); }
      }
      subStatus.textContent = 'Подписка оформлена!';
      subForm.reset();
    } catch(err){
      console.error(err);
      subStatus.textContent = 'Ошибка — попробуйте позже';
    } finally {
      subscribeBtn.disabled = false;
    }
  });

  // contact
  contactForm && contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    contactStatus.textContent = 'Отправка...';
    const name = document.getElementById('c_name').value.trim();
    const email = document.getElementById('c_email').value.trim();
    const msg = document.getElementById('c_msg').value.trim();
    try {
      await addDoc(collection(db,'contacts'), { name, email, message: msg, createdAt: serverTimestamp() });
      if (window.emailjs) {
        try { await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, { name, email, message: msg }); }
        catch(err){ console.warn('EmailJS contact send failed', err); }
      }
      contactStatus.textContent = 'Сообщение отправлено';
      contactForm.reset();
    } catch(err){
      console.error(err);
      contactStatus.textContent = 'Ошибка — попробуйте позже';
    }
  });

  // Stripe link
  payNow.addEventListener('click', (e)=>{
    e.preventDefault();
    window.open(STRIPE_PAYMENT_LINK, '_blank');
  });

  // Auth (admin)
  signInBtn.addEventListener('click', async ()=>{
    try { await signInWithPopup(auth, provider); } catch(e){ console.error(e); alert('Sign-in failed'); }
  });
  signOutBtn.addEventListener('click', async ()=> { await signOut(auth); });

  // auth state
  import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js').then(()=> {
    const { onAuthStateChanged } = window.firebase.auth || {};
    // we already use auth from firebase.js module; fallback:
    onAuthStateChanged(auth, user=>{
      if (user) {
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'inline-block';
        // show admin UI (toggle by button click)
      } else {
        signInBtn.style.display = 'inline-block';
        signOutBtn.style.display = 'none';
      }
    });
  });

  // admin toggle -> open admin.html in new tab
  adminToggle.addEventListener('click', ()=> {
    window.open('admin.html', '_blank');
  });

  // export CSV - fetch collections and export
  exportBtn.addEventListener('click', async ()=>{
    try {
      const subsQ = query(collection(db,'subscriptions'), orderBy('createdAt','desc'));
      const subsSnap = await getDocs(subsQ);
      const rows = [];
      subsSnap.forEach(doc=>{
        const d = doc.data();
        rows.push(['subscription', d.name||'', d.email||'', d.phone||'', d.lang||'', d.price||'', d.currency||'', d.createdAt ? d.createdAt.toDate().toISOString() : '']);
      });
      const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'finance_subs.csv'; a.click(); URL.revokeObjectURL(url);
    } catch(err){
      console.error(err); alert('Export failed');
    }
  });

});
