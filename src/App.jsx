import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');`;

/* ── CSS ─────────────────────────────────────────────────────── */
const buildCSS = (dark) => `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  ${dark ? `
  --bg:#0d0e14;--bg2:#13141c;--bg3:#1a1c27;--border:#2a2d3e;
  --text:#e8eaf0;--muted:#6b7094;--shadow:rgba(0,0,0,.4);
  ` : `
  --bg:#f0f2f8;--bg2:#ffffff;--bg3:#e8eaf2;--border:#d0d4e8;
  --text:#1a1c2e;--muted:#7880a0;--shadow:rgba(0,0,0,.08);
  `}
  --accent:#d4ff47;--accent2:#47c8ff;--red:#ff4747;--orange:#ff8c47;--green:#47ffb3;
  --font-h:'Barlow Condensed',sans-serif;--font-b:'Barlow',sans-serif;
  --radius:12px;
}
html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-b)}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
.app-layout{display:flex;height:100vh;overflow:hidden}
.sidebar{width:240px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;transition:background .2s}
.main{flex:1;overflow-y:auto;padding:32px}
.sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid var(--border)}
.sidebar-logo h1{font-family:var(--font-h);font-size:22px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--accent)}
.sidebar-logo p{font-size:11px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px}
.sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--bg3);color:var(--text)}
.nav-item.active{background:rgba(212,255,71,.12);color:var(--accent)}
.nav-sub{padding-left:16px;display:flex;flex-direction:column;gap:2px;margin-top:2px}
.nav-sub-item{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.nav-sub-item:hover{background:var(--bg3);color:var(--text)}
.nav-sub-item.active{background:rgba(212,255,71,.08);color:var(--accent)}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border)}
.user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:var(--bg3)}
.user-chip .avatar{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#0d0e14;flex-shrink:0}
.user-chip .info{flex:1;min-width:0}
.user-chip .name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-chip .role{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:0 2px 8px var(--shadow)}
.card-sm{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:0 2px 8px var(--shadow)}
.stat-card .label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:8px}
.stat-card .value{font-family:var(--font-h);font-size:36px;font-weight:700;line-height:1}
.stat-card .unit{font-size:13px;color:var(--muted);margin-left:4px}
.stat-card .delta{font-size:12px;margin-top:6px;color:var(--muted)}
.stat-card.accent .value{color:var(--accent)}
.stat-card.blue .value{color:var(--accent2)}
.stat-card.orange .value{color:var(--orange)}
.stat-card.green .value{color:var(--green)}
.page-header{margin-bottom:28px}
.page-header h2{font-family:var(--font-h);font-size:32px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.page-header p{color:var(--muted);font-size:14px;margin-top:4px}
.section-title{font-family:var(--font-h);font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:14px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:var(--font-b)}
.btn-primary{background:var(--accent);color:#0d0e14}.btn-primary:hover{background:#bcee35}
.btn-secondary{background:var(--bg3);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{background:var(--border)}
.btn-danger{background:rgba(255,71,71,.15);color:var(--red);border:1px solid rgba(255,71,71,.3)}.btn-danger:hover{background:rgba(255,71,71,.25)}
.btn-sm{padding:6px 14px;font-size:13px}
.btn:disabled{opacity:.4;cursor:not-allowed}
.form-group{margin-bottom:16px}
.form-label{display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:6px}
.form-input{width:100%;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:var(--font-b);outline:none;transition:border-color .15s}
.form-input:focus{border-color:var(--accent)}
.form-textarea{width:100%;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:var(--font-b);outline:none;resize:vertical;min-height:80px;transition:border-color .15s}
.form-textarea:focus{border-color:var(--accent)}
.form-select{width:100%;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:var(--font-b);outline:none}
/* Monthly planning */
.month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.month-day-header{font-family:var(--font-h);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);text-align:center;padding:6px 0}
.month-day-cell{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:8px;min-height:100px;position:relative;transition:border-color .15s}
.month-day-cell.today{border-color:var(--accent)}
.month-day-cell.other-month{opacity:.3}
.month-day-cell.drag-over{border-color:var(--accent2);background:rgba(71,200,255,.06)}
.month-day-cell .day-num{font-family:var(--font-h);font-size:13px;font-weight:700;color:var(--muted);margin-bottom:4px}
.month-day-cell.today .day-num{color:var(--accent)}
.month-session-pill{border-radius:3px;padding:3px 6px;margin-bottom:3px;font-size:10px;cursor:grab;border-left:2px solid var(--accent);background:rgba(212,255,71,.08);user-select:none;position:relative}
.month-session-pill:active{cursor:grabbing;opacity:.7}
.month-session-pill:hover{background:rgba(212,255,71,.15)}
.month-session-pill.endurance{border-color:var(--accent2);background:rgba(71,200,255,.08)}
.month-session-pill.vitesse{border-color:var(--orange);background:rgba(255,140,71,.08)}
.month-session-pill.recuperation{border-color:var(--muted);background:rgba(107,112,148,.08)}
.month-session-pill.compet{border-color:var(--red);background:rgba(255,71,71,.08)}
.month-session-pill .stype{font-weight:700;font-size:9px;text-transform:uppercase;color:var(--accent)}
.month-session-pill.endurance .stype{color:var(--accent2)}
.month-session-pill.vitesse .stype{color:var(--orange)}
.month-session-pill.recuperation .stype{color:var(--muted)}
.month-session-pill.compet .stype{color:var(--red)}
/* Week charge bar */
.charge-bar-wrap{display:flex;gap:4px;align-items:flex-end;height:40px;margin-top:8px}
.charge-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
.charge-bar{width:100%;border-radius:3px 3px 0 0;transition:height .3s,background .3s;min-height:2px}
.charge-bar-label{font-size:9px;color:var(--muted)}
/* Week grid coach */
.week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
.day-col{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;min-height:140px;position:relative}
.day-col .day-label{font-family:var(--font-h);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px}
.day-col.today{border-color:var(--accent)}.day-col.today .day-label{color:var(--accent)}
.session-pill{background:var(--bg3);border-left:3px solid var(--accent);border-radius:4px;padding:6px 8px;margin-bottom:6px;font-size:12px;cursor:pointer;position:relative}
.session-pill:hover{background:var(--border)}
.session-pill .stype{font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--accent)}
.session-pill.endurance{border-color:var(--accent2)}.session-pill.endurance .stype{color:var(--accent2)}
.session-pill.vitesse{border-color:var(--orange)}.session-pill.vitesse .stype{color:var(--orange)}
.session-pill.recuperation{border-color:var(--muted)}.session-pill.recuperation .stype{color:var(--muted)}
.session-pill.compet{border-color:var(--red)}.session-pill.compet .stype{color:var(--red)}
/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:28px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.modal-header h3{font-family:var(--font-h);font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:22px;padding:4px;line-height:1}
/* Messages */
.messages-wrap{display:flex;flex-direction:column;height:calc(100vh - 200px)}
.messages-list{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.message-bubble{max-width:70%}
.message-bubble.own{align-self:flex-end}
.message-bubble.other{align-self:flex-start}
.bubble-inner{padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.5}
.own .bubble-inner{background:var(--accent);color:#0d0e14;border-bottom-right-radius:3px}
.other .bubble-inner{background:var(--bg3);border:1px solid var(--border);border-bottom-left-radius:3px}
.bubble-meta{font-size:11px;color:var(--muted);margin-top:4px;padding:0 4px}
.own .bubble-meta{text-align:right}
.messages-input{display:flex;gap:10px;padding:16px;border-top:1px solid var(--border)}
.messages-input input{flex:1;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:var(--font-b);outline:none}
.messages-input input:focus{border-color:var(--accent)}
/* Auth */
.auth-page{height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.auth-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:40px;width:100%;max-width:420px;box-shadow:0 8px 32px var(--shadow)}
.auth-logo{text-align:center;margin-bottom:32px}
.auth-logo h1{font-family:var(--font-h);font-size:36px;font-weight:800;letter-spacing:3px;color:var(--accent);text-transform:uppercase}
.auth-tabs{display:flex;background:var(--bg3);border-radius:8px;padding:4px;margin-bottom:24px}
.auth-tab{flex:1;padding:8px;text-align:center;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;color:var(--muted);border:none;background:none;font-family:var(--font-b);transition:all .15s}
.auth-tab.active{background:var(--accent);color:#0d0e14}
/* Misc */
.athlete-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:all .15s}
.athlete-item:hover{background:var(--bg3)}
.athlete-item.selected{background:rgba(212,255,71,.08);border-color:rgba(212,255,71,.3)}
.athlete-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.flex-between{display:flex;align-items:center;justify-content:space-between}
.flex-gap{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.mt-8{margin-top:8px}.mt-16{margin-top:16px}.mt-24{margin-top:24px}.mb-16{margin-bottom:16px}.mb-24{margin-bottom:24px}
.text-muted{color:var(--muted);font-size:13px}.text-sm{font-size:13px}.w-full{width:100%}
.alert{padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px}
.alert-error{background:rgba(255,71,71,.1);border:1px solid rgba(255,71,71,.3);color:#ff8a8a}
.alert-success{background:rgba(212,255,71,.1);border:1px solid rgba(212,255,71,.3);color:var(--accent)}
.alert-warning{background:rgba(255,140,71,.1);border:1px solid rgba(255,140,71,.3);color:var(--orange)}
.alert-info{background:rgba(71,200,255,.1);border:1px solid rgba(71,200,255,.3);color:var(--accent2)}
.history-list{display:flex;flex-direction:column;gap:8px}
.history-item{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:border-color .15s}
.history-item:hover{border-color:var(--accent)}
.history-left{display:flex;align-items:center;gap:14px}
.history-date{font-family:var(--font-h);font-size:20px;font-weight:700;color:var(--accent);min-width:60px}
.history-info .title{font-weight:600;font-size:14px}
.history-info .sub{font-size:12px;color:var(--muted);margin-top:2px}
.history-right{display:flex;align-items:center;gap:12px;font-size:13px}
.race-card{background:linear-gradient(135deg,rgba(212,255,71,.08),rgba(71,200,255,.05));border:1px solid rgba(212,255,71,.3);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px}
.race-countdown{font-family:var(--font-h);font-size:80px;font-weight:800;color:var(--accent);line-height:1}
.race-name{font-family:var(--font-h);font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-top:8px}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.badge-green{background:rgba(212,255,71,.15);color:var(--accent)}
.badge-red{background:rgba(255,71,71,.15);color:var(--red)}
.badge-orange{background:rgba(255,140,71,.15);color:var(--orange)}
.badge-gray{background:var(--bg3);color:var(--muted)}
.badge-blue{background:rgba(71,200,255,.15);color:var(--accent2)}
.injury-item{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:10px}
.injury-item.active{border-color:var(--red)}
.injury-item.resolved{border-color:rgba(212,255,71,.2);opacity:.7}
/* Charts */
.chart-bar-wrap{display:flex;flex-direction:column;gap:10px}
.chart-bar-row{display:flex;align-items:center;gap:10px}
.chart-bar-label{font-size:11px;color:var(--muted);min-width:56px;text-align:right;flex-shrink:0}
.chart-bar-track{flex:1;height:8px;background:var(--bg3);border-radius:4px;overflow:hidden}
.chart-bar-fill{height:100%;border-radius:4px;transition:width .4s ease}
.chart-bar-val{font-size:12px;font-weight:600;min-width:52px;font-family:var(--font-h)}
.donut-wrap{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.donut-legend{display:flex;flex-direction:column;gap:8px;flex:1;min-width:120px}
.donut-legend-item{display:flex;align-items:center;gap:8px;font-size:13px}
.donut-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
/* Template pills */
.template-card{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s;position:relative}
.template-card:hover{border-color:var(--accent);background:rgba(212,255,71,.06)}
/* Notification banner */
.notif-bar{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}
.notif-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
/* Pace badge */
.pace-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;background:rgba(71,200,255,.12);color:var(--accent2);font-size:11px;font-weight:600;font-family:var(--font-h)}
/* Theme toggle */
.theme-toggle{background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:4px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--muted);transition:all .15s}
.theme-toggle:hover{border-color:var(--accent);color:var(--accent)}
/* Mobile nav */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--bg2);border-top:1px solid var(--border);z-index:50;padding:8px 0 max(8px,env(safe-area-inset-bottom))}
.mobile-nav-inner{display:flex;justify-content:space-around}
.mobile-nav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 12px;border:none;background:none;color:var(--muted);cursor:pointer;font-size:10px;font-family:var(--font-b);border-radius:8px;transition:all .15s}
.mobile-nav-btn.active{color:var(--accent)}
.mobile-nav-btn span:first-child{font-size:20px}
/* PDF print */
@media print{
  .sidebar,.mobile-nav,.btn,.modal-overlay{display:none!important}
  .main{padding:0!important;overflow:visible!important}
  .app-layout{height:auto!important;overflow:visible!important}
  .month-day-cell{break-inside:avoid}
  body{background:white!important;color:black!important}
}
@media(max-width:768px){
  .sidebar{display:none}
  .mobile-nav{display:block}
  .main{padding:16px;padding-bottom:80px}
  .week-grid{grid-template-columns:repeat(3,1fr)}
  .stats-grid{grid-template-columns:1fr 1fr}
  .grid-2{grid-template-columns:1fr}
  .month-day-cell{min-height:60px;padding:4px}
  .month-day-cell .day-num{font-size:11px}
  .race-countdown{font-size:56px}
}
`;

