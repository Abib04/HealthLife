import './style.css';
import './pwa.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() { showInstallBanner('Versi baru HealthLife tersedia.', 'Perbarui', () => updateSW(true)); },
});

const KEY = 'healthlife-coach-state-v1';
const seed = {
  goal: { race: 'Borobudur Marathon', date: '2026-12-20', target: 'Finish strong', distance: 42.195 },
  plan: [
    { day: 'Mon', type: 'Recovery', target: '30 min mobility', kind: 'Recovery', done: true },
    { day: 'Tue', type: 'Easy Run', target: '8 km · Easy', kind: 'Easy', done: true },
    { day: 'Wed', type: 'Strength', target: '35 min · Core + legs', kind: 'Strength', done: false },
    { day: 'Thu', type: 'Tempo Run', target: '7 km · Controlled', kind: 'Tempo', done: false },
    { day: 'Fri', type: 'Rest', target: 'Full rest', kind: 'Rest', done: false },
    { day: 'Sat', type: 'Easy Run', target: '6 km · Easy', kind: 'Easy', done: false },
    { day: 'Sun', type: 'Long Run', target: '18 km · Easy', kind: 'Long', done: false },
  ],
  activities: [
    { date: 'Sep 28', type: 'Easy Run', distance: 8, duration: 49, rpe: 4 },
    { date: 'Sep 26', type: 'Long Run', distance: 16, duration: 106, rpe: 5 },
    { date: 'Sep 24', type: 'Tempo Run', distance: 7, duration: 43, rpe: 7 },
  ],
  restriction: 'No hard session on consecutive days',
};
let state = JSON.parse(localStorage.getItem(KEY) || 'null') || seed;
let page = 'overview';
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
const fmt = n => new Intl.NumberFormat('id-ID').format(n);
const daysUntil = () => Math.max(0, Math.ceil((new Date(state.goal.date) - new Date()) / 86400000));
const weekStats = () => {
  const planned = state.plan.filter(x => x.kind !== 'Rest').length;
  const complete = state.plan.filter(x => x.done && x.kind !== 'Rest').length;
  const plannedKm = state.plan.reduce((n,x) => n + (Number(x.target.match(/\d+(?:\.\d+)?/)?.[0]) || 0), 0);
  const actualKm = state.activities.filter((_, i) => i < 3).reduce((n,x) => n+x.distance,0);
  return { planned, complete, completion: Math.round(complete/planned*100), plannedKm, actualKm };
};
function icon(name){ return `<svg aria-hidden="true"><use href="/icons.svg#${name}"/></svg>` }
function nav(){ return `<aside><div class="brand"><span class="brand-mark">H</span><span>HEALTHLIFE</span></div><p class="label">SELF-COACHING</p>${[['overview','Overview','home'],['plan','Training plan','calendar'],['activities','Activities','activity'],['progress','Progress','chart'],['settings','Profile','user']].map(([id,label,i])=>`<button class="nav ${page===id?'active':''}" data-page="${id}">${icon(i)}${label}</button>`).join('')}<div class="nav-foot"><div class="avatar">MA</div><div><b>Mufti Azhar</b><small>Recreational runner</small></div></div></aside>` }
function top(){ return `<header><div><p class="eyebrow">WEEK 8 · BUILD PHASE</p><h1>${page==='overview'?'Keep the rhythm.':page==='plan'?'Your training plan':page==='activities'?'Activity log':page==='progress'?'Training progress':'Athlete profile'}</h1></div><button class="bell" aria-label="Notifications">${icon('bell')}</button></header>` }
function overview(){const s=weekStats(); const today=state.plan[2]; return `<main class="grid"><section class="today card"><div class="section-head"><div><p class="eyebrow">TODAY · WEDNESDAY</p><h2>${today.type}</h2></div><span class="pill ${today.kind.toLowerCase()}">${today.kind}</span></div><div class="session-target">${today.target}</div><p class="muted">Build resilient legs and a stable core. Keep it controlled — tomorrow's tempo session matters.</p><div class="session-actions"><button class="primary" data-action="complete" ${today.done?'disabled':''}>${today.done?'Completed':'Mark complete'}</button><button class="ghost" data-page="plan">View plan</button></div></section><section class="race card dark"><p class="eyebrow">NEXT GOAL</p><h2>${state.goal.race}</h2><p>${state.goal.distance} km · ${state.goal.target}</p><div class="race-number">${fmt(daysUntil())}<span>days to race</span></div><div class="progress-bar"><i style="width:58%"></i></div><small>58% of your plan completed</small></section><section class="metrics">${metric('Completion',`${s.completion}%`,`${s.complete} of ${s.planned} sessions`,'up')}${metric('This week',`${s.actualKm} km`,`of ${s.plannedKm} km planned`,'neutral')}${metric('Longest run','16 km','Sep 26 · Easy effort','up')}</section><section class="card chart-card"><div class="section-head"><div><p class="eyebrow">VOLUME</p><h2>Weekly distance</h2></div><button class="text">Last 8 weeks</button></div><div class="chart"><div class="bars">${[25,30,34,28,38,42,39,24].map((v,i)=>`<div><i style="height:${v*2}px" class="${i===7?'current':''}"></i><small>W${i+1}</small></div>`).join('')}</div><div class="chart-value"><b>24 km</b><span>This week so far</span></div></div></section><section class="card review"><p class="eyebrow">WEEKLY COACHING REVIEW</p><h2>${s.completion >= 80 ? 'Your consistency is on track.' : 'Protect this week’s consistency.'}</h2><p class="muted">${s.completion >=80?'You completed the important sessions. Maintain the planned load and prioritise sleep before the long run.':'You are below the 80% completion target. Do not add missed intensity sessions; resume with the next planned workout.'}</p><div class="rule">${icon('shield')} Coaching rule: ${state.restriction}</div></section></main>`}
function metric(label,val,sub,trend){return `<article class="metric card"><p>${label}</p><strong>${val}</strong><small class="${trend}">${sub}</small></article>`}
function plan(){return `<main><section class="card plan-hero"><div><p class="eyebrow">${state.goal.race.toUpperCase()}</p><h2>Week 8 · Build</h2><p class="muted">Progressively build aerobic endurance while protecting recovery.</p></div><div class="phase"><span>Base</span><span class="active">Build</span><span>Peak</span><span>Taper</span></div></section><section class="session-list">${state.plan.map((x,i)=>`<article class="session card"><div class="day">${x.day}</div><div class="session-main"><b>${x.type}</b><span>${x.target}</span></div><span class="pill ${x.kind.toLowerCase()}">${x.kind}</span><button class="check ${x.done?'checked':''}" data-toggle="${i}" aria-label="Toggle ${x.type}">${x.done?'✓':''}</button></article>`).join('')}</section></main>`}
function activities(){return `<main><section class="card add-activity"><div><p class="eyebrow">ACTIVITY TRACKING</p><h2>Log an activity</h2></div><form id="activity-form"><select name="type"><option>Easy Run</option><option>Tempo Run</option><option>Long Run</option><option>Cycling</option></select><input name="distance" type="number" min="0.1" step="0.1" placeholder="Distance (km)" required><input name="duration" type="number" min="1" placeholder="Minutes" required><select name="rpe"><option value="3">RPE 3 · Easy</option><option value="5">RPE 5 · Steady</option><option value="7">RPE 7 · Hard</option></select><button class="primary">Save activity</button></form></section><section class="card table"><div class="section-head"><div><p class="eyebrow">HISTORY</p><h2>Recent activities</h2></div><span>${state.activities.length} recorded</span></div><div class="table-head"><span>Date</span><span>Activity</span><span>Distance</span><span>Duration</span><span>Effort</span></div>${state.activities.map(x=>`<div class="table-row"><span>${x.date}</span><b>${x.type}</b><span>${x.distance} km</span><span>${x.duration} min</span><span><i class="rpe r${x.rpe}"></i> ${x.rpe}/10</span></div>`).join('')}</section></main>`}
function progress(){const s=weekStats();return `<main class="progress-page"><section class="card readiness"><p class="eyebrow">TRAINING PREPARATION</p><h2>Building toward ${state.goal.race}</h2><div class="readiness-grid"><div><strong>${s.completion}%</strong><span>plan completion</span></div><div><strong>${s.actualKm} km</strong><span>this week</span></div><div><strong>16 km</strong><span>longest activity</span></div><div><strong>${fmt(daysUntil())}</strong><span>days remaining</span></div></div><p class="muted">This is a training summary, not a medical readiness assessment.</p></section><section class="card"><p class="eyebrow">COACHING SIGNALS</p><h2>What to focus on next</h2><ul class="signals"><li>${icon('check')} Keep easy sessions genuinely easy.</li><li>${icon('check')} Complete the long run only if recovery feels normal.</li><li>${icon('check')} Avoid compensating for missed intensity work.</li></ul></section></main>`}
function settings(){return `<main><section class="card profile"><p class="eyebrow">ATHLETE PROFILE</p><h2>Mufti Azhar</h2><div class="profile-grid"><div><span>Primary sport</span><b>Running</b></div><div><span>Experience</span><b>Recreational</b></div><div><span>Goal</span><b>${state.goal.distance} km</b></div><div><span>Race date</span><b>${new Date(state.goal.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</b></div></div></section><section class="card"><p class="eyebrow">ASSESSMENT CONSTRAINT</p><h2>Training restriction</h2><p>${state.restriction}</p><p class="muted">Assessment information supports training planning. It is not medical diagnosis.</p></section></main>`}
let deferredInstallPrompt;
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallBanner('Pasang HealthLife untuk akses lebih cepat.', 'Install', installApp);
});
function installApp(){
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; document.querySelector('.install-banner')?.remove(); });
}
function showInstallBanner(message, action, onAction){
  if (document.querySelector('.install-banner')) return;
  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.innerHTML = `<span>${message}</span><button>${action}</button><button class="dismiss" aria-label="Tutup">×</button>`;
  banner.querySelector('button').onclick = onAction;
  banner.querySelector('.dismiss').onclick = () => banner.remove();
  document.body.append(banner);
}
function maybeShowIosInstall(){
  if (isIos && !isStandalone) showInstallBanner('Di Safari: tekan Bagikan lalu “Add to Home Screen”.', 'Mengerti', () => document.querySelector('.install-banner')?.remove());
}
function render(){ document.querySelector('#app').innerHTML = `${nav()}<div class="shell">${top()}${({overview,plan,activities,progress,settings})[page]()}</div>`; bind(); }
function bind(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;render()}); document.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{state.plan[b.dataset.toggle].done=!state.plan[b.dataset.toggle].done;save();render()}); const complete=document.querySelector('[data-action="complete"]');if(complete)complete.onclick=()=>{state.plan[2].done=true;save();render()}; const form=document.querySelector('#activity-form');if(form)form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);state.activities.unshift({date:'Today',type:f.get('type'),distance:+f.get('distance'),duration:+f.get('duration'),rpe:+f.get('rpe')});save();render()}}
render();
maybeShowIosInstall();
