import { auth, provider, db, fetchAllData } from './firebase.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', ()=>{
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const list = document.getElementById('list');
  const download = document.getElementById('download');

  signInBtn.addEventListener('click', async ()=>{
    try { await signInWithPopup(auth, provider); } catch(e){ console.error(e); alert('Sign in failed'); }
  });
  signOutBtn.addEventListener('click', async ()=> { await signOut(auth); });

  onAuthStateChanged(auth, async user=>{
    if (user) {
      signInBtn.style.display='none'; signOutBtn.style.display='inline-block';
      document.title = `Admin — ${user.email}`;
      // load data
      try {
        const subsQ = query(collection(db,'subscriptions'), orderBy('createdAt','desc'));
        const subsSnap = await getDocs(subsQ);
        let html = '<table style="width:100%"><thead><tr><th>Когда</th><th>Имя</th><th>Email</th><th>Тел</th><th>Тип</th></tr></thead><tbody>';
        subsSnap.forEach(doc=>{
          const d=doc.data();
          html += `<tr><td>${d.createdAt?d.createdAt.toDate().toLocaleString():'-'}</td><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.email)}</td><td>${escapeHtml(d.phone||'-')}</td><td>subscription</td></tr>`;
        });
        const contQ = query(collection(db,'contacts'), orderBy('createdAt','desc'));
        const contSnap = await getDocs(contQ);
        contSnap.forEach(doc=>{
          const d=doc.data();
          html += `<tr><td>${d.createdAt?d.createdAt.toDate().toLocaleString():'-'}</td><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.email)}</td><td>-</td><td>contact</td></tr>`;
        });
        html += '</tbody></table>';
        list.innerHTML = html;
      } catch(err){ console.error(err); list.textContent = 'Ошибка при загрузке'; }
    } else {
      signInBtn.style.display='inline-block'; signOutBtn.style.display='none';
      list.innerHTML = '';
    }
  });

  download.addEventListener('click', async ()=>{
    // reuse admin fetch
    const rows = [];
    const subsQ = query(collection(db,'subscriptions'), orderBy('createdAt','desc'));
    const subsSnap = await getDocs(subsQ);
    subsSnap.forEach(doc=>{
      const d = doc.data();
      rows.push(['subscription', d.name||'', d.email||'', d.phone||'', d.lang||'', d.createdAt?d.createdAt.toDate().toISOString():'']);
    });
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='data.csv'; a.click(); URL.revokeObjectURL(url);
  });

  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
});