/* ── Constants ───────────────────────────────────────────────── */
const JOURS=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const TYPES_SESSION=["Endurance","Fractionné","Tempo","Côtes","Récupération","Sortie longue","Compétition","Repos"];
const TYPE_COLORS={Endurance:"endurance",Fractionné:"vitesse",Tempo:"vitesse",Côtes:"vitesse",Récupération:"recuperation","Sortie longue":"endurance",Compétition:"compet",Repos:"recuperation"};
const TYPE_PALETTE={Endurance:"#47c8ff",Fractionné:"#ff8c47",Tempo:"#ff6b47",Côtes:"#ffb347",Récupération:"#6b7094","Sortie longue":"#47ffb3",Compétition:"#ff4747",Repos:"#3a3d52"};
const DEFAULT_TEMPLATES=[
  {id:"t1",title:"Endurance fondamentale",type:"Endurance",distance:12,duration:70,denivele:0,description:"Allure conversation, 70-75% FCmax. Objectif: développement aérobie de base."},
  {id:"t2",title:"Fractionné court",type:"Fractionné",distance:8,duration:50,denivele:0,description:"10×400m récup 1'30. Allure 5km. Objectif: VMA et économie de course."},
  {id:"t3",title:"Sortie longue trail",type:"Sortie longue",distance:25,duration:180,denivele:800,description:"Allure endurance active, gestion du dénivelé. Ravitaillement toutes les heures."},
  {id:"t4",title:"Côtes explosives",type:"Côtes",distance:6,duration:45,denivele:300,description:"8×150m en montée, descente récup. Développement force et puissance spécifique trail."},
  {id:"t5",title:"Récupération active",type:"Récupération",distance:6,duration:40,denivele:0,description:"Très allure lente, <65% FCmax. Accélération de la récupération musculaire."},
  {id:"t6",title:"Tempo progressif",type:"Tempo",distance:14,duration:75,denivele:100,description:"4km échauffement + 6km allure seuil + 4km retour. Développement seuil lactique."},
];

const initials=n=>n?n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2):"?";
const formatDate=d=>new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
const isToday=d=>new Date().toDateString()===d.toDateString();
function getWeekDates(offset=0){const today=new Date(),mon=new Date(today);mon.setDate(today.getDate()-today.getDay()+1+offset*7);return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d;});}
function daysUntil(dateStr){const t=new Date(dateStr),n=new Date();n.setHours(0,0,0,0);t.setHours(0,0,0,0);return Math.ceil((t-n)/(1000*60*60*24));}
function getMonthDates(year,month){
  const firstDay=new Date(year,month,1);
  let startDow=firstDay.getDay();startDow=startDow===0?6:startDow-1;
  const lastDay=new Date(year,month+1,0);
  const cells=[];
  for(let i=0;i<startDow;i++){const d=new Date(year,month,1-(startDow-i));cells.push({date:d,currentMonth:false});}
  for(let d=1;d<=lastDay.getDate();d++) cells.push({date:new Date(year,month,d),currentMonth:true});
  while(cells.length%7!==0){const last=cells[cells.length-1].date;const next=new Date(last);next.setDate(last.getDate()+1);cells.push({date:next,currentMonth:false});}
  return cells;
}
// TSS simplifié : RPE * durée(h) * facteur type
const TYPE_FACTOR={Endurance:1,Fractionné:2.5,Tempo:2,Côtes:2.2,Récupération:0.5,"Sortie longue":1.4,Compétition:3,Repos:0};
function computeLoad(s){
  const dur=Number(s.actual_duration||s.duration||0)/60;
  const rpe=Number(s.rpe||5);
  const factor=TYPE_FACTOR[s.type]||1;
  return Math.round(dur*rpe*factor*10);
}
function calcPace(dist,dur){
  if(!dist||!dur) return null;
  const paceMin=Number(dur)/Number(dist);
  const m=Math.floor(paceMin),s=Math.round((paceMin-m)*60);
  return `${m}'${String(s).padStart(2,"0")}"`;
}

