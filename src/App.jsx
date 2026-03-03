/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              TRAILCOACH — Plateforme Coach/Athlète           ║
 * ║         Alternative gratuite à Nolio pour trail/running      ║
 * ╚══════════════════════════════════════════════════════════════╝
 * STACK 100% GRATUITE :
 *   Frontend : React + Vite → Vercel / Netlify (free tier)
 *   Base de données : Supabase PostgreSQL (free tier 500MB)
 *   Auth : Supabase Auth email/password
 *   Realtime : Supabase Realtime (messagerie)
 */

import { useState, useEffect, useContext, createContext, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ── Supabase client ─────────────────────────────────────────── */
const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Context ─────────────────────────────────────────────────── */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ── Fonts & CSS ─────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d0e14;--bg2:#13141c;--bg3:#1a1c27;--border:#2a2d3e;
  --accent:#d4ff47;--accent2:#47c8ff;--red:#ff4747;--orange:#ff8c47;
  --text:#e8eaf0;--muted:#6b7094;
  --font-h:'Barlow Condensed',sans-serif;--font-b:'Barlow',sans-serif;
  --radius:12px;
}
html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-b)}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

.app-layout{display:flex;height:100vh;overflow:hidden}
.sidebar{width:240px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.main{flex:1;overflow-y:auto;padding:32px}

.sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid var(--border)}
.sidebar-logo h1{font-family:var(--font-h);font-size:22px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--accent)}
.sidebar-logo p{font-size:11px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px}
.sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--bg3);color:var(--text)}
.nav-item.active{background:rgba(212,255,71,.1);color:var(--accent)}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border)}
.user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:var(--bg3)}
.user-chip .avatar{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--bg);flex-shrink:0}
.user-chip .info{flex:1;min-width:0}
.user-chip .name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-chip .role{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}

.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.card-sm{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
.stat-card .label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:8px}
.stat-card .value{font-family:var(--font-h);font-size:36px;font-weight:700;line-height:1}
.stat-card .unit{font-size:13px;color:var(--muted);margin-left:4px}
.stat-card .delta{font-size:12px;margin-top:6px;color:var(--muted)}
.stat-card.accent .value{color:var(--accent)}
.stat-card.blue .value{color:var(--accent2)}
.stat-card.orange .value{color:var(--orange)}

.page-header{margin-bottom:28px}
.page-header h2{font-family:var(--font-h);font-size:32px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.page-header p{color:var(--muted);font-size:14px;margin-top:4px}
.section-title{font-family:var(--font-h);font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:14px}

.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:var(--font-b)}
.btn-primary{background:var(--accent);color:var(--bg)}.btn-primary:hover{background:#bcee35}
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

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.modal-header h3{font-family:var(--font-h);font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:22px;padding:4px;line-height:1}
.modal-close:hover{color:var(--text)}

.messages-wrap{display:flex;flex-direction:column;height:calc(100vh - 200px)}
.messages-list{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.message-bubble{max-width:70%}
.message-bubble.own{align-self:flex-end}
.message-bubble.other{align-self:flex-start}
.bubble-inner{padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.5}
.own .bubble-inner{background:var(--accent);color:var(--bg);border-bottom-right-radius:3px}
.other .bubble-inner{background:var(--bg3);border:1px solid var(--border);border-bottom-left-radius:3px}
.bubble-meta{font-size:11px;color:var(--muted);margin-top:4px;padding:0 4px}
.own .bubble-meta{text-align:right}
.messages-input{display:flex;gap:10px;padding:16px;border-top:1px solid var(--border)}
.messages-input input{flex:1;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:var(--font-b);outline:none}
.messages-input input:focus{border-color:var(--accent)}

.athlete-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:all .15s}
.athlete-item:hover{background:var(--bg3)}
.athlete-item.selected{background:rgba(212,255,71,.08);border-color:rgba(212,255,71,.3)}
.athlete-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}

.auth-page{height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.auth-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:40px;width:100%;max-width:400px}
.auth-logo{text-align:center;margin-bottom:32px}
.auth-logo h1{font-family:var(--font-h);font-size:36px;font-weight:800;letter-spacing:3px;color:var(--accent);text-transform:uppercase}
.auth-logo p{color:var(--muted);font-size:13px;margin-top:4px}
.auth-tabs{display:flex;background:var(--bg3);border-radius:8px;padding:4px;margin-bottom:24px}
.auth-tab{flex:1;padding:8px;text-align:center;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;color:var(--muted);border:none;background:none;font-family:var(--font-b);transition:all .15s}
.auth-tab.active{background:var(--accent);color:var(--bg)}