/* ── Charts ──────────────────────────────────────────────────── */
function DonutChart({data}){
  const total=data.reduce((a,d)=>a+d.value,0);
  if(!total) return <p className="text-muted">Pas encore de données</p>;
  let cumAngle=-90;
  const r=60,cx=80,cy=80;
  const slices=data.map(d=>{
    const pct=d.value/total,angle=pct*360,start=cumAngle;
    cumAngle+=angle;
    const sr=(start*Math.PI)/180,er=((start+angle)*Math.PI)/180;
    const x1=cx+r*Math.cos(sr),y1=cy+r*Math.sin(sr),x2=cx+r*Math.cos(er),y2=cy+r*Math.sin(er);
    return{...d,path:`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle>180?1:0} 1 ${x2} ${y2} Z`,pct:Math.round(pct*100)};
  });
  return(
    <div className="donut-wrap">
      <svg width="160" height="160" style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={0.9}><title>{s.label}: {s.value} ({s.pct}%)</title></path>)}
        <circle cx={cx} cy={cy} r={r-24} fill="var(--bg2)"/>
        <text x={cx} y={cy-8} textAnchor="middle" fill="var(--accent)" fontFamily="'Barlow Condensed',sans-serif" fontSize="24" fontWeight="700">{total}</text>
        <text x={cx} y={cy+12} textAnchor="middle" fill="var(--muted)" fontFamily="'Barlow',sans-serif" fontSize="10">séances</text>
      </svg>
      <div className="donut-legend">
        {slices.filter(s=>s.value>0).map((s,i)=>(
          <div key={i} className="donut-legend-item">
            <div className="donut-dot" style={{background:s.color}}/>
            <span style={{flex:1}}>{s.label}</span>
            <span style={{fontFamily:"var(--font-h)",fontWeight:700,color:s.color}}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function BarChart({data,color="var(--accent)",unit="km"}){
  if(!data.length) return <p className="text-muted">Pas encore de données</p>;
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div className="chart-bar-wrap">
      {data.map((d,i)=>(
        <div key={i} className="chart-bar-row">
          <span className="chart-bar-label">{d.label}</span>
          <div className="chart-bar-track"><div className="chart-bar-fill" style={{width:`${(d.value/max)*100}%`,background:color}}/></div>
          <span className="chart-bar-val" style={{color}}>{d.value.toFixed(0)}<span style={{fontSize:10,color:"var(--muted)",marginLeft:2}}>{unit}</span></span>
        </div>
      ))}
    </div>
  );
}

/* ── Notifications ───────────────────────────────────────────── */
function AlertsPanel({athleteId}){
  const[alerts,setAlerts]=useState([]);
  const{profile}=useApp();
  useEffect(()=>{
    const targetId=athleteId||profile?.id;
    if(!targetId) return;
    const notifs=[];
    // blessures actives
    supabase.from("injuries").select("*").eq("athlete_id",targetId).eq("statut","active").then(({data})=>{
      (data||[]).forEach(i=>notifs.push({type:"red",icon:"🩹",msg:`Blessure active : ${i.zone} (depuis ${formatDate(i.date_debut)})`}));
      // séances non validées des 7 derniers jours
      const cutoff=new Date();cutoff.setDate(cutoff.getDate()-7);
      supabase.from("sessions").select("*")
        .eq("athlete_id",targetId)
        .gte("date",cutoff.toISOString().slice(0,10))
        .lt("date",new Date().toISOString().slice(0,10))
        .not("type","eq","Repos")
        .is("completed",null)
        .then(({data:s})=>{
          if((s||[]).length>0) notifs.push({type:"orange",icon:"⚠️",msg:`${s.length} séance${s.length>1?"s":""} non validée${s.length>1?"s":""} cette semaine`});
          setAlerts([...notifs]);
        });
    });
  },[athleteId]);
  if(!alerts.length) return null;
  return(
    <div style={{marginBottom:20}}>
      {alerts.map((a,i)=>(
        <div key={i} className="notif-bar">
          <div className="notif-dot" style={{background:a.type==="red"?"var(--red)":"var(--orange)"}}/>
          <span>{a.icon} {a.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Auth ──────────────────────────────────────────────────────── */
function AuthPage(){
  const[tab,setTab]=useState("login");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[name,setName]=useState("");
  const[role,setRole]=useState("athlete");
  const[coachCode,setCoachCode]=useState("");
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");
  async function handleLogin(e){e.preventDefault();setLoading(true);setError("");const{error}=await supabase.auth.signInWithPassword({email,password});if(error) setError("Email ou mot de passe incorrect.");setLoading(false);}
  async function handleRegister(e){
    e.preventDefault();setLoading(true);setError("");setSuccess("");
    let coachId=null;
    if(role==="athlete"){
      if(!coachCode.trim()){setError("Entre le code de ton coach.");setLoading(false);return;}
      const{data:coach}=await supabase.from("profiles").select("id").eq("coach_code",coachCode.trim().toUpperCase()).single();
      if(!coach){setError("Code coach introuvable.");setLoading(false);return;}
      coachId=coach.id;
    }
    const{data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      const code=role==="coach"?Math.random().toString(36).substring(2,8).toUpperCase():null;
      await supabase.from("profiles").insert({id:data.user.id,email,full_name:name,role,coach_id:coachId,coach_code:code});
      setSuccess("Compte créé ! Tu peux maintenant te connecter.");setTab("login");
    }
    setLoading(false);
  }
  return(
    <div className="auth-page"><div className="auth-card">
      <div className="auth-logo"><h1>⛰️ TrailCoach</h1><p style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Plateforme coach · athlète</p></div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={()=>setTab("login")}>Connexion</button>
        <button className={`auth-tab ${tab==="register"?"active":""}`} onClick={()=>setTab("register")}>Inscription</button>
      </div>
      {error&&<div className="alert alert-error">{error}</div>}
      {success&&<div className="alert alert-success">{success}</div>}
      {tab==="login"?(
        <form onSubmit={handleLogin}>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Mot de passe</label><input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
          <button className="btn btn-primary w-full" style={{justifyContent:"center"}} disabled={loading}>{loading?<span className="spinner"/>:"Se connecter"}</button>
        </form>
      ):(
        <form onSubmit={handleRegister}>
          <div className="form-group"><label className="form-label">Nom complet</label><input className="form-input" value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Mot de passe (6 car. min)</label><input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/></div>
          <div className="form-group"><label className="form-label">Je suis</label><select className="form-select" value={role} onChange={e=>setRole(e.target.value)}><option value="athlete">Athlète</option><option value="coach">Coach</option></select></div>
          {role==="athlete"&&<div className="form-group"><label className="form-label">Code coach</label><input className="form-input" value={coachCode} onChange={e=>setCoachCode(e.target.value)} placeholder="Demande le code à ton coach" required/></div>}
          <button className="btn btn-primary w-full" style={{justifyContent:"center"}} disabled={loading}>{loading?<span className="spinner"/>:"Créer mon compte"}</button>
        </form>
      )}
    </div></div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({nav,active,setActive,statsSubPage,setStatsSubPage,dark,setDark}){
  const{profile}=useApp();
  const statsSubs=[{id:"overview",label:"Vue d'ensemble"},{id:"volume",label:"Volume km"},{id:"denivele",label:"Dénivelé"},{id:"typologies",label:"Typologies"},{id:"forme",label:"Forme / Fatigue"}];
  return(
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>⛰️ TrailCoach</h1>
        <p style={{color:"var(--muted)",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{profile?.role==="coach"?"Espace Coach":"Espace Athlète"}</p>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item=>(
          <div key={item.id}>
            <button className={`nav-item ${active===item.id?"active":""}`} onClick={()=>setActive(item.id)}><span>{item.icon}</span>{item.label}</button>
            {item.id==="stats"&&active==="stats"&&(
              <div className="nav-sub">
                {statsSubs.map(sp=><button key={sp.id} className={`nav-sub-item ${statsSubPage===sp.id?"active":""}`} onClick={()=>setStatsSubPage(sp.id)}>· {sp.label}</button>)}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip"><div className="avatar">{initials(profile?.full_name)}</div><div className="info"><div className="name">{profile?.full_name}</div><div className="role">{profile?.role}</div></div></div>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button className="theme-toggle" onClick={()=>setDark(d=>!d)}>{dark?"☀️ Clair":"🌙 Sombre"}</button>
          <button className="btn btn-secondary btn-sm" style={{flex:1,justifyContent:"center"}} onClick={()=>supabase.auth.signOut()}>Déco.</button>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Nav ──────────────────────────────────────────────── */
function MobileNav({nav,active,setActive}){
  const topNav=nav.slice(0,5);
  return(
    <div className="mobile-nav">
      <div className="mobile-nav-inner">
        {topNav.map(item=>(
          <button key={item.id} className={`mobile-nav-btn ${active===item.id?"active":""}`} onClick={()=>setActive(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label.replace("Mon ","").replace("Mes ","")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Session Modal ───────────────────────────────────────────── */
function SessionModal({session,onClose,onSave,athleteId,date,template}){
  const init=template?{title:template.title,type:template.type,description:template.description,distance:template.distance||"",duration:template.duration||"",denivele:template.denivele||"",date:date?date.toISOString().slice(0,10):new Date().toISOString().slice(0,10),athlete_id:athleteId||""}
    :session||{title:"",type:"Endurance",description:"",distance:"",duration:"",denivele:"",date:date?date.toISOString().slice(0,10):new Date().toISOString().slice(0,10),athlete_id:athleteId||""};
  const[form,setForm]=useState(init);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const pace=calcPace(form.distance,form.duration);
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header"><h3>{session?"Modifier séance":"Nouvelle séance"}</h3><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="form-group"><label className="form-label">Titre *</label><input className="form-input" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Ex: 10km endurance fondamentale"/></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>set("type",e.target.value)}>{TYPES_SESSION.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
        </div>
        <div className="grid-3">
          <div className="form-group"><label className="form-label">Distance (km)</label><input className="form-input" type="number" step="0.1" value={form.distance} onChange={e=>set("distance",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Durée (min)</label><input className="form-input" type="number" value={form.duration} onChange={e=>set("duration",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">D+ (m)</label><input className="form-input" type="number" value={form.denivele} onChange={e=>set("denivele",e.target.value)}/></div>
        </div>
        {pace&&<div style={{marginBottom:16}}><span className="pace-chip">⚡ {pace} /km</span><span style={{fontSize:12,color:"var(--muted)",marginLeft:8}}>allure calculée</span></div>}
        <div className="form-group"><label className="form-label">Description / Contenu</label><textarea className="form-textarea" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Contenu détaillé de la séance..."/></div>
        <div className="flex-gap" style={{justifyContent:"flex-end"}}><button className="btn btn-secondary" onClick={onClose}>Annuler</button><button className="btn btn-primary" onClick={()=>{if(form.title){onSave(form);onClose();}}}>Enregistrer</button></div>
      </div>
    </div>
  );
}

/* ── Feedback Modal ──────────────────────────────────────────── */
function FeedbackModal({session,onClose,onSave}){
  const[rpe,setRpe]=useState(session.rpe||5);
  const[dist,setDist]=useState(session.actual_distance||session.distance||"");
  const[dur,setDur]=useState(session.actual_duration||session.duration||"");
  const[comment,setComment]=useState(session.athlete_comment||"");
  const[done,setDone]=useState(session.completed??true);
  const rc=v=>v<=2?"#47ff8a":v<=4?"#d4ff47":v<=6?"#47c8ff":v<=8?"#ff8c47":"#ff4747";
  const pace=calcPace(dist,dur);
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header"><h3>Retour séance</h3><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="card-sm mb-16" style={{background:"var(--bg3)"}}><div style={{fontWeight:600,marginBottom:4}}>{session.title}</div><div className="text-muted">{formatDate(session.date)} · {session.type}</div>{session.description&&<div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>{session.description}</div>}</div>
        <div className="form-group"><label className="form-label">Séance effectuée ?</label><div className="flex-gap"><button className={`btn btn-sm ${done?"btn-primary":"btn-secondary"}`} onClick={()=>setDone(true)}>✓ Oui</button><button className={`btn btn-sm ${!done?"btn-danger":"btn-secondary"}`} onClick={()=>setDone(false)}>✗ Non / Partiel</button></div></div>
        <div className="form-group">
          <label className="form-label">RPE ressenti — {rpe}/10</label>
          <input type="range" min={1} max={10} value={rpe} onChange={e=>setRpe(Number(e.target.value))} style={{width:"100%",accentColor:rc(rpe)}}/>
          <div className="flex-between mt-8"><span style={{fontSize:11,color:"var(--muted)"}}>Très facile</span><span style={{fontSize:20,fontWeight:700,color:rc(rpe),fontFamily:"var(--font-h)"}}>{rpe}</span><span style={{fontSize:11,color:"var(--muted)"}}>Maximal</span></div>
        </div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Distance réelle (km)</label><input className="form-input" type="number" step="0.1" value={dist} onChange={e=>setDist(e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Durée réelle (min)</label><input className="form-input" type="number" value={dur} onChange={e=>setDur(e.target.value)}/></div>
        </div>
        {pace&&<div style={{marginBottom:16}}><span className="pace-chip">⚡ {pace} /km</span></div>}
        <div className="form-group"><label className="form-label">Commentaire</label><textarea className="form-textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ressentis, conditions, douleurs..."/></div>
        <div className="flex-gap" style={{justifyContent:"flex-end"}}><button className="btn btn-secondary" onClick={onClose}>Annuler</button><button className="btn btn-primary" onClick={()=>{onSave({rpe,actual_distance:dist,actual_duration:dur,athlete_comment:comment,completed:done});onClose();}}>Valider</button></div>
      </div>
    </div>
  );
}

/* ── Templates Modal ─────────────────────────────────────────── */
function TemplatesModal({onClose,onSelect}){
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:640}}>
        <div className="modal-header"><h3>📋 Templates de séances</h3><button className="modal-close" onClick={onClose}>✕</button></div>
        <p className="text-muted mb-16">Clique sur un template pour pré-remplir la séance. Tu pourras modifier tous les champs.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {DEFAULT_TEMPLATES.map(t=>(
            <div key={t.id} className="template-card" onClick={()=>{onSelect(t);onClose();}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:TYPE_PALETTE[t.type]||"var(--muted)",fontFamily:"var(--font-h)"}}>{t.type}</span>
                {t.distance&&<span className="badge badge-gray">{t.distance}km</span>}
                {t.denivele>0&&<span className="badge badge-blue">D+{t.denivele}</span>}
              </div>
              <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{t.title}</div>
              <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.4}}>{t.description.slice(0,80)}…</div>
              {t.duration&&<div style={{marginTop:6}}><span className="pace-chip">⚡ {calcPace(t.distance,t.duration)} /km</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Charge hebdo indicator ──────────────────────────────────── */
function ChargeIndicator({sessions}){
  // Calcule la charge par jour de la semaine courante
  const today=new Date();
  const weekStart=new Date(today);weekStart.setDate(today.getDate()-((today.getDay()+6)%7));
  const days=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d;});
  const charges=days.map(d=>{
    const dateStr=d.toISOString().slice(0,10);
    const daySessions=sessions.filter(s=>s.date===dateStr);
    return{day:JOURS[days.indexOf(d)],load:daySessions.reduce((a,s)=>a+computeLoad(s),0),isToday:isToday(d)};
  });
  const totalLoad=charges.reduce((a,c)=>a+c.load,0);
  const maxLoad=Math.max(...charges.map(c=>c.load),1);
  const loadColor=totalLoad>600?"var(--red)":totalLoad>350?"var(--orange)":"var(--accent)";
  return(
    <div className="card-sm mb-24" style={{background:"var(--bg2)"}}>
      <div className="flex-between mb-8">
        <div style={{fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:1,color:"var(--muted)"}}>Charge semaine</div>
        <div style={{fontFamily:"var(--font-h)",fontSize:22,fontWeight:700,color:loadColor}}>{totalLoad} <span style={{fontSize:12,fontWeight:400,color:"var(--muted)"}}>UA</span></div>
      </div>
      <div className="charge-bar-wrap">
        {charges.map((c,i)=>(
          <div key={i} className="charge-bar-col">
            <div className="charge-bar" style={{height:`${Math.max(c.load/maxLoad*36,c.load>0?4:2)}px`,background:c.isToday?loadColor:"var(--border)"}}/>
            <span className="charge-bar-label" style={{color:c.isToday?loadColor:"var(--muted)"}}>{c.day}</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>{totalLoad<200?"Semaine légère — bonne récupération":totalLoad<400?"Charge modérée — idéale":totalLoad<600?"Charge élevée — surveille la fatigue":"⚠️ Charge très élevée — prévois du repos"}</div>
    </div>
  );
}

/* ── Monthly Planning ────────────────────────────────────────── */
function MonthlyPlanning({athleteId,readonly}){
  const today=new Date();
  const[year,setYear]=useState(today.getFullYear());
  const[month,setMonth]=useState(today.getMonth());
  const[sessions,setSessions]=useState([]);
  const[modal,setModal]=useState(null);
  const[feedbackModal,setFeedbackModal]=useState(null);
  const[templateModal,setTemplateModal]=useState(null);
  const[selectedTemplate,setSelectedTemplate]=useState(null);
  const[dragId,setDragId]=useState(null);
  const{profile}=useApp();
  const cells=getMonthDates(year,month);

  useEffect(()=>{fetchSessions();},[year,month,athleteId]);
  async function fetchSessions(){
    const from=new Date(year,month,1).toISOString().slice(0,10);
    const to=new Date(year,month+1,0).toISOString().slice(0,10);
    let q=supabase.from("sessions").select("*").gte("date",from).lte("date",to).order("date");
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile?.role==="athlete") q=q.eq("athlete_id",profile.id);
    const{data}=await q;setSessions(data||[]);
  }
  async function saveSession(form){if(form.id) await supabase.from("sessions").update(form).eq("id",form.id);else await supabase.from("sessions").insert(form);fetchSessions();}
  async function saveFeedback(id,fb){await supabase.from("sessions").update(fb).eq("id",id);fetchSessions();}
  async function deleteSession(id){if(!confirm("Supprimer ?")) return;await supabase.from("sessions").delete().eq("id",id);fetchSessions();}
  async function moveSession(id,newDate){
    await supabase.from("sessions").update({date:newDate}).eq("id",id);
    fetchSessions();
  }

  const sfd=d=>sessions.filter(s=>s.date===d.toISOString().slice(0,10));
  const totalKm=sessions.reduce((a,s)=>a+Number(s.actual_distance||s.distance||0),0);
  const totalDPlus=sessions.reduce((a,s)=>a+Number(s.denivele||0),0);

  function prevMonth(){if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1);}
  function nextMonth(){if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1);}

  function handlePrint(){window.print();}

  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📅 Planning</h2><p>{MOIS[month]} {year}</p></div>
        <div className="flex-gap">
          <button className="btn btn-secondary btn-sm" onClick={prevMonth}>← Préc.</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>{setYear(today.getFullYear());setMonth(today.getMonth());}}>Auj.</button>
          <button className="btn btn-secondary btn-sm" onClick={nextMonth}>Suiv. →</button>
          {!readonly&&<button className="btn btn-secondary btn-sm" onClick={()=>setTemplateModal(true)}>📋 Templates</button>}
          {!readonly&&<button className="btn btn-primary btn-sm" onClick={()=>setModal({type:"create"})}>+ Séance</button>}
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>🖨️ PDF</button>
        </div>
      </div>

      <AlertsPanel athleteId={athleteId}/>

      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:20}}>
        <div className="stat-card accent"><div className="label">Volume mois</div><div className="value">{totalKm.toFixed(0)}<span className="unit">km</span></div></div>
        <div className="stat-card blue"><div className="label">D+ total</div><div className="value">{(totalDPlus/1000).toFixed(1)}<span className="unit">km D+</span></div></div>
        <div className="stat-card orange"><div className="label">Séances</div><div className="value">{sessions.filter(s=>s.type!=="Repos").length}</div></div>
      </div>

      <ChargeIndicator sessions={sessions}/>

      <div className="month-grid" style={{marginBottom:6}}>
        {JOURS.map(j=><div key={j} className="month-day-header">{j}</div>)}
      </div>
      <div className="month-grid">
        {cells.map(({date,currentMonth},i)=>{
          const ds=sfd(date);
          const dateStr=date.toISOString().slice(0,10);
          return(
            <div key={i}
              className={`month-day-cell ${isToday(date)?"today":""} ${!currentMonth?"other-month":""}`}
              onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag-over");}}
              onDragLeave={e=>e.currentTarget.classList.remove("drag-over")}
              onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove("drag-over");if(dragId) moveSession(dragId,dateStr);setDragId(null);}}>
              <div className="day-num">{date.getDate()}</div>
              {ds.map(s=>(
                <div key={s.id}
                  className={`month-session-pill ${TYPE_COLORS[s.type]||""}`}
                  draggable={!readonly}
                  onDragStart={()=>setDragId(s.id)}
                  onClick={()=>readonly?(profile?.role==="athlete"&&setFeedbackModal(s)):setModal({type:"edit",session:s})}>
                  <div className="stype">{s.type}</div>
                  <div style={{fontSize:10,marginTop:1,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                  {s.distance&&<div style={{fontSize:9,color:"var(--muted)"}}>{s.actual_distance||s.distance}km{s.denivele?` D+${s.denivele}`:""}</div>}
                  {s.distance&&s.duration&&<span className="pace-chip" style={{fontSize:8,padding:"1px 4px"}}>{calcPace(s.actual_distance||s.distance,s.actual_duration||s.duration)}</span>}
                  {s.completed!==undefined&&s.completed!==null&&<div style={{fontSize:9,marginTop:1}}>{s.completed?"✅":"⚠️"}{s.rpe?` RPE${s.rpe}`:""}</div>}
                  {!readonly&&<button style={{position:"absolute",top:2,right:2,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:10,lineHeight:1}} onClick={e=>{e.stopPropagation();deleteSession(s.id);}}>✕</button>}
                </div>
              ))}
              {!readonly&&currentMonth&&<button style={{background:"none",border:"1px dashed var(--border)",borderRadius:3,width:"100%",padding:"2px 0",color:"var(--muted)",cursor:"pointer",fontSize:10,marginTop:ds.length?3:0}} onClick={()=>setModal({type:"create",date,template:selectedTemplate})}>+</button>}
            </div>
          );
        })}
      </div>

      {templateModal&&<TemplatesModal onClose={()=>setTemplateModal(false)} onSelect={t=>{setSelectedTemplate(t);setModal({type:"create"});}}/>}
      {modal&&<SessionModal session={modal.session} date={modal.date} template={selectedTemplate} athleteId={athleteId||(profile?.role==="coach"?null:profile?.id)} onClose={()=>{setModal(null);setSelectedTemplate(null);}} onSave={saveSession}/>}
      {feedbackModal&&<FeedbackModal session={feedbackModal} onClose={()=>setFeedbackModal(null)} onSave={fb=>saveFeedback(feedbackModal.id,fb)}/>}
    </div>
  );
}

/* ── Planning semaine (coach) ────────────────────────────────── */
function Planning({athleteId,readonly}){
  const[weekOffset,setWeekOffset]=useState(0);
  const[sessions,setSessions]=useState([]);
  const[modal,setModal]=useState(null);
  const[feedbackModal,setFeedbackModal]=useState(null);
  const[templateModal,setTemplateModal]=useState(false);
  const[selectedTemplate,setSelectedTemplate]=useState(null);
  const{profile}=useApp();
  const weekDates=getWeekDates(weekOffset);
  useEffect(()=>{fetchSessions();},[weekOffset,athleteId]);
  async function fetchSessions(){
    const from=weekDates[0].toISOString().slice(0,10),to=weekDates[6].toISOString().slice(0,10);
    let q=supabase.from("sessions").select("*").gte("date",from).lte("date",to).order("date");
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile?.role==="athlete") q=q.eq("athlete_id",profile.id);
    const{data}=await q;setSessions(data||[]);
  }
  async function saveSession(form){if(form.id) await supabase.from("sessions").update(form).eq("id",form.id);else await supabase.from("sessions").insert(form);fetchSessions();}
  async function saveFeedback(id,fb){await supabase.from("sessions").update(fb).eq("id",id);fetchSessions();}
  async function deleteSession(id){if(!confirm("Supprimer ?")) return;await supabase.from("sessions").delete().eq("id",id);fetchSessions();}
  const sfd=date=>sessions.filter(s=>s.date===date.toISOString().slice(0,10));
  const totalKm=sessions.reduce((a,s)=>a+Number(s.actual_distance||s.distance||0),0);
  const totalDPlus=sessions.reduce((a,s)=>a+Number(s.denivele||0),0);
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📅 Planning</h2><p>Sem. du {formatDate(weekDates[0])} au {formatDate(weekDates[6])}</p></div>
        <div className="flex-gap">
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(w=>w-1)}>← Préc.</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(0)}>Auj.</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(w=>w+1)}>Suiv. →</button>
          {!readonly&&<button className="btn btn-secondary btn-sm" onClick={()=>setTemplateModal(true)}>📋 Templates</button>}
          {!readonly&&<button className="btn btn-primary btn-sm" onClick={()=>setModal({type:"create"})}>+ Séance</button>}
          <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ PDF</button>
        </div>
      </div>
      <AlertsPanel athleteId={athleteId}/>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:20}}>
        <div className="stat-card accent"><div className="label">Volume</div><div className="value">{totalKm.toFixed(0)}<span className="unit">km</span></div></div>
        <div className="stat-card blue"><div className="label">D+ total</div><div className="value">{(totalDPlus/1000).toFixed(1)}<span className="unit">km</span></div></div>
        <div className="stat-card orange"><div className="label">Séances</div><div className="value">{sessions.filter(s=>s.type!=="Repos").length}</div></div>
      </div>
      <ChargeIndicator sessions={sessions}/>
      <div className="week-grid">
        {weekDates.map((date,i)=>{
          const ds=sfd(date);
          return(
            <div key={i} className={`day-col ${isToday(date)?"today":""}`}>
              <div className="day-label">{JOURS[i]} <span style={{fontWeight:300}}>{date.getDate()}</span></div>
              {ds.map(s=>(
                <div key={s.id} className={`session-pill ${TYPE_COLORS[s.type]||""}`} onClick={()=>readonly?(profile?.role==="athlete"&&setFeedbackModal(s)):setModal({type:"edit",session:s})}>
                  <div className="stype">{s.type}</div>
                  <div style={{fontSize:12,marginTop:2}}>{s.title}</div>
                  {s.distance&&<div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.distance}km{s.denivele?` · D+${s.denivele}m`:""}</div>}
                  {s.distance&&s.duration&&<div style={{marginTop:3}}><span className="pace-chip">{calcPace(s.distance,s.duration)}/km</span></div>}
                  {s.completed!==undefined&&s.completed!==null&&<div style={{marginTop:4,fontSize:11}}>{s.completed?"✅ Fait":"⚠️ Partiel"}{s.rpe?` · RPE ${s.rpe}`:""}</div>}
                  {!readonly&&<button style={{position:"absolute",top:4,right:4,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14}} onClick={e=>{e.stopPropagation();deleteSession(s.id);}}>✕</button>}
                </div>
              ))}
              {!readonly&&<button style={{background:"none",border:"1px dashed var(--border)",borderRadius:4,width:"100%",padding:"4px 0",color:"var(--muted)",cursor:"pointer",fontSize:12,marginTop:ds.length?4:0}} onClick={()=>setModal({type:"create",date})}>+</button>}
            </div>
          );
        })}
      </div>
      {templateModal&&<TemplatesModal onClose={()=>setTemplateModal(false)} onSelect={t=>{setSelectedTemplate(t);setModal({type:"create"});}}/>}
      {modal&&<SessionModal session={modal.session} date={modal.date} template={selectedTemplate} athleteId={athleteId||(profile?.role==="coach"?null:profile?.id)} onClose={()=>{setModal(null);setSelectedTemplate(null);}} onSave={saveSession}/>}
      {feedbackModal&&<FeedbackModal session={feedbackModal} onClose={()=>setFeedbackModal(null)} onSave={fb=>saveFeedback(feedbackModal.id,fb)}/>}
    </div>
  );
}

/* ── Historique ──────────────────────────────────────────────── */
function Historique({athleteId}){
  const[sessions,setSessions]=useState([]);
  const[selected,setSelected]=useState(null);
  const{profile}=useApp();
  useEffect(()=>{
    const today=new Date().toISOString().slice(0,10);
    let q=supabase.from("sessions").select("*").lte("date",today).not("type","eq","Repos").order("date",{ascending:false}).limit(100);
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile?.role==="athlete") q=q.eq("athlete_id",profile.id);
    q.then(({data})=>setSessions(data||[]));
  },[athleteId]);
  const rc=v=>!v?"var(--muted)":v<=2?"#47ff8a":v<=4?"#d4ff47":v<=6?"#47c8ff":v<=8?"#ff8c47":"#ff4747";
  return(
    <div>
      <div className="page-header"><h2>📋 Historique</h2><p>{sessions.length} séances enregistrées</p></div>
      {sessions.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Aucune séance passée pour l'instant.</div>:(
        <div className="history-list">
          {sessions.map(s=>(
            <div key={s.id}>
              <div className="history-item" onClick={()=>setSelected(selected?.id===s.id?null:s)}>
                <div className="history-left">
                  <div className="history-date">{new Date(s.date).getDate()} {new Date(s.date).toLocaleDateString("fr-FR",{month:"short"})}</div>
                  <div className="history-info">
                    <div className="title">{s.title}</div>
                    <div className="sub">{s.type}{s.distance?` · ${s.actual_distance||s.distance}km`:""}{s.denivele?` · D+${s.denivele}m`:""}{s.distance&&s.duration?` · `:""}
                      {s.distance&&(s.actual_duration||s.duration)&&<span className="pace-chip" style={{fontSize:10}}>{calcPace(s.actual_distance||s.distance,s.actual_duration||s.duration)}/km</span>}
                    </div>
                  </div>
                </div>
                <div className="history-right">
                  {s.completed===true&&<span className="badge badge-green">✓ Fait</span>}
                  {s.completed===false&&<span className="badge badge-orange">⚠ Partiel</span>}
                  {(s.completed===undefined||s.completed===null)&&<span className="badge badge-gray">—</span>}
                  {s.rpe&&<span style={{fontFamily:"var(--font-h)",fontSize:18,fontWeight:700,color:rc(s.rpe)}}>RPE {s.rpe}</span>}
                </div>
              </div>
              {selected?.id===s.id&&s.athlete_comment&&<div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"12px 18px",fontSize:13,color:"var(--muted)"}}>💬 {s.athlete_comment}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Objectif ────────────────────────────────────────────────── */
function Objectif({athleteId}){
  const[races,setRaces]=useState([]);
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({name:"",date:"",distance:"",denivele:"",objectif_time:"",notes:""});
  const{profile}=useApp();
  const targetId=athleteId||profile?.id;
  if(!targetId) return null;
  useEffect(()=>{supabase.from("races").select("*").eq("athlete_id",targetId).order("date").then(({data})=>setRaces(data||[]));},[athleteId]);
  const reload=()=>supabase.from("races").select("*").eq("athlete_id",targetId).order("date").then(({data})=>setRaces(data||[]));
  async function saveRace(){if(!form.name||!form.date) return;await supabase.from("races").insert({...form,athlete_id:targetId});setForm({name:"",date:"",distance:"",denivele:"",objectif_time:"",notes:""});setShowForm(false);reload();}
  async function deleteRace(id){if(!confirm("Supprimer ?")) return;await supabase.from("races").delete().eq("id",id);reload();}
  const upcoming=races.filter(r=>daysUntil(r.date)>=0).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const past=races.filter(r=>daysUntil(r.date)<0);
  const next=upcoming[0];
  return(
    <div>
      <div className="flex-between mb-24"><div className="page-header" style={{marginBottom:0}}><h2>🏆 Objectifs course</h2></div><button className="btn btn-primary btn-sm" onClick={()=>setShowForm(!showForm)}>+ Ajouter</button></div>
      {showForm&&(
        <div className="card mb-24">
          <div className="section-title">Nouvel objectif</div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Nom *</label><input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: UTMB, Diagonale…"/></div><div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div></div>
          <div className="grid-3"><div className="form-group"><label className="form-label">Distance (km)</label><input className="form-input" type="number" value={form.distance} onChange={e=>setForm(f=>({...f,distance:e.target.value}))}/></div><div className="form-group"><label className="form-label">D+ (m)</label><input className="form-input" type="number" value={form.denivele} onChange={e=>setForm(f=>({...f,denivele:e.target.value}))}/></div><div className="form-group"><label className="form-label">Objectif temps</label><input className="form-input" value={form.objectif_time} onChange={e=>setForm(f=>({...f,objectif_time:e.target.value}))} placeholder="Ex: 8h30"/></div></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Stratégie de course, points clés…"/></div>
          <div className="flex-gap" style={{justifyContent:"flex-end"}}><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-primary" onClick={saveRace}>Enregistrer</button></div>
        </div>
      )}
      {next&&(
        <div className="race-card">
          <div style={{fontSize:13,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>Prochain objectif</div>
          <div className="race-countdown">{daysUntil(next.date)}</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>jours restants</div>
          <div className="race-name">{next.name}</div>
          <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{formatDate(next.date)}{next.distance?` · ${next.distance}km`:""}{next.denivele?` · D+${next.denivele}m`:""}{next.objectif_time?` · 🎯 ${next.objectif_time}`:""}</div>
          {next.notes&&<div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>{next.notes}</div>}
          <button className="btn btn-danger btn-sm" style={{marginTop:16}} onClick={()=>deleteRace(next.id)}>Supprimer</button>
        </div>
      )}
      {upcoming.length>1&&<div className="mb-24"><div className="section-title">Autres objectifs</div>{upcoming.slice(1).map(r=><div key={r.id} className="card-sm mb-16" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600}}>{r.name}</div><div className="text-muted">{formatDate(r.date)} · J-{daysUntil(r.date)}{r.objectif_time?` · 🎯 ${r.objectif_time}`:""}</div></div><button className="btn btn-danger btn-sm" onClick={()=>deleteRace(r.id)}>✕</button></div>)}</div>}
      {past.length>0&&<div><div className="section-title">Courses passées</div>{[...past].reverse().map(r=><div key={r.id} className="card-sm mb-16" style={{display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.6}}><div><div style={{fontWeight:600}}>{r.name}</div><div className="text-muted">{formatDate(r.date)}{r.notes?` · ${r.notes}`:""}</div></div><span className="badge badge-gray">Terminée</span></div>)}</div>}
      {races.length===0&&!showForm&&<div className="card" style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Aucun objectif défini.<br/><span style={{fontSize:13}}>Ajoute ta prochaine course cible !</span></div>}
    </div>
  );
}

/* ── Blessures ───────────────────────────────────────────────── */
function Blessures({athleteId}){
  const[injuries,setInjuries]=useState([]);
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({zone:"",description:"",date_debut:new Date().toISOString().slice(0,10),statut:"active"});
  const{profile}=useApp();
  const targetId=athleteId||profile?.id;
  if(!targetId) return null;
  const reload=()=>supabase.from("injuries").select("*").eq("athlete_id",targetId).order("date_debut",{ascending:false}).then(({data})=>setInjuries(data||[]));
  useEffect(()=>{reload();},[athleteId]);
  async function saveInjury(){if(!form.zone||!form.description) return;await supabase.from("injuries").insert({...form,athlete_id:targetId});setForm({zone:"",description:"",date_debut:new Date().toISOString().slice(0,10),statut:"active"});setShowForm(false);reload();}
  async function toggle(i){await supabase.from("injuries").update({statut:i.statut==="active"?"resolved":"active"}).eq("id",i.id);reload();}
  async function del(id){if(!confirm("Supprimer ?")) return;await supabase.from("injuries").delete().eq("id",id);reload();}
  const active=injuries.filter(i=>i.statut==="active");
  const resolved=injuries.filter(i=>i.statut==="resolved");
  return(
    <div>
      <div className="flex-between mb-24"><div className="page-header" style={{marginBottom:0}}><h2>🩹 Suivi médical</h2></div><button className="btn btn-primary btn-sm" onClick={()=>setShowForm(!showForm)}>+ Ajouter</button></div>
      {showForm&&(
        <div className="card mb-24">
          <div className="section-title">Nouvelle note médicale</div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Zone / Localisation</label><input className="form-input" value={form.zone} onChange={e=>setForm(f=>({...f,zone:e.target.value}))} placeholder="Ex: Genou gauche, ischio..."/></div><div className="form-group"><label className="form-label">Date début</label><input className="form-input" type="date" value={form.date_debut} onChange={e=>setForm(f=>({...f,date_debut:e.target.value}))}/></div></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Symptômes, intensité, contexte..."/></div>
          <div className="form-group"><label className="form-label">Statut</label><select className="form-select" value={form.statut} onChange={e=>setForm(f=>({...f,statut:e.target.value}))}><option value="active">En cours</option><option value="resolved">Résolu</option></select></div>
          <div className="flex-gap" style={{justifyContent:"flex-end"}}><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-primary" onClick={saveInjury}>Enregistrer</button></div>
        </div>
      )}
      {active.length>0&&<div className="mb-24"><div className="section-title">En cours ({active.length})</div>{active.map(i=><div key={i.id} className="injury-item active"><div className="flex-between mb-16"><div><div style={{fontWeight:700,fontSize:15}}>{i.zone}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Depuis le {formatDate(i.date_debut)}</div></div><div className="flex-gap"><span className="badge badge-red">En cours</span><button className="btn btn-secondary btn-sm" onClick={()=>toggle(i)}>✓ Résolu</button><button className="btn btn-danger btn-sm" onClick={()=>del(i.id)}>✕</button></div></div><div style={{fontSize:13,color:"var(--muted)"}}>{i.description}</div></div>)}</div>}
      {resolved.length>0&&<div><div className="section-title">Historique ({resolved.length})</div>{resolved.map(i=><div key={i.id} className="injury-item resolved"><div className="flex-between"><div><div style={{fontWeight:600}}>{i.zone}</div><div style={{fontSize:12,color:"var(--muted)"}}>{formatDate(i.date_debut)} · {i.description}</div></div><div className="flex-gap"><span className="badge badge-green">Résolu</span><button className="btn btn-secondary btn-sm" onClick={()=>toggle(i)}>Réactiver</button></div></div></div>)}</div>}
      {injuries.length===0&&!showForm&&<div className="card" style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Aucune note médicale.<br/><span style={{fontSize:13}}>Ajoute blessures, douleurs ou alertes à surveiller.</span></div>}
    </div>
  );
}

/* ── Stats data hook ─────────────────────────────────────────── */
function useStatsData(period,athleteId){
  const[sessions,setSessions]=useState([]);
  const{profile}=useApp();
  useEffect(()=>{
    const now=new Date(),from=new Date(now);
    if(period==="week") from.setDate(now.getDate()-7);
    else if(period==="month") from.setMonth(now.getMonth()-1);
    else if(period==="3months") from.setMonth(now.getMonth()-3);
    else from.setFullYear(now.getFullYear()-1);
    let q=supabase.from("sessions").select("*").gte("date",from.toISOString().slice(0,10)).not("type","eq","Repos").order("date");
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile?.role==="athlete") q=q.eq("athlete_id",profile.id);
    q.then(({data})=>setSessions(data||[]));
  },[period,athleteId]);
  return sessions;
}
function buildWeekly(sessions,field){
  const map={};
  sessions.forEach(s=>{
    const d=new Date(s.date),m=new Date(d);m.setDate(d.getDate()-((d.getDay()+6)%7));
    const k=m.toISOString().slice(0,10);
    const val=field==="distance"?Number(s.actual_distance||s.distance||0):Number(s.denivele||0);
    map[k]=(map[k]||0)+val;
  });
  return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({label:new Date(k).toLocaleDateString("fr-FR",{day:"numeric",month:"short"}),value:v}));
}
function buildMonthly(sessions,field){
  const map={};
  sessions.forEach(s=>{
    const d=new Date(s.date);
    const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const val=field==="distance"?Number(s.actual_distance||s.distance||0):Number(s.denivele||0);
    map[k]=(map[k]||0)+val;
  });
  return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({label:MOIS[parseInt(k.split("-")[1])-1].slice(0,4)+" "+k.split("-")[0].slice(2),value:v}));
}

/* ── StatsOverview ───────────────────────────────────────────── */
function StatsOverview({athleteId}){
  const[period,setPeriod]=useState("month");
  const sessions=useStatsData(period,athleteId);
  const totalKm=sessions.reduce((a,s)=>a+Number(s.actual_distance||s.distance||0),0);
  const totalDPlus=sessions.reduce((a,s)=>a+Number(s.denivele||0),0);
  const totalMin=sessions.reduce((a,s)=>a+Number(s.actual_duration||s.duration||0),0);
  const avgRpe=sessions.filter(s=>s.rpe).reduce((a,s,_,arr)=>a+s.rpe/arr.length,0);
  const completed=sessions.filter(s=>s.completed===true).length;
  const compliance=sessions.length?Math.round(completed/sessions.length*100):0;
  const avgPace=totalKm>0&&totalMin>0?calcPace(totalKm,totalMin):null;
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📊 Vue d'ensemble</h2></div>
        <div className="flex-gap">{["week","month","3months","year"].map(p=><button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-secondary"}`} onClick={()=>setPeriod(p)}>{p==="week"?"7j":p==="month"?"30j":p==="3months"?"3 mois":"1 an"}</button>)}</div>
      </div>
      <div className="stats-grid">
        <div className="stat-card accent"><div className="label">Volume total</div><div className="value">{totalKm.toFixed(0)}<span className="unit">km</span></div><div className="delta">{sessions.length} séances</div></div>
        <div className="stat-card blue"><div className="label">D+ total</div><div className="value">{(totalDPlus/1000).toFixed(1)}<span className="unit">km D+</span></div></div>
        <div className="stat-card orange"><div className="label">Temps total</div><div className="value">{Math.floor(totalMin/60)}<span className="unit">h {totalMin%60}m</span></div></div>
        <div className="stat-card"><div className="label">RPE moyen</div><div className="value" style={{color:avgRpe>7?"var(--red)":avgRpe>5?"var(--orange)":"var(--accent)"}}>{avgRpe?avgRpe.toFixed(1):"—"}<span className="unit">/10</span></div></div>
        <div className="stat-card"><div className="label">Compliance</div><div className="value" style={{color:compliance>=80?"var(--accent)":compliance>=60?"var(--orange)":"var(--red)"}}>{compliance}<span className="unit">%</span></div><div className="delta">{completed}/{sessions.length} réalisées</div></div>
        {avgPace&&<div className="stat-card blue"><div className="label">Allure moyenne</div><div className="value" style={{fontSize:26}}>{avgPace}</div><div className="delta">/km globale</div></div>}
      </div>
    </div>
  );
}

/* ── StatsVolume ─────────────────────────────────────────────── */
function StatsVolume({athleteId}){
  const[period,setPeriod]=useState("3months");
  const[gran,setGran]=useState("semaine");
  const sessions=useStatsData(period,athleteId);
  const data=gran==="semaine"?buildWeekly(sessions,"distance"):buildMonthly(sessions,"distance");
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📈 Volume (km)</h2></div>
        <div className="flex-gap">{["month","3months","year"].map(p=><button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-secondary"}`} onClick={()=>setPeriod(p)}>{p==="month"?"3 mois":p==="3months"?"6 mois":"1 an"}</button>)}</div>
      </div>
      <div className="card">
        <div className="flex-between mb-16">
          <div className="section-title" style={{marginBottom:0}}>Évolution du volume</div>
          <div className="flex-gap">{["semaine","mois"].map(g=><button key={g} className={`btn btn-sm ${gran===g?"btn-primary":"btn-secondary"}`} onClick={()=>setGran(g)}>Par {g}</button>)}</div>
        </div>
        <BarChart data={data} color="var(--accent)" unit="km"/>
      </div>
    </div>
  );
}

/* ── StatsDenivele ───────────────────────────────────────────── */
function StatsDenivele({athleteId}){
  const[period,setPeriod]=useState("3months");
  const[gran,setGran]=useState("semaine");
  const sessions=useStatsData(period,athleteId);
  const data=(gran==="semaine"?buildWeekly(sessions,"denivele"):buildMonthly(sessions,"denivele")).map(d=>({...d,value:Math.round(d.value)}));
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>⛰️ Dénivelé</h2></div>
        <div className="flex-gap">{["month","3months","year"].map(p=><button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-secondary"}`} onClick={()=>setPeriod(p)}>{p==="month"?"3 mois":p==="3months"?"6 mois":"1 an"}</button>)}</div>
      </div>
      <div className="card">
        <div className="flex-between mb-16">
          <div className="section-title" style={{marginBottom:0}}>Évolution du D+</div>
          <div className="flex-gap">{["semaine","mois"].map(g=><button key={g} className={`btn btn-sm ${gran===g?"btn-primary":"btn-secondary"}`} onClick={()=>setGran(g)}>Par {g}</button>)}</div>
        </div>
        <BarChart data={data} color="var(--accent2)" unit="m"/>
      </div>
    </div>
  );
}

/* ── StatsTypologies ─────────────────────────────────────────── */
function StatsTypologies({athleteId}){
  const[period,setPeriod]=useState("month");
  const sessions=useStatsData(period,athleteId);
  const typeDistrib={};sessions.forEach(s=>{typeDistrib[s.type]=(typeDistrib[s.type]||0)+1;});
  const donutData=Object.entries(typeDistrib).map(([label,value])=>({label,value,color:TYPE_PALETTE[label]||"#6b7094"})).sort((a,b)=>b.value-a.value);
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>🥧 Typologies</h2></div>
        <div className="flex-gap">{["week","month","3months","year"].map(p=><button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-secondary"}`} onClick={()=>setPeriod(p)}>{p==="week"?"7j":p==="month"?"30j":p==="3months"?"3 mois":"1 an"}</button>)}</div>
      </div>
      <div className="card mb-24"><div className="section-title">Répartition des séances</div><DonutChart data={donutData}/></div>
      <div className="card"><div className="section-title">Détail par type</div><BarChart data={donutData.map(d=>({label:d.label.slice(0,9),value:d.value}))} color="var(--orange)" unit="×"/></div>
    </div>
  );
}

/* ── StatsForme (charge aiguë / chronique ATL/CTL) ──────────── */
function StatsForme({athleteId}){
  const sessions=useStatsData("year",athleteId);
  // Calcul ATL (7j) et CTL (42j) - fitness/fatigue model
  const today=new Date();
  const points=[];
  for(let i=41;i>=0;i--){
    const d=new Date(today);d.setDate(today.getDate()-i);
    const dateStr=d.toISOString().slice(0,10);
    const dayLoad=sessions.filter(s=>s.date===dateStr).reduce((a,s)=>a+computeLoad(s),0);
    // ATL = charge des 7 derniers jours (moyenne)
    const atl7=sessions.filter(s=>{const dd=new Date(s.date);return dd<=d&&dd>new Date(d.getTime()-7*86400000);}).reduce((a,s)=>a+computeLoad(s),0)/7;
    // CTL = charge des 42 derniers jours (moyenne)
    const ctl42=sessions.filter(s=>{const dd=new Date(s.date);return dd<=d&&dd>new Date(d.getTime()-42*86400000);}).reduce((a,s)=>a+computeLoad(s),0)/42;
    const tsb=ctl42-atl7; // Training Stress Balance = forme
    points.push({label:d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"}),atl:Math.round(atl7),ctl:Math.round(ctl42),tsb:Math.round(tsb),dayLoad});
  }
  // Afficher seulement les 12 dernières semaines (un point par semaine)
  const weekly=points.filter((_,i)=>i%7===0);
  const maxVal=Math.max(...weekly.map(p=>Math.max(p.atl,p.ctl)),1);
  const lastPoint=weekly[weekly.length-1];
  const forme=lastPoint?.tsb>5?"Bonne forme 💪":lastPoint?.tsb>-10?"Équilibre ⚖️":lastPoint?.tsb>-25?"Fatigue accumulée 😓":"Surcharge ⚠️";
  const formeColor=lastPoint?.tsb>5?"var(--green)":lastPoint?.tsb>-10?"var(--accent)":lastPoint?.tsb>-25?"var(--orange)":"var(--red)";
  return(
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📉 Forme / Fatigue</h2><p>Modèle charge aiguë (ATL) vs chronique (CTL)</p></div>
      </div>
      {lastPoint&&(
        <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:24}}>
          <div className="stat-card"><div className="label">Fitness CTL</div><div className="value" style={{color:"var(--accent2)"}}>{lastPoint.ctl}</div><div className="delta">Charge chronique 42j</div></div>
          <div className="stat-card"><div className="label">Fatigue ATL</div><div className="value" style={{color:"var(--orange)"}}>{lastPoint.atl}</div><div className="delta">Charge aiguë 7j</div></div>
          <div className="stat-card"><div className="label">Forme TSB</div><div className="value" style={{color:formeColor,fontSize:24}}>{forme}</div><div className="delta">TSB = {lastPoint.tsb}</div></div>
        </div>
      )}
      <div className="card mb-16">
        <div className="section-title mb-16">Fitness (CTL) — 42 jours</div>
        <BarChart data={weekly.map(p=>({label:p.label,value:p.ctl}))} color="var(--accent2)" unit="UA"/>
      </div>
      <div className="card mb-16">
        <div className="section-title mb-16">Fatigue (ATL) — 7 jours glissants</div>
        <BarChart data={weekly.map(p=>({label:p.label,value:p.atl}))} color="var(--orange)" unit="UA"/>
      </div>
      <div className="card" style={{borderColor:"rgba(212,255,71,.2)"}}>
        <div className="section-title mb-8">💡 Comment lire ce graphique</div>
        <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>
          <p><strong style={{color:"var(--accent2)"}}>CTL (Fitness)</strong> — Charge chronique sur 42 jours. Plus c'est élevé, meilleure est ta condition physique.</p>
          <p style={{marginTop:6}}><strong style={{color:"var(--orange)"}}>ATL (Fatigue)</strong> — Charge aiguë sur 7 jours. Si ATL {">"} CTL, tu es en surcharge.</p>
          <p style={{marginTop:6}}><strong style={{color:"var(--green)"}}>TSB (Forme)</strong> — Balance = CTL - ATL. Positif = forme, négatif = fatigue. Idéal entre -10 et +5 en période d'entraînement.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Messagerie ──────────────────────────────────────────────── */
function Messagerie({coachId,athleteId,partnerName}){
  const[messages,setMessages]=useState([]);
  const[input,setInput]=useState("");
  const bottomRef=useRef(null);
  const{profile}=useApp();
  const myId=profile?.id;
  if(!myId) return null;
  const partnerId=profile.role==="coach"?athleteId:coachId;
  useEffect(()=>{
    if(!partnerId) return;
    supabase.from("messages").select("*").or(`and(sender_id.eq.${myId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${myId})`).order("created_at").then(({data})=>setMessages(data||[]));
    const sub=supabase.channel("msgs_"+partnerId).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},payload=>{const m=payload.new;if((m.sender_id===myId&&m.receiver_id===partnerId)||(m.sender_id===partnerId&&m.receiver_id===myId)) setMessages(ms=>[...ms,m]);}).subscribe();
    return ()=>supabase.removeChannel(sub);
  },[partnerId]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function send(){if(!input.trim()||!partnerId) return;await supabase.from("messages").insert({sender_id:myId,receiver_id:partnerId,content:input.trim()});setInput("");}
  if(!partnerId) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"300px",color:"var(--muted)"}}>Sélectionne un athlète</div>;
  return(
    <div className="messages-wrap">
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"var(--bg3)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{initials(partnerName)}</div>
        <div><div style={{fontWeight:600,fontSize:14}}>{partnerName||"..."}</div><div style={{fontSize:11,color:"var(--muted)"}}>Messagerie directe</div></div>
      </div>
      <div className="messages-list">
        {messages.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:40}}>Démarrez la conversation 👋</div>}
        {messages.map(m=><div key={m.id} className={`message-bubble ${m.sender_id===myId?"own":"other"}`}><div className="bubble-inner">{m.content}</div><div className="bubble-meta">{new Date(m.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div></div>)}
        <div ref={bottomRef}/>
      </div>
      <div className="messages-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Écrire un message..."/><button className="btn btn-primary" onClick={send} disabled={!input.trim()}>Envoyer</button></div>
    </div>
  );
}

/* ── Coach Dashboard ─────────────────────────────────────────── */
function CoachDashboard({dark,setDark}){
  const[page,setPage]=useState("athletes");
  const[athletes,setAthletes]=useState([]);
  const[sel,setSel]=useState(null);
  const[statsSubPage,setStatsSubPage]=useState("overview");
  const{profile}=useApp();
  useEffect(()=>{supabase.from("profiles").select("*").eq("role","athlete").eq("coach_id",profile.id).then(({data})=>setAthletes(data||[]));},[]);
  const nav=[{id:"athletes",icon:"👥",label:"Mes athlètes"},{id:"planning",icon:"📅",label:"Planning"},{id:"stats",icon:"📊",label:"Statistiques"},{id:"historique",icon:"📋",label:"Historique"},{id:"objectif",icon:"🏆",label:"Objectifs"},{id:"blessures",icon:"🩹",label:"Suivi médical"},{id:"messages",icon:"💬",label:"Messages"}];
  const back=()=><div className="flex-gap mb-16"><button className="btn btn-secondary btn-sm" onClick={()=>{setPage("athletes");setSel(null);}}>← Retour</button><span style={{fontWeight:600}}>{sel?.full_name}</span></div>;
  return(
    <div className="app-layout">
      <Sidebar nav={nav} active={page} setActive={setPage} statsSubPage={statsSubPage} setStatsSubPage={setStatsSubPage} dark={dark} setDark={setDark}/>
      <MobileNav nav={nav} active={page} setActive={setPage}/>
      <main className="main">
        {page==="athletes"&&(
          <div>
            <div className="page-header"><h2>👥 Mes athlètes</h2><p>{athletes.length} athlète{athletes.length!==1?"s":""} suivi{athletes.length!==1?"s":""}</p></div>
            <div className="card mb-24" style={{background:"rgba(212,255,71,.05)",border:"1px solid rgba(212,255,71,.2)"}}>
              <div className="section-title">Ton code coach</div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontFamily:"var(--font-h)",fontSize:40,fontWeight:800,color:"var(--accent)",letterSpacing:6}}>{profile.coach_code||"—"}</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>Partage ce code à tes athlètes.<br/>Ils l'entreront lors de leur inscription.</div>
              </div>
            </div>
            <div className="section-title">Liste des athlètes</div>
            {athletes.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Aucun athlète pour l'instant.</div>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {athletes.map(a=>(
                  <div key={a.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div className="flex-gap"><div className="athlete-avatar" style={{width:44,height:44,fontSize:17}}>{initials(a.full_name)}</div><div><div style={{fontWeight:600,fontSize:15}}>{a.full_name}</div><div className="text-muted text-sm">{a.email}</div></div></div>
                    <div className="flex-gap">
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("planning");}}>📅</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("stats");}}>📊</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("historique");}}>📋</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("objectif");}}>🏆</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("blessures");}}>🩹</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setSel(a);setPage("messages");}}>💬</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {page==="planning"&&<div>{sel&&back()}<Planning athleteId={sel?.id} readonly={false}/></div>}
        {page==="stats"&&<div>{sel&&back()}
          {statsSubPage==="overview"&&<StatsOverview athleteId={sel?.id}/>}
          {statsSubPage==="volume"&&<StatsVolume athleteId={sel?.id}/>}
          {statsSubPage==="denivele"&&<StatsDenivele athleteId={sel?.id}/>}
          {statsSubPage==="typologies"&&<StatsTypologies athleteId={sel?.id}/>}
          {statsSubPage==="forme"&&<StatsForme athleteId={sel?.id}/>}
        </div>}
        {page==="historique"&&<div>{sel&&back()}<Historique athleteId={sel?.id}/></div>}
        {page==="objectif"&&<div>{sel&&back()}<Objectif athleteId={sel?.id}/></div>}
        {page==="blessures"&&<div>{sel&&back()}<Blessures athleteId={sel?.id}/></div>}
        {page==="messages"&&(
          <div>
            <div className="page-header mb-16"><h2>💬 Messages</h2></div>
            <div className="grid-2" style={{alignItems:"start"}}>
              <div className="card"><div className="section-title mb-16">Athlètes</div>{athletes.map(a=><div key={a.id} className={`athlete-item ${sel?.id===a.id?"selected":""}`} onClick={()=>setSel(a)}><div className="athlete-avatar">{initials(a.full_name)}</div><div><div style={{fontWeight:600,fontSize:14}}>{a.full_name}</div><div className="text-muted text-sm">{a.email}</div></div></div>)}</div>
              <div className="card" style={{padding:0,overflow:"hidden"}}><Messagerie athleteId={sel?.id} partnerName={sel?.full_name}/></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Athlete Dashboard ───────────────────────────────────────── */
function AthleteDashboard({dark,setDark}){
  const[page,setPage]=useState("planning");
  const[statsSubPage,setStatsSubPage]=useState("overview");
  const[coachProfile,setCoachProfile]=useState(null);
  const{profile}=useApp();
  useEffect(()=>{if(profile?.coach_id) supabase.from("profiles").select("*").eq("id",profile?.coach_id).single().then(({data})=>setCoachProfile(data));},[]);
  const nav=[{id:"planning",icon:"📅",label:"Mon planning"},{id:"historique",icon:"📋",label:"Historique"},{id:"stats",icon:"📊",label:"Mes stats"},{id:"objectif",icon:"🏆",label:"Mes objectifs"},{id:"blessures",icon:"🩹",label:"Suivi médical"},{id:"messages",icon:"💬",label:"Messages"}];
  return(
    <div className="app-layout">
      <Sidebar nav={nav} active={page} setActive={setPage} statsSubPage={statsSubPage} setStatsSubPage={setStatsSubPage} dark={dark} setDark={setDark}/>
      <MobileNav nav={nav} active={page} setActive={setPage}/>
      <main className="main">
        {!profile?.coach_id&&<div className="alert alert-warning">⚠️ Pas encore de coach assigné. Vérifie que tu as bien entré le bon code coach à l'inscription.</div>}
        {page==="planning"&&<MonthlyPlanning readonly={true}/>}
        {page==="historique"&&<Historique/>}
        {page==="stats"&&(
          <div>
            {statsSubPage==="overview"&&<StatsOverview/>}
            {statsSubPage==="volume"&&<StatsVolume/>}
            {statsSubPage==="denivele"&&<StatsDenivele/>}
            {statsSubPage==="typologies"&&<StatsTypologies/>}
            {statsSubPage==="forme"&&<StatsForme/>}
          </div>
        )}
        {page==="objectif"&&<Objectif/>}
        {page==="blessures"&&<Blessures/>}
        {page==="messages"&&<div><div className="page-header"><h2>💬 Messages</h2>{coachProfile&&<p>Conversation avec {coachProfile.full_name}</p>}</div><div className="card" style={{padding:0,overflow:"hidden"}}><Messagerie coachId={profile.coach_id} partnerName={coachProfile?.full_name}/></div></div>}
      </main>
    </div>
  );
}

/* ── Root ────────────────────────────────────────────────────── */
export default function App(){
  const[session,setSession]=useState(undefined);
  const[profile,setProfile]=useState(null);
  const[dark,setDark]=useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);if(session) supabase.from("profiles").select("*").eq("id",session.user.id).single().then(({data})=>setProfile(data));});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);if(s) supabase.from("profiles").select("*").eq("id",s.user.id).single().then(({data})=>setProfile(data));else setProfile(null);});
    return ()=>subscription.unsubscribe();
  },[]);

  if(session===undefined) return <><style>{FONTS}{buildCSS(dark)}</style><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:dark?"#0d0e14":"#f0f2f8"}}><div style={{textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>⛰️</div><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,letterSpacing:4,textTransform:"uppercase",color:"#d4ff47"}}>TrailCoach</p></div></div></>;
  return <>
    <style>{FONTS}{buildCSS(dark)}</style>
    {!session
      ? <AuthPage/>
      : <AppCtx.Provider value={{session,profile,setProfile}}>
          {!profile
            ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div className="spinner"/></div>
            : profile.role==="coach"
              ? <CoachDashboard dark={dark} setDark={setDark}/>
              : <AthleteDashboard dark={dark} setDark={setDark}/>
          }
        </AppCtx.Provider>
    }
  </>;
}