.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.flex-between{display:flex;align-items:center;justify-content:space-between}
.flex-gap{display:flex;align-items:center;gap:10px}
.mt-8{margin-top:8px}.mt-16{margin-top:16px}.mt-24{margin-top:24px}.mb-16{margin-bottom:16px}.mb-24{margin-bottom:24px}
.text-muted{color:var(--muted);font-size:13px}.text-sm{font-size:13px}.w-full{width:100%}
.alert{padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:16px}
.alert-error{background:rgba(255,71,71,.1);border:1px solid rgba(255,71,71,.3);color:#ff8a8a}
.alert-success{background:rgba(212,255,71,.1);border:1px solid rgba(212,255,71,.3);color:var(--accent)}

@media(max-width:768px){.sidebar{display:none}.main{padding:16px}.week-grid{grid-template-columns:repeat(3,1fr)}.stats-grid{grid-template-columns:1fr 1fr}.grid-2{grid-template-columns:1fr}}
`;

/* ── Helpers ─────────────────────────────────────────────────── */
const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const TYPES_SESSION = ["Endurance","Fractionné","Tempo","Côtes","Récupération","Sortie longue","Compétition","Repos"];
const TYPE_COLORS = {Endurance:"endurance",Fractionné:"vitesse",Tempo:"vitesse",Côtes:"vitesse",Récupération:"recuperation","Sortie longue":"endurance",Compétition:"compet",Repos:"recuperation"};

const initials = name => name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";
const formatDate = d => new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
const isToday = date => new Date().toDateString() === date.toDateString();

function getWeekDates(offset=0){
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - today.getDay() + 1 + offset*7);
  return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d; });
}

/* ── Auth Page ───────────────────────────────────────────────── */
function AuthPage(){
  const [tab,setTab]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [role,setRole]=useState("athlete");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  async function handleLogin(e){
    e.preventDefault(); setLoading(true); setError("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error) setError(error.message);
    setLoading(false);
  }

  async function handleRegister(e){
    e.preventDefault(); setLoading(true); setError("");
    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      await supabase.from("profiles").insert({id:data.user.id,full_name:name,email,role});
      setSuccess("Compte créé ! Vérifie ton email puis connecte-toi.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>⛰️ TrailCoach</h1>
          <p>Plateforme coach · athlète</p>
        </div>
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
            <div className="form-group"><label className="form-label">Mot de passe</label><input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/></div>
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="athlete">Athlète</option>
                <option value="coach">Coach</option>
              </select>
            </div>
            <button className="btn btn-primary w-full" style={{justifyContent:"center"}} disabled={loading}>{loading?<span className="spinner"/>:"Créer mon compte"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({nav,active,setActive}){
  const {profile}=useApp();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>⛰️ TrailCoach</h1>
        <p>{profile?.role==="coach"?"Espace Coach":"Espace Athlète"}</p>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item=>(
          <button key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={()=>setActive(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">{initials(profile?.full_name)}</div>
          <div className="info"><div className="name">{profile?.full_name}</div><div className="role">{profile?.role}</div></div>
        </div>
        <button className="btn btn-secondary btn-sm w-full mt-8" style={{justifyContent:"center",marginTop:8}} onClick={()=>supabase.auth.signOut()}>Déconnexion</button>
      </div>
    </div>
  );
}

/* ── Session Modal (Coach) ───────────────────────────────────── */
function SessionModal({session,onClose,onSave,athleteId,date}){
  const [form,setForm]=useState(session||{title:"",type:"Endurance",description:"",distance:"",duration:"",denivele:"",date:date?date.toISOString().slice(0,10):new Date().toISOString().slice(0,10),athlete_id:athleteId||""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{session?"Modifier séance":"Nouvelle séance"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
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
        <div className="form-group"><label className="form-label">Description / Contenu</label><textarea className="form-textarea" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Ex: 20min échauffement + 6x4min à 85% FCmax rec 2min..."/></div>
        <div className="flex-gap" style={{justifyContent:"flex-end"}}>
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={()=>{if(form.title){onSave(form);onClose();}}}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ── Feedback Modal (Athlète) ────────────────────────────────── */
function FeedbackModal({session,onClose,onSave}){
  const [rpe,setRpe]=useState(session.rpe||5);
  const [dist,setDist]=useState(session.actual_distance||session.distance||"");
  const [dur,setDur]=useState(session.actual_duration||session.duration||"");
  const [comment,setComment]=useState(session.athlete_comment||"");
  const [done,setDone]=useState(session.completed??true);
  const rpeColor=v=>v<=2?"#47ff8a":v<=4?"#d4ff47":v<=6?"#47c8ff":v<=8?"#ff8c47":"#ff4747";

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header"><h3>Retour séance</h3><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="card-sm mb-16" style={{background:"var(--bg3)"}}>
          <div style={{fontWeight:600,marginBottom:4}}>{session.title}</div>
          <div className="text-muted">{formatDate(session.date)} · {session.type}</div>
          {session.description&&<div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>{session.description}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Séance effectuée ?</label>
          <div className="flex-gap">
            <button className={`btn btn-sm ${done?"btn-primary":"btn-secondary"}`} onClick={()=>setDone(true)}>✓ Oui</button>
            <button className={`btn btn-sm ${!done?"btn-danger":"btn-secondary"}`} onClick={()=>setDone(false)}>✗ Non / Partiel</button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">RPE ressenti — {rpe}/10</label>
          <input type="range" min={1} max={10} value={rpe} onChange={e=>setRpe(Number(e.target.value))} style={{width:"100%",accentColor:rpeColor(rpe)}}/>
          <div className="flex-between mt-8">
            <span style={{fontSize:11,color:"var(--muted)"}}>Très facile</span>
            <span style={{fontSize:20,fontWeight:700,color:rpeColor(rpe),fontFamily:"var(--font-h)"}}>{rpe}</span>
            <span style={{fontSize:11,color:"var(--muted)"}}>Maximal</span>
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Distance réelle (km)</label><input className="form-input" type="number" step="0.1" value={dist} onChange={e=>setDist(e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Durée réelle (min)</label><input className="form-input" type="number" value={dur} onChange={e=>setDur(e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">Commentaire</label><textarea className="form-textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ressentis, conditions, douleurs éventuelles..."/></div>
        <div className="flex-gap" style={{justifyContent:"flex-end"}}>
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={()=>{onSave({rpe,actual_distance:dist,actual_duration:dur,athlete_comment:comment,completed:done});onClose();}}>Valider</button>
        </div>
      </div>
    </div>
  );
}

/* ── Planning ────────────────────────────────────────────────── */
function Planning({athleteId,readonly}){
  const [weekOffset,setWeekOffset]=useState(0);
  const [sessions,setSessions]=useState([]);
  const [modal,setModal]=useState(null);
  const [feedbackModal,setFeedbackModal]=useState(null);
  const {profile}=useApp();
  const weekDates=getWeekDates(weekOffset);

  useEffect(()=>{fetchSessions();},[weekOffset,athleteId]);

  async function fetchSessions(){
    const from=weekDates[0].toISOString().slice(0,10);
    const to=weekDates[6].toISOString().slice(0,10);
    let q=supabase.from("sessions").select("*").gte("date",from).lte("date",to).order("date");
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile.role==="athlete") q=q.eq("athlete_id",profile.id);
    const {data}=await q;
    setSessions(data||[]);
  }

  async function saveSession(form){
    if(form.id) await supabase.from("sessions").update(form).eq("id",form.id);
    else await supabase.from("sessions").insert(form);
    fetchSessions();
  }

  async function saveFeedback(id,feedback){
    await supabase.from("sessions").update(feedback).eq("id",id);
    fetchSessions();
  }

  async function deleteSession(id){
    if(!confirm("Supprimer cette séance ?")) return;
    await supabase.from("sessions").delete().eq("id",id);
    fetchSessions();
  }

  const sessionsForDate=date=>sessions.filter(s=>s.date===date.toISOString().slice(0,10));
  const totalKm=sessions.reduce((a,s)=>a+Number(s.actual_distance||s.distance||0),0);
  const totalDPlus=sessions.reduce((a,s)=>a+Number(s.denivele||0),0);

  return (
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}>
          <h2>📅 Planning</h2>
          <p>Sem. du {formatDate(weekDates[0])} au {formatDate(weekDates[6])}</p>
        </div>
        <div className="flex-gap">
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(w=>w-1)}>← Préc.</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(0)}>Auj.</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setWeekOffset(w=>w+1)}>Suiv. →</button>
          {!readonly&&<button className="btn btn-primary btn-sm" onClick={()=>setModal({type:"create"})}>+ Séance</button>}
        </div>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:20}}>
        <div className="stat-card accent"><div className="label">Volume</div><div className="value">{totalKm.toFixed(0)}<span className="unit">km</span></div></div>
        <div className="stat-card blue"><div className="label">D+ total</div><div className="value">{(totalDPlus/1000).toFixed(1)}<span className="unit">km</span></div></div>
        <div className="stat-card orange"><div className="label">Séances</div><div className="value">{sessions.filter(s=>s.type!=="Repos").length}</div></div>
      </div>

      <div className="week-grid">
        {weekDates.map((date,i)=>{
          const daySessions=sessionsForDate(date);
          return (
            <div key={i} className={`day-col ${isToday(date)?"today":""}`}>
              <div className="day-label">{JOURS[i]} <span style={{fontWeight:300}}>{date.getDate()}</span></div>
              {daySessions.map(s=>(
                <div key={s.id} className={`session-pill ${TYPE_COLORS[s.type]||""}`}
                  onClick={()=>readonly?(profile.role==="athlete"&&setFeedbackModal(s)):setModal({type:"edit",session:s})}>
                  <div className="stype">{s.type}</div>
                  <div style={{fontSize:12,marginTop:2}}>{s.title}</div>
                  {s.distance&&<div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.distance}km {s.denivele?`· D+${s.denivele}m`:""}</div>}
                  {s.completed!==undefined&&<div style={{marginTop:4,fontSize:11}}>{s.completed?"✅ Fait":"⚠️ Partiel"}{s.rpe?` · RPE ${s.rpe}`:""}</div>}
                  {!readonly&&<button style={{position:"absolute",top:4,right:4,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14}} onClick={e=>{e.stopPropagation();deleteSession(s.id);}}>✕</button>}
                </div>
              ))}
              {!readonly&&<button style={{background:"none",border:"1px dashed var(--border)",borderRadius:4,width:"100%",padding:"4px 0",color:"var(--muted)",cursor:"pointer",fontSize:12,marginTop:daySessions.length?4:0}} onClick={()=>setModal({type:"create",date})}>+</button>}
            </div>
          );
        })}
      </div>

      {modal&&<SessionModal session={modal.session} date={modal.date} athleteId={athleteId||(profile.role==="coach"?null:profile.id)} onClose={()=>setModal(null)} onSave={saveSession}/>}
      {feedbackModal&&<FeedbackModal session={feedbackModal} onClose={()=>setFeedbackModal(null)} onSave={fb=>saveFeedback(feedbackModal.id,fb)}/>}
    </div>
  );
}

/* ── Statistiques ────────────────────────────────────────────── */
function Stats({athleteId}){
  const [sessions,setSessions]=useState([]);
  const [period,setPeriod]=useState("month");
  const {profile}=useApp();

  useEffect(()=>{fetchStats();},[period,athleteId]);

  async function fetchStats(){
    const now=new Date(), from=new Date(now);
    if(period==="week") from.setDate(now.getDate()-7);
    else if(period==="month") from.setMonth(now.getMonth()-1);
    else from.setMonth(now.getMonth()-3);
    let q=supabase.from("sessions").select("*").gte("date",from.toISOString().slice(0,10)).not("type","eq","Repos").order("date");
    if(athleteId) q=q.eq("athlete_id",athleteId);
    else if(profile.role==="athlete") q=q.eq("athlete_id",profile.id);
    const {data}=await q;
    setSessions(data||[]);
  }

  const totalKm=sessions.reduce((a,s)=>a+Number(s.actual_distance||s.distance||0),0);
  const totalDPlus=sessions.reduce((a,s)=>a+Number(s.denivele||0),0);
  const totalMin=sessions.reduce((a,s)=>a+Number(s.actual_duration||s.duration||0),0);
  const avgRpe=sessions.filter(s=>s.rpe).reduce((a,s,_,arr)=>a+s.rpe/arr.length,0);
  const completed=sessions.filter(s=>s.completed===true).length;
  const compliance=sessions.length?Math.round(completed/sessions.length*100):0;

  const weeklyKm={};
  sessions.forEach(s=>{
    const d=new Date(s.date), mon=new Date(d);
    mon.setDate(d.getDate()-d.getDay()+1);
    const key=mon.toISOString().slice(0,10);
    weeklyKm[key]=(weeklyKm[key]||0)+Number(s.actual_distance||s.distance||0);
  });
  const weeklyData=Object.entries(weeklyKm).sort(([a],[b])=>a.localeCompare(b));

  const typeDistrib={};
  sessions.forEach(s=>{ typeDistrib[s.type]=(typeDistrib[s.type]||0)+1; });

  return (
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{marginBottom:0}}><h2>📊 Statistiques</h2></div>
        <div className="flex-gap">
          {["week","month","3months"].map(p=>(
            <button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-secondary"}`} onClick={()=>setPeriod(p)}>
              {p==="week"?"7j":p==="month"?"30j":"3 mois"}
            </button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card accent"><div className="label">Volume total</div><div className="value">{totalKm.toFixed(0)}<span className="unit">km</span></div><div className="delta">{sessions.length} séances</div></div>
        <div className="stat-card blue"><div className="label">D+ total</div><div className="value">{(totalDPlus/1000).toFixed(1)}<span className="unit">km D+</span></div></div>
        <div className="stat-card orange"><div className="label">Temps total</div><div className="value">{Math.floor(totalMin/60)}<span className="unit">h {totalMin%60}m</span></div></div>
        <div className="stat-card"><div className="label">RPE moyen</div><div className="value" style={{color:avgRpe>7?"var(--red)":avgRpe>5?"var(--orange)":"var(--accent)"}}>{avgRpe?avgRpe.toFixed(1):"—"}<span className="unit">/10</span></div></div>
        <div className="stat-card"><div className="label">Compliance</div><div className="value" style={{color:compliance>=80?"var(--accent)":compliance>=60?"var(--orange)":"var(--red)"}}>{compliance}<span className="unit">%</span></div><div className="delta">{completed}/{sessions.length} réalisées</div></div>
      </div>
      <div className="grid-2 mt-24">
        <div className="card">
          <div className="section-title">Volume hebdo (km)</div>
          {weeklyData.length===0?<p className="text-muted">Pas encore de données</p>:weeklyData.map(([week,km])=>{
            const max=Math.max(...weeklyData.map(([,k])=>k));
            return (
              <div key={week} style={{marginBottom:10}}>
                <div className="flex-between" style={{marginBottom:4}}>
                  <span style={{fontSize:12,color:"var(--muted)"}}>{formatDate(week)}</span>
                  <span style={{fontSize:13,fontWeight:600,color:"var(--accent)",fontFamily:"var(--font-h)"}}>{km.toFixed(0)} km</span>
                </div>
                <div style={{height:6,background:"var(--bg3)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${max?km/max*100:0}%`,height:"100%",background:"var(--accent)",borderRadius:3,transition:"width .3s"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="section-title">Répartition types</div>
          {Object.keys(typeDistrib).length===0?<p className="text-muted">Pas encore de données</p>:
            Object.entries(typeDistrib).sort((a,b)=>b[1]-a[1]).map(([type,count])=>{
              const pct=sessions.length?count/sessions.length*100:0;
              return (
                <div key={type} style={{marginBottom:10}}>
                  <div className="flex-between" style={{marginBottom:4}}>
                    <span style={{fontSize:13}}>{type}</span>
                    <span style={{fontSize:12,color:"var(--muted)"}}>{count} · {pct.toFixed(0)}%</span>
                  </div>
                  <div style={{height:6,background:"var(--bg3)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:"var(--accent2)",borderRadius:3}}/>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

/* ── Messagerie ──────────────────────────────────────────────── */
function Messagerie({coachId,athleteId,partnerName}){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const bottomRef=useRef(null);
  const {profile}=useApp();
  const myId=profile.id;
  const partnerId=profile.role==="coach"?athleteId:coachId;

  useEffect(()=>{
    if(!partnerId) return;
    fetchMessages();
    const sub=supabase.channel("msgs_"+partnerId)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},payload=>{
        const m=payload.new;
        if((m.sender_id===myId&&m.receiver_id===partnerId)||(m.sender_id===partnerId&&m.receiver_id===myId))
          setMessages(ms=>[...ms,m]);
      }).subscribe();
    return ()=>supabase.removeChannel(sub);
  },[partnerId]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  async function fetchMessages(){
    const {data}=await supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${myId})`)
      .order("created_at");
    setMessages(data||[]);
  }

  async function send(){
    if(!input.trim()||!partnerId) return;
    await supabase.from("messages").insert({sender_id:myId,receiver_id:partnerId,content:input.trim()});
    setInput("");
  }

  if(!partnerId) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"300px",color:"var(--muted)"}}>Sélectionne un athlète</div>;

  return (
    <div className="messages-wrap">
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"var(--bg3)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{initials(partnerName)}</div>
        <div><div style={{fontWeight:600,fontSize:14}}>{partnerName}</div><div style={{fontSize:11,color:"var(--muted)"}}>Messagerie directe</div></div>
      </div>
      <div className="messages-list">
        {messages.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:40}}>Démarrez la conversation 👋</div>}
        {messages.map(m=>(
          <div key={m.id} className={`message-bubble ${m.sender_id===myId?"own":"other"}`}>
            <div className="bubble-inner">{m.content}</div>
            <div className="bubble-meta">{new Date(m.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div className="messages-input">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Écrire un message..."/>
        <button className="btn btn-primary" onClick={send} disabled={!input.trim()}>Envoyer</button>
      </div>
    </div>
  );
}

/* ── Coach Dashboard ─────────────────────────────────────────── */
function CoachDashboard(){
  const [page,setPage]=useState("athletes");
  const [athletes,setAthletes]=useState([]);
  const [selectedAthlete,setSelectedAthlete]=useState(null);
  const {profile}=useApp();

  useEffect(()=>{fetchAthletes();},[]);
  async function fetchAthletes(){
    const {data}=await supabase.from("profiles").select("*").eq("role","athlete").eq("coach_id",profile.id);
    setAthletes(data||[]);
  }

  const nav=[{id:"athletes",icon:"👥",label:"Mes athlètes"},{id:"planning",icon:"📅",label:"Planning"},{id:"stats",icon:"📊",label:"Statistiques"},{id:"messages",icon:"💬",label:"Messages"}];

  return (
    <div className="app-layout">
      <Sidebar nav={nav} active={page} setActive={setPage}/>
      <main className="main">
        {page==="athletes"&&(
          <div>
            <div className="page-header"><h2>👥 Mes athlètes</h2><p>{athletes.length} athlète{athletes.length!==1?"s":""} suivi{athletes.length!==1?"s":""}</p></div>
            <InviteAthlete coachId={profile.id} onInvited={fetchAthletes}/>
            <div className="mt-24">
              <div className="section-title">Liste</div>
              {athletes.length===0?(
                <div className="card" style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Aucun athlète pour l'instant.<br/><span style={{fontSize:13}}>Ajoute tes athlètes via leur email.</span></div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {athletes.map(a=>(
                    <div key={a.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div className="flex-gap">
                        <div className="athlete-avatar" style={{width:44,height:44,fontSize:17}}>{initials(a.full_name)}</div>
                        <div><div style={{fontWeight:600,fontSize:15}}>{a.full_name}</div><div className="text-muted text-sm">{a.email}</div></div>
                      </div>
                      <div className="flex-gap">
                        <button className="btn btn-secondary btn-sm" onClick={()=>{setSelectedAthlete(a);setPage("planning");}}>📅 Planning</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>{setSelectedAthlete(a);setPage("stats");}}>📊 Stats</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>{setSelectedAthlete(a);setPage("messages");}}>💬</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {page==="planning"&&(
          <div>
            {selectedAthlete&&<div className="flex-gap mb-16"><button className="btn btn-secondary btn-sm" onClick={()=>{setPage("athletes");setSelectedAthlete(null);}}>← Retour</button><span style={{fontWeight:600}}>{selectedAthlete.full_name}</span></div>}
            <Planning athleteId={selectedAthlete?.id} readonly={false}/>
          </div>
        )}
        {page==="stats"&&(
          <div>
            {selectedAthlete&&<div className="flex-gap mb-16"><button className="btn btn-secondary btn-sm" onClick={()=>{setPage("athletes");setSelectedAthlete(null);}}>← Retour</button><span style={{fontWeight:600}}>{selectedAthlete.full_name}</span></div>}
            <Stats athleteId={selectedAthlete?.id}/>
          </div>
        )}
        {page==="messages"&&(
          <div>
            <div className="page-header mb-16"><h2>💬 Messages</h2></div>
            <div className="grid-2" style={{alignItems:"start"}}>
              <div className="card">
                <div className="section-title mb-16">Athlètes</div>
                {athletes.map(a=>(
                  <div key={a.id} className={`athlete-item ${selectedAthlete?.id===a.id?"selected":""}`} onClick={()=>setSelectedAthlete(a)}>
                    <div className="athlete-avatar">{initials(a.full_name)}</div>
                    <div><div style={{fontWeight:600,fontSize:14}}>{a.full_name}</div><div className="text-muted text-sm">{a.email}</div></div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}><Messagerie athleteId={selectedAthlete?.id} partnerName={selectedAthlete?.full_name}/></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function InviteAthlete({coachId,onInvited}){
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  async function link(e){
    e.preventDefault(); setLoading(true); setMsg("");
    const {data}=await supabase.from("profiles").select("id").eq("email",email).eq("role","athlete").single();
    if(!data){setMsg("Athlète introuvable. Il doit d'abord créer son compte.");setLoading(false);return;}
    await supabase.from("profiles").update({coach_id:coachId}).eq("id",data.id);
    setMsg("Athlète ajouté avec succès !"); setEmail(""); onInvited();
    setLoading(false);
  }

  return (
    <div className="card">
      <div className="section-title">Ajouter un athlète</div>
      <form onSubmit={link} style={{display:"flex",gap:10,alignItems:"flex-end"}}>
        <div className="form-group" style={{flex:1,marginBottom:0}}>
          <label className="form-label">Email de l'athlète</label>
          <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="athlete@email.com" required/>
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading?<span className="spinner"/>:"Ajouter"}</button>
      </form>
      {msg&&<div className={`alert mt-8 ${msg.includes("succès")?"alert-success":"alert-error"}`}>{msg}</div>}
    </div>
  );
}

/* ── Athlete Dashboard ───────────────────────────────────────── */
function AthleteDashboard(){
  const [page,setPage]=useState("planning");
  const [coachProfile,setCoachProfile]=useState(null);
  const {profile}=useApp();

  useEffect(()=>{
    if(profile.coach_id)
      supabase.from("profiles").select("*").eq("id",profile.coach_id).single().then(({data})=>setCoachProfile(data));
  },[profile.coach_id]);

  const nav=[{id:"planning",icon:"📅",label:"Mon planning"},{id:"stats",icon:"📊",label:"Mes stats"},{id:"messages",icon:"💬",label:"Messages"}];

  return (
    <div className="app-layout">
      <Sidebar nav={nav} active={page} setActive={setPage}/>
      <main className="main">
        {!profile.coach_id&&<div className="alert" style={{background:"rgba(255,140,71,.1)",border:"1px solid rgba(255,140,71,.3)",color:"var(--orange)",marginBottom:20}}>⚠️ Pas encore de coach assigné. Donne ton email à ton coach : <strong>{profile.email}</strong></div>}
        {page==="planning"&&<Planning readonly={true}/>}
        {page==="stats"&&<Stats/>}
        {page==="messages"&&(
          <div>
            <div className="page-header"><h2>💬 Messages</h2>{coachProfile&&<p>Conversation avec {coachProfile.full_name}</p>}</div>
            <div className="card" style={{padding:0,overflow:"hidden"}}><Messagerie coachId={profile.coach_id} partnerName={coachProfile?.full_name}/></div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Root App ────────────────────────────────────────────────── */
export default function App(){
  const [session,setSession]=useState(undefined);
  const [profile,setProfile]=useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); if(session) load(session.user.id); });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{ setSession(s); if(s) load(s.user.id); else {setProfile(null);} });
    return ()=>subscription.unsubscribe();
  },[]);

  async function load(uid){ const {data}=await supabase.from("profiles").select("*").eq("id",uid).single(); setProfile(data); }

  const loading=(
    <>
      <style>{FONTS}{CSS}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",color:"var(--accent)"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>⛰️</div><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,letterSpacing:4,textTransform:"uppercase"}}>TrailCoach</p></div>
      </div>
    </>
  );

  if(session===undefined) return loading;

  return (
    <>
      <style>{FONTS}{CSS}</style>
      {!session
        ? <AuthPage/>
        : <AppCtx.Provider value={{session,profile,setProfile}}>
            {profile?.role==="coach"?<CoachDashboard/>:<AthleteDashboard/>}
          </AppCtx.Provider>
      }
    </>
  );
}
