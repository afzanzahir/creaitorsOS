import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   CREAITORS ENTERPRISE OS  —  Complete Build v1.0
   Modules: CEO Dashboard · War Room · Content Factory · Finance Vault · CRM
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=Barlow+Condensed:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'JetBrains Mono', monospace; background: #080c10; color: #d1d5db; overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
  @keyframes ping { 75%,100%{transform:scale(2.2);opacity:0;} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  select option { background: #111318; }
`;

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:       "#080c10",
  surface:  "#0f1318",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.12)",
  text1:    "#f9fafb",
  text2:    "#d1d5db",
  text3:    "#9ca3af",
  text4:    "#6b7280",
  text5:    "#374151",
  // Accent palette per module
  ceo:     "#6366f1",
  war:     "#f97316",
  content: "#8b5cf6",
  finance: "#22c55e",
  crm:     "#06b6d4",
  live:    "#ec4899",
  hr:      "#f59e0b",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const USERS = [
  { id:1, name:"Rayyan",  role:"CEO",  avatar:"R", accent: C.ceo },
  { id:2, name:"Afzan",   role:"CMO",  avatar:"A", accent: C.crm },
  { id:3, name:"Sarah",   role:"COO",  avatar:"S", accent: C.content },
];

const CLIENTS_DB = [
  { id:1,  name:"HMNS",        tier:"Hyper Scale", retainer:25000, commRate:8,  status:"Active",   gmv:280400, adSpend:52000, shopScore:94, invRisk:"OK",       invUnits:842 },
  { id:2,  name:"CuddleMe",    tier:"Hyper Scale", retainer:25000, commRate:8,  status:"Active",   gmv:214900, adSpend:41000, shopScore:91, invRisk:"OK",       invUnits:610 },
  { id:3,  name:"NaturaCo",    tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:96200,  adSpend:21000, shopScore:83, invRisk:"OK",       invUnits:390 },
  { id:4,  name:"BeautyVault", tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:88100,  adSpend:28000, shopScore:74, invRisk:"LOW",      invUnits:128 },
  { id:5,  name:"FreshBrews",  tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:72400,  adSpend:20000, shopScore:71, invRisk:"OK",       invUnits:245 },
  { id:6,  name:"KidZone",     tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:61000,  adSpend:18000, shopScore:68, invRisk:"LOW",      invUnits:89  },
  { id:7,  name:"PetNest",     tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:48200,  adSpend:22000, shopScore:52, invRisk:"CRITICAL", invUnits:31  },
  { id:8,  name:"UrbanFit",    tier:"Standard",    retainer:15000, commRate:6,  status:"Active",   gmv:38100,  adSpend:19000, shopScore:47, invRisk:"CRITICAL", invUnits:14  },
  { id:9,  name:"GlowSkin",    tier:"Standard",    retainer:15000, commRate:6,  status:"Inactive", gmv:0,      adSpend:0,     shopScore:0,  invRisk:"OK",       invUnits:0   },
  { id:10, name:"TechGadgets", tier:"Standard",    retainer:15000, commRate:6,  status:"Inactive", gmv:0,      adSpend:0,     shopScore:0,  invRisk:"OK",       invUnits:0   },
  { id:11, name:"HomeDecorMY", tier:"Standard",    retainer:15000, commRate:6,  status:"Inactive", gmv:0,      adSpend:0,     shopScore:0,  invRisk:"OK",       invUnits:0   },
];

const CRM_LEADS = [
  { id:1,  name:"PureGlow Skincare", bdm:"Afzan",  tier:"Hyper Scale", stage:"Proposal Sent",  value:25000, probability:75, lastContact:"Jul 25", notes:"Awaiting sign-off from their CMO" },
  { id:2,  name:"SportsFuel MY",     bdm:"Rayyan", tier:"Standard",    stage:"Discovery Call", value:15000, probability:40, lastContact:"Jul 24", notes:"Needs case study on ROAS delivery" },
  { id:3,  name:"BabyBliss Co",      bdm:"Afzan",  tier:"Hyper Scale", stage:"Negotiation",    value:25000, probability:85, lastContact:"Jul 26", notes:"Requesting 3-month pilot arrangement" },
  { id:4,  name:"TechGear PH",       bdm:"Rayyan", tier:"Standard",    stage:"Qualified Lead", value:15000, probability:25, lastContact:"Jul 20", notes:"Regional brand, exploring MY market" },
  { id:5,  name:"EcoWear MY",        bdm:"Sarah",  tier:"Standard",    stage:"Proposal Sent",  value:15000, probability:60, lastContact:"Jul 23", notes:"Sustainability angle — strong brand fit" },
  { id:6,  name:"VitaBoost Labs",    bdm:"Afzan",  tier:"Hyper Scale", stage:"Contract Review", value:25000, probability:90, lastContact:"Jul 27", notes:"Legal reviewing MSA, close this week" },
  { id:7,  name:"CasaLiving MY",     bdm:"Sarah",  tier:"Standard",    stage:"Cold Outreach",  value:15000, probability:10, lastContact:"Jul 18", notes:"No response — second touch needed" },
  { id:8,  name:"NoodleHouse Brand", bdm:"Rayyan", tier:"Standard",    stage:"Discovery Call", value:15000, probability:35, lastContact:"Jul 22", notes:"F&B brand — heavy competitor in space" },
];

const KANBAN_STAGES = ["Script","QC","To Shoot","Edit","Internal QC","Client QC","Ready"];

const CONTENT_CARDS_INIT = [
  { id:1,  client:"HMNS",        title:"Perfume Unboxing Hook #15",    format:"Video", stage:"Script",      assignee:"Afzan",  dueDate:"Jul 29", priority:"High"   },
  { id:2,  client:"HMNS",        title:"Scent Layering — Part 2",      format:"Video", stage:"QC",          assignee:"Afzan",  dueDate:"Jul 30", priority:"High"   },
  { id:3,  client:"HMNS",        title:"8.8 Sale Promo Poster",        format:"Poster",stage:"Edit",        assignee:"Sarah",  dueDate:"Aug 1",  priority:"Medium" },
  { id:4,  client:"HMNS",        title:"Founder Story UGC",            format:"Video", stage:"Internal QC", assignee:"Rayyan", dueDate:"Jul 28", priority:"High"   },
  { id:5,  client:"HMNS",        title:"Product Line Carousel",        format:"Poster",stage:"Client QC",   assignee:"Afzan",  dueDate:"Jul 27", priority:"Medium" },
  { id:6,  client:"HMNS",        title:"GRWM — Office Edition",        format:"Video", stage:"Ready",       assignee:"Sarah",  dueDate:"Jul 26", priority:"Low"    },
  { id:7,  client:"CuddleMe",    title:"Baby Carrier Safety Demo 2",   format:"Video", stage:"Script",      assignee:"Sarah",  dueDate:"Jul 30", priority:"High"   },
  { id:8,  client:"CuddleMe",    title:"Mom Morning Routine Pt2",      format:"Video", stage:"To Shoot",    assignee:"Rayyan", dueDate:"Jul 31", priority:"High"   },
  { id:9,  client:"CuddleMe",    title:"Newborn Bundle Poster",        format:"Poster",stage:"Ready",       assignee:"Afzan",  dueDate:"Jul 25", priority:"Low"    },
  { id:10, client:"NaturaCo",    title:"Ingredient Deep Dive",         format:"Video", stage:"Edit",        assignee:"Sarah",  dueDate:"Aug 2",  priority:"Medium" },
  { id:11, client:"NaturaCo",    title:"Before/After Skincare UGC",    format:"Video", stage:"Script",      assignee:"Afzan",  dueDate:"Aug 3",  priority:"Medium" },
  { id:12, client:"BeautyVault", title:"GRWM — Date Night Look",       format:"Video", stage:"QC",          assignee:"Sarah",  dueDate:"Jul 29", priority:"High"   },
  { id:13, client:"BeautyVault", title:"Shade Range Flat Lay Poster",  format:"Poster",stage:"Client QC",   assignee:"Rayyan", dueDate:"Jul 28", priority:"Medium" },
  { id:14, client:"FreshBrews",  title:"Coffee At Home Challenge #2",  format:"Video", stage:"Internal QC", assignee:"Afzan",  dueDate:"Jul 30", priority:"High"   },
  { id:15, client:"KidZone",     title:"Educational Toy Showcase Vol2",format:"Video", stage:"To Shoot",    assignee:"Sarah",  dueDate:"Aug 1",  priority:"Medium" },
  { id:16, client:"PetNest",     title:"Dog Nutrition Explainer",      format:"Video", stage:"Script",      assignee:"Rayyan", dueDate:"Aug 4",  priority:"Low"    },
  { id:17, client:"UrbanFit",    title:"Workout Haul — Reboot",        format:"Video", stage:"QC",          assignee:"Afzan",  dueDate:"Aug 2",  priority:"Medium" },
  { id:18, client:"HMNS",        title:"New Arrival Teaser",           format:"Video", stage:"Script",      assignee:"Sarah",  dueDate:"Aug 5",  priority:"High"   },
];

const BILLING_DATA = CLIENTS_DB.filter(c => c.status === "Active").map(c => {
  const shipping = Math.round(c.gmv * 0.018);
  const refunds  = Math.round(c.gmv * 0.024);
  const netBase  = c.gmv - shipping - refunds;
  const commission = Math.round(netBase * (c.commRate / 100));
  const invoiceTotal = c.retainer + commission;
  const invoiceStatuses = ["Paid","Paid","Pending","Overdue","Pending","Paid","Pending","Overdue"];
  return { ...c, shipping, refunds, netBase, commission, invoiceTotal,
    invoiceStatus: invoiceStatuses[c.id - 1] || "Pending",
    invoiceDate: `Jul 1, 2025`, dueDate: `Jul 30, 2025` };
});

const GMV_TREND = [
  {month:"Jan",gmv:680000},{month:"Feb",gmv:720000},{month:"Mar",gmv:810000},
  {month:"Apr",gmv:890000},{month:"May",gmv:980000},{month:"Jun",gmv:1050000},{month:"Jul",gmv:1240000},
];

const KOL_DATA = [
  {id:1,client:"HMNS",       handle:"@glowwithsiti",   niche:"Beauty",   shippingStatus:"Delivered", postStatus:"Posted",    gmvDriven:14200,postDate:"Jul 21",rating:4.8},
  {id:2,client:"HMNS",       handle:"@beautybynadia",  niche:"Skincare", shippingStatus:"Delivered", postStatus:"Scheduled", gmvDriven:0,    postDate:"Jul 28",rating:4.6},
  {id:3,client:"CuddleMe",   handle:"@mamahazwani",    niche:"Parenting",shippingStatus:"Delivered", postStatus:"Posted",    gmvDriven:9800, postDate:"Jul 22",rating:4.9},
  {id:4,client:"CuddleMe",   handle:"@parentingmy",    niche:"Parenting",shippingStatus:"In Transit",postStatus:"Pending",   gmvDriven:0,    postDate:"Jul 29",rating:4.4},
  {id:5,client:"FreshBrews", handle:"@cafehopping_kl", niche:"Lifestyle",shippingStatus:"Delivered", postStatus:"Posted",    gmvDriven:5400, postDate:"Jul 20",rating:4.2},
  {id:6,client:"NaturaCo",   handle:"@organicmamas",   niche:"Wellness", shippingStatus:"Delivered", postStatus:"Overdue",   gmvDriven:0,    postDate:"Jul 23",rating:3.9},
  {id:7,client:"BeautyVault",handle:"@makeupjunkie.my",niche:"Makeup",   shippingStatus:"In Transit",postStatus:"Pending",   gmvDriven:0,    postDate:"Jul 31",rating:4.5},
];

const ADS_DATA = [
  {id:1, client:"HMNS",        title:"Perfume Unboxing Hook #14", platform:"TikTok", spend:8200, roas:6.8,gmv:55776,status:"Scaling",ctr:4.2,cpc:0.82},
  {id:2, client:"HMNS",        title:"Scent Layering Tutorial",   platform:"TikTok", spend:6100, roas:5.9,gmv:35990,status:"Scaling",ctr:3.8,cpc:0.94},
  {id:3, client:"CuddleMe",    title:"Baby Carrier Safety Demo",  platform:"TikTok", spend:7800, roas:6.2,gmv:48360,status:"Scaling",ctr:5.1,cpc:0.77},
  {id:4, client:"BeautyVault", title:"Get Ready With Me",         platform:"TikTok", spend:5500, roas:2.8,gmv:15400,status:"Testing",ctr:1.9,cpc:1.54},
  {id:5, client:"PetNest",     title:"Dog Nutrition Guide",       platform:"TikTok", spend:3800, roas:1.8,gmv:6840, status:"Paused", ctr:1.1,cpc:2.45},
  {id:6, client:"UrbanFit",    title:"Workout Essentials Haul",   platform:"TikTok", spend:4100, roas:1.7,gmv:6970, status:"Paused", ctr:0.9,cpc:2.89},
  {id:7, client:"FreshBrews",  title:"Coffee At Home Challenge",  platform:"TikTok", spend:2900, roas:3.4,gmv:9860, status:"Active", ctr:2.8,cpc:1.08},
  {id:8, client:"NaturaCo",    title:"Ingredient Breakdown",      platform:"TikTok", spend:3800, roas:3.9,gmv:14820,status:"Active", ctr:2.6,cpc:1.18},
];

const PROMO_TASKS_INIT = [
  {id:1,client:"HMNS",       task:"7.7 Flash Sale Vouchers",         platform:"TikTok",dueDate:"Jul 28",status:"Done",      assignee:"Rayyan"},
  {id:2,client:"HMNS",       task:"8.8 Shop Banner Upload",          platform:"Shopee",dueDate:"Aug 1", status:"In Progress",assignee:"Afzan"},
  {id:3,client:"CuddleMe",   task:"Bundle Deal — 3 SKU Config",      platform:"TikTok",dueDate:"Jul 29",status:"Done",      assignee:"Rayyan"},
  {id:4,client:"BeautyVault",task:"Paid Search Budget Realloc",      platform:"TikTok",dueDate:"Jul 28",status:"Overdue",   assignee:"Afzan"},
  {id:5,client:"PetNest",    task:"Pause Ads — Await Restock",       platform:"TikTok",dueDate:"Jul 27",status:"Overdue",   assignee:"Sarah"},
  {id:6,client:"FreshBrews", task:"Flash Deal Slot — 12PM Shopee",   platform:"Shopee",dueDate:"Jul 29",status:"In Progress",assignee:"Rayyan"},
  {id:7,client:"UrbanFit",   task:"Retainer Payment Chase",          platform:"—",     dueDate:"Jul 27",status:"Overdue",   assignee:"Sarah"},
  {id:8,client:"KidZone",    task:"Competitor Price Match Analysis", platform:"Shopee",dueDate:"Jul 31",status:"Pending",   assignee:"Afzan"},
];

// ─── SHARED UTILITIES ─────────────────────────────────────────────────────────

const fmtK  = n => n >= 1e6 ? `RM${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `RM${(n/1e3).toFixed(0)}K` : `RM${n}`;
const fmtFull = n => `RM ${n.toLocaleString("en-MY")}`;
const roasClr = r => r>=5?"#22c55e":r>=3.5?"#86efac":r>=2.5?"#f59e0b":"#ef4444";
const invClr  = s => s==="OK"?"#22c55e":s==="LOW"?"#f59e0b":"#ef4444";
const scClr   = s => s>=85?"#22c55e":s>=70?"#f59e0b":"#ef4444";

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

function Tag({ label, color, small }) {
  return (
    <span style={{
      fontSize: small ? 8 : 9, fontWeight: 800, letterSpacing: "0.11em",
      textTransform: "uppercase", color,
      background: color+"18", padding: small ? "2px 5px" : "3px 7px",
      borderRadius: 5, border: `1px solid ${color}30`, whiteSpace: "nowrap", flexShrink: 0,
    }}>{label}</span>
  );
}

function PulseDot({ color="#22c55e", size=8 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", width:size, height:size, flexShrink:0 }}>
      <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color,
        opacity:0.4, animation:"ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
      <span style={{ width:size, height:size, borderRadius:"50%", background:color }} />
    </span>
  );
}

function Card({ children, accent, style={}, highlight }) {
  return (
    <div style={{
      background: highlight ? `${accent}08` : `rgba(255,255,255,0.025)`,
      border: `1px solid ${highlight ? accent+"30" : C.border}`,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      borderRadius: 12, ...style,
    }}>{children}</div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0" }}>
      <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.18em", color:C.text5, textTransform:"uppercase", whiteSpace:"nowrap" }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, background:C.border }} />
    </div>
  );
}

function KpiCard({ label, value, sub, accent, trend, live, delay=0 }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.025)", border:`1px solid ${C.border}`,
      borderRadius:14, padding:"18px 20px", position:"relative", overflow:"hidden",
      animation:`fadeUp 0.5s ease ${delay}s both`,
      transition:"border-color 0.2s",
    }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=accent+"55"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
    >
      <div style={{ position:"absolute", top:0, right:0, width:100, height:100,
        background:`radial-gradient(circle at 100% 0%, ${accent}20 0%, transparent 65%)`, pointerEvents:"none" }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.16em", color:C.text4, textTransform:"uppercase" }}>{label}</span>
        {live && <div style={{display:"flex",alignItems:"center",gap:5}}><PulseDot color="#ef4444" size={7}/><span style={{fontSize:9,color:"#ef4444",fontWeight:700}}>LIVE</span></div>}
      </div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:C.text1, letterSpacing:"-0.01em" }}>{value}</div>
      {sub && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:5 }}>
          {trend!=null && <span style={{ fontSize:10, fontWeight:700, color:trend>=0?"#22c55e":"#ef4444" }}>{trend>=0?"▲":"▼"}{Math.abs(trend)}%</span>}
          <span style={{ fontSize:11, color:C.text4 }}>{sub}</span>
        </div>
      )}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg,${accent}99,transparent)` }} />
    </div>
  );
}

function ScoreBar({ value, max=100, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.07)", borderRadius:99 }}>
        <div style={{ width:`${(value/max)*100}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.8s" }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color, width:26, textAlign:"right" }}>{value}</span>
    </div>
  );
}

function TableWrap({ children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>{children}</table>
    </div>
  );
}

function Th({ children, onClick, active }) {
  return (
    <th onClick={onClick} style={{
      padding:"9px 14px", textAlign:"left", fontSize:9, fontWeight:800,
      letterSpacing:"0.14em", color: active ? C.war : C.text5, textTransform:"uppercase",
      whiteSpace:"nowrap", cursor: onClick?"pointer":"default",
      background:"rgba(255,255,255,0.03)", borderBottom:`1px solid ${C.border}`,
      userSelect:"none"
    }}>{children}</th>
  );
}

function Td({ children, style={} }) {
  return <td style={{ padding:"11px 14px", borderBottom:`1px solid rgba(255,255,255,0.04)`, ...style }}>{children}</td>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 1 · CEO DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function CEODashboard() {
  const activeClients = CLIENTS_DB.filter(c=>c.status==="Active");
  const totalGMV   = activeClients.reduce((a,c)=>a+c.gmv,0);
  const totalSpend = activeClients.reduce((a,c)=>a+c.adSpend,0);
  const totalRetainer = activeClients.reduce((a,c)=>a+c.retainer,0);
  const projComm   = BILLING_DATA.reduce((a,c)=>a+c.commission,0);
  const avgROAS    = (totalGMV/totalSpend).toFixed(1);
  const maxGMV     = Math.max(...activeClients.map(c=>c.gmv));

  const ALERTS = [
    {icon:"💰",label:"FINANCE",  msg:"RM 25,000 invoice paid — HMNS (Jul 2025)", urgency:"success", time:"2m ago"},
    {icon:"⚠️",label:"ADS MGR", msg:"Low inventory — PetNest SKU #PT-009 (<31 units)", urgency:"warning", time:"14m ago"},
    {icon:"🔴",label:"LIVE",     msg:"CuddleMe Live GMV RM 18,400 — Session #3 ongoing", urgency:"live",    time:"31m ago"},
    {icon:"📦",label:"KOL",      msg:"3 seeding packages undelivered — FreshBrews D-2", urgency:"warning", time:"1h ago"},
    {icon:"🚨",label:"FINANCE",  msg:"UrbanFit retainer overdue — Day 7. Escalation sent.", urgency:"danger", time:"3h ago"},
  ];

  const urgMap = { success:{b:"rgba(34,197,94,0.15)",d:"#22c55e"}, warning:{b:"rgba(245,158,11,0.12)",d:"#f59e0b"}, danger:{b:"rgba(239,68,68,0.12)",d:"#ef4444"}, live:{b:"rgba(239,68,68,0.1)",d:"#ef4444"}, info:{b:"rgba(99,102,241,0.1)",d:C.ceo} };

  const svgTrend = () => {
    const w=340,h=64,pd=8;
    const max=Math.max(...GMV_TREND.map(d=>d.gmv));
    const pts=GMV_TREND.map((d,i)=>{
      const x=pd+(i/(GMV_TREND.length-1))*(w-pd*2);
      const y=h-pd-((d.gmv/max)*(h-pd*2));
      return [x,y];
    });
    const line=`M${pts.map(p=>p.join(",")).join(" L")}`;
    const area=`${line} L${w-pd},${h} L${pd},${h} Z`;
    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
        <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.ceo} stopOpacity="0.5"/><stop offset="100%" stopColor={C.ceo} stopOpacity="0"/></linearGradient></defs>
        <path d={area} fill="url(#tg)"/>
        <path d={line} fill="none" stroke={C.ceo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={i===pts.length-1?4:2.5}
            fill={i===pts.length-1?"#a5b4fc":C.ceo}/>
        ))}
      </svg>
    );
  };

  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:22, overflowY:"auto", flex:1 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <PulseDot color="#22c55e" size={8}/>
            <span style={{ fontSize:10, color:"#22c55e", fontWeight:700, letterSpacing:"0.1em" }}>SYSTEM LIVE · {new Date().toLocaleDateString("en-MY",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:900, color:C.text1, letterSpacing:"-0.02em", margin:0 }}>CEO Command Center</h1>
          <p style={{ fontSize:12, color:C.text4, marginTop:3 }}>Creaitors Enterprise OS · Real-time portfolio overview</p>
        </div>
        <div style={{ background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:10, padding:"8px 16px" }}>
          <span style={{ fontSize:11, color:"#a5b4fc", fontWeight:700 }}>📅 Jul 2025 — Active MRR Cycle</span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard label="Live MRR" value={fmtFull(totalRetainer)} sub="All retainers" accent={C.ceo} trend={12} live delay={0}/>
        <KpiCard label="Proj. Commission" value={fmtK(projComm)} sub="Net GMV ×8/6%" accent={C.finance} trend={8} delay={0.05}/>
        <KpiCard label="Active Clients" value={activeClients.length} sub={`${activeClients.filter(c=>c.tier==="Hyper Scale").length} Hyper · ${activeClients.filter(c=>c.tier==="Standard").length} Standard`} accent={C.hr} delay={0.1}/>
        <KpiCard label="Portfolio ROAS" value={`${avgROAS}x`} sub="vs 3.8x last month" accent={roasClr(parseFloat(avgROAS))} trend={10} delay={0.15}/>
      </div>

      {/* KPI Row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        <KpiCard label="Total GMV — Jul" value={fmtK(totalGMV)} sub="All active clients" accent={C.crm} trend={15} delay={0.2}/>
        <KpiCard label="Total Ad Spend" value={fmtK(totalSpend)} sub="Under management" accent={C.content} delay={0.25}/>
        <KpiCard label="KOL Win Rate" value="73%" sub="Seeding-to-post conv." accent={C.live} trend={5} delay={0.3}/>
      </div>

      {/* Middle: Pipeline + Trend + Pipeline Value */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:18 }}>
        {/* Client Pipeline Risk */}
        <Card style={{ padding:"18px 22px" }}>
          <SectionDivider label="Client Pipeline Health — KKM Status"/>
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginTop:16 }}>
            {activeClients.map(c=>{
              const color = c.shopScore>=80?"#22c55e":c.shopScore>=60?"#f59e0b":"#ef4444";
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:C.text2, width:90, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                  <div style={{ flex:1, height:24, background:"rgba(255,255,255,0.05)", borderRadius:5, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", width:`${(c.gmv/maxGMV)*100}%`,
                      background:color, opacity:0.85, borderRadius:5,
                      display:"flex", alignItems:"center", paddingLeft:8, transition:"width 1s"
                    }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>{fmtK(c.gmv)}</span>
                    </div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color, width:26, textAlign:"right", flexShrink:0 }}>{c.shopScore}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* GMV Trend */}
          <Card style={{ padding:"16px 20px", flex:1 }}>
            <SectionDivider label="GMV Trend — Jan→Jul 2025"/>
            <div style={{ marginTop:14 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:10 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#a5b4fc" }}>{fmtK(totalGMV)}</span>
                <span style={{ fontSize:10, color:"#22c55e", fontWeight:700 }}>▲ 26% MoM</span>
              </div>
              {svgTrend()}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                {GMV_TREND.map((d,i)=>(
                  <span key={i} style={{ fontSize:9, color: i===GMV_TREND.length-1?"#a5b4fc":C.text5,
                    fontWeight: i===GMV_TREND.length-1?700:400 }}>{d.month}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* Pipeline Value */}
          <Card accent={C.ceo} highlight style={{ padding:"16px 20px" }}>
            <div style={{ fontSize:9, fontWeight:800, letterSpacing:"0.16em", color:"#818cf8", textTransform:"uppercase", marginBottom:6 }}>Sales Pipeline Value</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#e0e7ff" }}>RM 320,000</div>
            <div style={{ fontSize:11, color:"#818cf8", marginTop:2 }}>8 prospects · 2 closing this week</div>
            <div style={{ marginTop:10, height:6, background:"rgba(255,255,255,0.08)", borderRadius:99 }}>
              <div style={{ width:"63%", height:"100%", background:"linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius:99 }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:9, color:C.text5 }}>Pipeline to ARR target</span>
              <span style={{ fontSize:10, color:"#818cf8", fontWeight:700 }}>63%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Alerts */}
      <Card style={{ padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <PulseDot color="#ef4444" size={7}/>
            <span style={{ fontSize:12, fontWeight:700, color:C.text2 }}>{ALERTS.length} Live System Alerts</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {ALERTS.map((a,i)=>{
            const s=urgMap[a.urgency]||urgMap.info;
            return (
              <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px",
                background:s.b, border:`1px solid ${s.d}25`, borderRadius:8 }}>
                <span style={{ fontSize:14, flexShrink:0, lineHeight:1.4 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:2 }}>
                    <span style={{ fontSize:8, fontWeight:900, letterSpacing:"0.14em", color:s.d }}>{a.label}</span>
                    <span style={{ fontSize:9, color:C.text5 }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize:12, color:C.text3, margin:0 }}>{a.msg}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 2 · WAR ROOM
// ═══════════════════════════════════════════════════════════════════════════════

function WarRoom() {
  const [tab, setTab] = useState("shop");
  const [clientFilter, setClientFilter] = useState("All");
  const [promoTasks, setPromoTasks] = useState(PROMO_TASKS_INIT);
  const [adSort, setAdSort] = useState({col:"roas",dir:"desc"});

  const clients = ["All",...Array.from(new Set(CLIENTS_DB.filter(c=>c.status==="Active").map(c=>c.name)))];
  const filterFn = arr => clientFilter==="All" ? arr : arr.filter(d=>d.client===clientFilter);

  const shopData  = filterFn(CLIENTS_DB.filter(c=>c.status==="Active"));
  const kolData   = filterFn(KOL_DATA);
  const adsData   = filterFn(ADS_DATA).sort((a,b)=>adSort.dir==="desc"?b[adSort.col]-a[adSort.col]:a[adSort.col]-b[adSort.col]);
  const promoData = filterFn(promoTasks);

  const TABS=[
    {id:"shop",  label:"SHOP HEALTH",    badgeFn:()=>shopData.filter(c=>c.invRisk!=="OK").length},
    {id:"kol",   label:"KOL LOGISTICS",  badgeFn:()=>kolData.filter(k=>k.postStatus==="Overdue").length},
    {id:"ads",   label:"ADS TRACKER",    badgeFn:()=>adsData.filter(a=>a.status==="Paused").length},
    {id:"promo", label:"PROMO TASKS",    badgeFn:()=>promoData.filter(p=>p.status==="Overdue").length},
  ];

  const cycleTask = id => {
    const cycle = ["Pending","In Progress","Done","Overdue"];
    setPromoTasks(prev=>prev.map(t=>t.id!==id?t:{...t, status:cycle[(cycle.indexOf(t.status)+1)%cycle.length]}));
  };

  const sortAds = col => setAdSort(s=>({col, dir: s.col===col&&s.dir==="desc"?"asc":"desc"}));

  const statClr = { Done:"#22c55e","In Progress":C.ceo, Overdue:"#ef4444", Pending:C.text4 };
  const adStClr = { Scaling:"#22c55e", Active:C.ceo, Testing:C.hr, Paused:"#ef4444" };

  const SummaryStrip = ({items}) => (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${items.length},1fr)`, gap:12, marginBottom:18 }}>
      {items.map(m=>(
        <Card key={m.label} accent={m.accent} style={{ padding:"12px 16px" }}>
          <div style={{ fontSize:9, fontWeight:800, letterSpacing:"0.14em", color:C.text4, textTransform:"uppercase", marginBottom:5 }}>{m.label}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:m.accent }}>{m.value}</div>
        </Card>
      ))}
    </div>
  );

  const renderShop = () => (
    <div>
      <SummaryStrip items={[
        {label:"Portfolio GMV", value:fmtK(shopData.reduce((a,c)=>a+c.gmv,0)), accent:"#22c55e"},
        {label:"Ad Spend",      value:fmtK(shopData.reduce((a,c)=>a+c.adSpend,0)), accent:C.ceo},
        {label:"Blended ROAS",  value:`${(shopData.reduce((a,c)=>a+c.gmv,0)/shopData.reduce((a,c)=>a+c.adSpend,0)).toFixed(1)}x`, accent:roasClr(shopData.reduce((a,c)=>a+c.gmv,0)/shopData.reduce((a,c)=>a+c.adSpend,0))},
        {label:"Critical Inv.", value:shopData.filter(c=>c.invRisk==="CRITICAL").length, accent:"#ef4444"},
      ]}/>
      <TableWrap>
        <thead>
          <tr>{["Client","GMV","Ad Spend","ROAS","Shop Score","Inv. Risk","Units"].map(h=><Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>
          {shopData.map(c=>(
            <tr key={c.id} style={{ background: c.invRisk==="CRITICAL"?"rgba(239,68,68,0.04)":"transparent" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background=c.invRisk==="CRITICAL"?"rgba(239,68,68,0.04)":"transparent"}>
              <Td><span style={{fontWeight:700,color:C.text1,fontSize:13}}>{c.name}</span></Td>
              <Td><span style={{fontWeight:700,color:C.text1}}>{fmtFull(c.gmv)}</span></Td>
              <Td><span style={{color:C.text3,fontSize:12}}>{fmtFull(c.adSpend)}</span></Td>
              <Td>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,
                  color:roasClr(+(c.gmv/c.adSpend).toFixed(1)),
                  background:roasClr(+(c.gmv/c.adSpend).toFixed(1))+"18",padding:"2px 7px",borderRadius:5}}>
                  {(c.gmv/c.adSpend).toFixed(1)}x
                </span>
              </Td>
              <Td style={{minWidth:130}}><ScoreBar value={c.shopScore} color={scClr(c.shopScore)}/></Td>
              <Td><Tag label={c.invRisk} color={invClr(c.invRisk)}/></Td>
              <Td><span style={{fontSize:12,color:C.text3}}>{c.invUnits}</span></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );

  const renderKOL = () => {
    const shipClr = s=>s==="Delivered"?"#22c55e":s==="In Transit"?C.hr:C.text4;
    const postClr = s=>s==="Posted"?"#22c55e":s==="Scheduled"?C.ceo:s==="Overdue"?"#ef4444":C.text4;
    return (
      <div>
        <SummaryStrip items={[
          {label:"Delivered",      value:`${kolData.filter(k=>k.shippingStatus==="Delivered").length}/${kolData.length}`, accent:"#22c55e"},
          {label:"Posts Live",     value:`${kolData.filter(k=>k.postStatus==="Posted").length}/${kolData.length}`, accent:C.ceo},
          {label:"Overdue Posts",  value:kolData.filter(k=>k.postStatus==="Overdue").length, accent:"#ef4444"},
          {label:"KOL-Driven GMV", value:fmtK(kolData.reduce((a,k)=>a+k.gmvDriven,0)), accent:C.war},
        ]}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {kolData.map(k=>(
            <Card key={k.id} highlight={k.postStatus==="Overdue"} accent={k.postStatus==="Overdue"?"#ef4444":undefined} style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                    <span style={{fontWeight:800,color:C.text1,fontSize:13}}>{k.handle}</span>
                    {k.postStatus==="Overdue"&&<Tag label="OVERDUE" color="#ef4444" small/>}
                  </div>
                  <div style={{display:"flex",gap:5}}><Tag label={k.niche} color={C.content} small/><Tag label={k.client} color={C.war} small/></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:C.text4}}>Rating</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,color:C.hr}}>★ {k.rating}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                {[
                  {lbl:"SHIPPING", val:<Tag label={k.shippingStatus} color={shipClr(k.shippingStatus)} small/>},
                  {lbl:"POST",     val:<Tag label={k.postStatus}     color={postClr(k.postStatus)} small/>},
                  {lbl:k.gmvDriven>0?"GMV DRIVEN":"POST DATE", val:<span style={{fontSize:12,fontWeight:700,color:k.gmvDriven>0?"#22c55e":C.text3}}>{k.gmvDriven>0?fmtK(k.gmvDriven):k.postDate}</span>},
                ].map(item=>(
                  <div key={item.lbl} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"7px 9px"}}>
                    <div style={{fontSize:8,color:C.text4,marginBottom:3}}>{item.lbl}</div>
                    {item.val}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAds = () => (
    <div>
      <SummaryStrip items={[
        {label:"Total Spend",  value:fmtK(adsData.reduce((a,d)=>a+d.spend,0)), accent:C.ceo},
        {label:"GMV from Ads", value:fmtK(adsData.reduce((a,d)=>a+d.gmv,0)),   accent:"#22c55e"},
        {label:"Blended ROAS", value:`${(adsData.reduce((a,d)=>a+d.gmv,0)/adsData.reduce((a,d)=>a+d.spend,0)).toFixed(1)}x`, accent:C.hr},
        {label:"Paused Ads",   value:adsData.filter(d=>d.status==="Paused").length, accent:"#ef4444"},
      ]}/>
      <TableWrap>
        <thead>
          <tr>
            {[{l:"Client"},{l:"Asset/Title"},{l:"Platform"},{l:"Spend",c:"spend"},{l:"ROAS",c:"roas"},{l:"GMV",c:"gmv"},{l:"CTR",c:"ctr"},{l:"CPC",c:"cpc"},{l:"Status"}].map(h=>(
              <Th key={h.l} onClick={h.c?()=>sortAds(h.c):undefined} active={adSort.col===h.c}>
                {h.l}{h.c&&adSort.col===h.c?(adSort.dir==="desc"?" ↓":" ↑"):""}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {adsData.map(d=>(
            <tr key={d.id} style={{opacity:d.status==="Paused"?0.65:1,background:d.status==="Paused"?"rgba(239,68,68,0.03)":"transparent"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background=d.status==="Paused"?"rgba(239,68,68,0.03)":"transparent"}>
              <Td><span style={{fontWeight:700,fontSize:12,color:C.text1}}>{d.client}</span></Td>
              <Td><span style={{fontSize:11,color:C.text3,maxWidth:180,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.title}</span></Td>
              <Td><Tag label={d.platform} color={d.platform==="TikTok"?"#ec4899":C.war} small/></Td>
              <Td><span style={{fontSize:12,color:C.text3}}>RM {d.spend.toLocaleString()}</span></Td>
              <Td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,color:roasClr(d.roas)}}>{d.roas}x</span></Td>
              <Td><span style={{fontSize:12,fontWeight:600,color:C.text2}}>RM {d.gmv.toLocaleString()}</span></Td>
              <Td><span style={{fontSize:12,color:C.text3}}>{d.ctr}%</span></Td>
              <Td><span style={{fontSize:12,color:C.text3}}>RM {d.cpc}</span></Td>
              <Td><Tag label={d.status} color={adStClr[d.status]} small/></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );

  const renderPromo = () => {
    const done = promoData.filter(t=>t.status==="Done").length;
    return (
      <div>
        <SummaryStrip items={[
          {label:"Completed",   value:`${done}/${promoData.length}`, accent:"#22c55e"},
          {label:"In Progress", value:promoData.filter(t=>t.status==="In Progress").length, accent:C.ceo},
          {label:"Overdue",     value:promoData.filter(t=>t.status==="Overdue").length,      accent:"#ef4444"},
          {label:"Pending",     value:promoData.filter(t=>t.status==="Pending").length,      accent:C.text4},
        ]}/>
        <Card style={{ padding:"12px 16px", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.text4,textTransform:"uppercase"}}>Completion Rate</span>
            <span style={{fontSize:11,fontWeight:800,color:"#22c55e"}}>{Math.round((done/promoData.length)*100)}%</span>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
            <div style={{width:`${Math.round((done/promoData.length)*100)}%`,height:"100%",background:"linear-gradient(90deg,#22c55e,#86efac)",borderRadius:99,transition:"width 0.8s"}}/>
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {promoData.map(t=>(
            <div key={t.id} style={{
              display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
              background:t.status==="Overdue"?"rgba(239,68,68,0.06)":"rgba(255,255,255,0.025)",
              border:`1px solid ${t.status==="Overdue"?"rgba(239,68,68,0.2)":C.border}`,
              borderRadius:9, transition:"all 0.15s"
            }}>
              <button onClick={()=>cycleTask(t.id)} style={{
                width:19,height:19,borderRadius:5,flexShrink:0,cursor:"pointer",
                background:t.status==="Done"?"#22c55e":"transparent",
                border:`2px solid ${t.status==="Done"?"#22c55e":"#374151"}`,
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"
              }}>{t.status==="Done"&&<span style={{fontSize:9,color:"#fff",fontWeight:900}}>✓</span>}</button>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:t.status==="Done"?C.text5:C.text2,
                  textDecoration:t.status==="Done"?"line-through":"none"}}>{t.task}</div>
                <div style={{display:"flex",gap:5,marginTop:3}}>
                  <Tag label={t.client} color={C.war} small/>
                  {t.platform!=="—"&&<Tag label={t.platform} color={t.platform==="TikTok"?"#ec4899":C.war} small/>}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <Tag label={t.status} color={statClr[t.status]} small/>
                <div style={{fontSize:9,color:C.text5,marginTop:3}}>Due {t.dueDate}</div>
                <div style={{fontSize:9,color:C.text5}}>→ {t.assignee}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMap = { shop:renderShop, kol:renderKOL, ads:renderAds, promo:renderPromo };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* War Room Header */}
      <div style={{ padding:"0 22px", height:50, background:"rgba(249,115,22,0.06)", borderBottom:"1px solid rgba(249,115,22,0.15)",
        display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <PulseDot color="#ef4444" size={8}/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:900, letterSpacing:"0.18em", color:C.war, textTransform:"uppercase" }}>⚔ WAR ROOM</span>
        </div>
        <div style={{width:1,height:20,background:"rgba(249,115,22,0.2)"}}/>
        {[
          {l:"PORTFOLIO GMV", v:fmtK(CLIENTS_DB.filter(c=>c.status==="Active").reduce((a,c)=>a+c.gmv,0)), c:"#22c55e"},
          {l:"CRITICAL INV",  v:CLIENTS_DB.filter(c=>c.invRisk==="CRITICAL").length, c:"#ef4444"},
          {l:"OVERDUE KOL",   v:KOL_DATA.filter(k=>k.postStatus==="Overdue").length, c:C.hr},
          {l:"PAUSED ADS",    v:ADS_DATA.filter(a=>a.status==="Paused").length, c:"#ef4444"},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,
              background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:C.text4}}>CLIENT</span>
          <select value={clientFilter} onChange={e=>setClientFilter(e.target.value)} style={{
            background:"rgba(255,255,255,0.07)",border:`1px solid ${C.borderHi}`,borderRadius:7,
            color:C.text2,fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:"4px 10px",cursor:"pointer",outline:"none"
          }}>
            {clients.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", padding:"0 22px", background:C.bg, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {TABS.map(t=>{
          const isActive = tab===t.id;
          const badge = t.badgeFn();
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"11px 18px", background:"none", cursor:"pointer", border:"none",
              borderBottom:isActive?`2px solid ${C.war}`:"2px solid transparent",
              color:isActive?C.war:C.text4, fontFamily:"'JetBrains Mono',monospace",
              fontSize:10, fontWeight:isActive?700:500, letterSpacing:"0.08em",
              display:"flex",alignItems:"center",gap:6,marginBottom:-1,transition:"all 0.15s"
            }}>
              {t.label}
              {badge>0&&<span style={{fontSize:8,fontWeight:900,color:"#ef4444",background:"rgba(239,68,68,0.15)",
                padding:"1px 5px",borderRadius:4,border:"1px solid rgba(239,68,68,0.3)"}}>{badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 22px", animation:"fadeUp 0.3s ease" }}>
        {(renderMap[tab]||(()=>null))()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 3 · CONTENT FACTORY  (7-stage Kanban)
// ═══════════════════════════════════════════════════════════════════════════════

function ContentFactory() {
  const [cards, setCards] = useState(CONTENT_CARDS_INIT);
  const [filterClient, setFilterClient] = useState("All");
  const [filterFormat, setFilterFormat] = useState("All");
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const clients = ["All",...Array.from(new Set(CONTENT_CARDS_INIT.map(c=>c.client)))];
  const filtered = cards
    .filter(c=>filterClient==="All"||c.client===filterClient)
    .filter(c=>filterFormat==="All"||c.format===filterFormat);

  const byStage = KANBAN_STAGES.reduce((acc,s)=>({...acc,[s]:filtered.filter(c=>c.stage===s)}),[]);

  const stageAccent = {
    "Script":"#6366f1","QC":"#8b5cf6","To Shoot":"#ec4899",
    "Edit":"#f59e0b","Internal QC":"#06b6d4","Client QC":"#f97316","Ready":"#22c55e"
  };
  const priorityClr = {High:"#ef4444",Medium:C.hr,Low:"#22c55e"};

  const advanceCard = (cardId) => {
    setCards(prev=>prev.map(c=>{
      if(c.id!==cardId) return c;
      const idx = KANBAN_STAGES.indexOf(c.stage);
      if(c.format==="Poster"&&c.stage==="QC") return {...c, stage:"Edit"};
      if(idx<KANBAN_STAGES.length-1) return {...c, stage:KANBAN_STAGES[idx+1]};
      return c;
    }));
  };

  const onDragStart = (id) => setDragging(id);
  const onDrop = (stage) => {
    if(dragging==null) return;
    setCards(prev=>prev.map(c=>c.id===dragging?{...c,stage}:c));
    setDragging(null); setDragOver(null);
  };

  const totalReady    = cards.filter(c=>c.stage==="Ready").length;
  const totalInFlight = cards.filter(c=>c.stage!=="Ready").length;

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"0 22px", height:50, background:"rgba(139,92,246,0.06)", borderBottom:"1px solid rgba(139,92,246,0.15)",
        display:"flex",alignItems:"center",gap:14,flexShrink:0 }}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,letterSpacing:"0.18em",color:C.content,textTransform:"uppercase"}}>◧ CONTENT FACTORY</span>
        <div style={{width:1,height:20,background:"rgba(139,92,246,0.2)"}}/>
        {[
          {l:"TOTAL ASSETS",  v:cards.length, c:C.content},
          {l:"IN FLIGHT",     v:totalInFlight, c:C.hr},
          {l:"READY",         v:totalReady, c:"#22c55e"},
          {l:"VIDEOS",        v:cards.filter(c=>c.format==="Video").length, c:"#ec4899"},
          {l:"POSTERS",       v:cards.filter(c=>c.format==="Poster").length, c:C.crm},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:8}}>
          {[{label:"Client",value:filterClient,setter:setFilterClient,opts:clients},
            {label:"Format",value:filterFormat,setter:setFilterFormat,opts:["All","Video","Poster"]}
          ].map(f=>(
            <div key={f.label} style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:C.text4}}>{f.label.toUpperCase()}</span>
              <select value={f.value} onChange={e=>f.setter(e.target.value)} style={{
                background:"rgba(255,255,255,0.07)",border:`1px solid ${C.borderHi}`,borderRadius:7,
                color:C.text2,fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:"4px 10px",cursor:"pointer",outline:"none"
              }}>
                {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Stage headers legend */}
      <div style={{ padding:"10px 22px 0", display:"flex", gap:8, flexShrink:0, overflowX:"auto" }}>
        {KANBAN_STAGES.map(s=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:stageAccent[s],display:"inline-block"}}/>
            <span style={{fontSize:9,fontWeight:600,color:C.text4,letterSpacing:"0.08em"}}>{s} ({(byStage[s]||[]).length})</span>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div style={{ flex:1, overflowX:"auto", padding:"14px 22px 22px", display:"flex", gap:12 }}>
        {KANBAN_STAGES.map(stage=>{
          const stageCards = byStage[stage]||[];
          const accent = stageAccent[stage];
          const isOver = dragOver===stage;
          return (
            <div key={stage}
              onDragOver={e=>{e.preventDefault();setDragOver(stage);}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={()=>onDrop(stage)}
              style={{
                width:200,minWidth:200,flexShrink:0,display:"flex",flexDirection:"column",gap:8,
                background: isOver?"rgba(255,255,255,0.05)":"transparent",
                border:`1px dashed ${isOver?accent:C.border}`,borderRadius:12,
                padding:"10px 8px",transition:"all 0.15s"
              }}>
              {/* Column Header */}
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 4px",marginBottom:4 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:accent,display:"inline-block",flexShrink:0}}/>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:C.text2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{stage}</span>
                </div>
                <span style={{fontSize:11,fontWeight:800,color:accent,background:accent+"18",
                  padding:"1px 7px",borderRadius:99,minWidth:22,textAlign:"center"}}>{stageCards.length}</span>
              </div>
              <div style={{height:2,background:accent,borderRadius:99,marginBottom:4,opacity:0.6}}/>

              {/* Cards */}
              {stageCards.map(card=>(
                <div key={card.id}
                  draggable
                  onDragStart={()=>onDragStart(card.id)}
                  onDragEnd={()=>{setDragging(null);setDragOver(null);}}
                  style={{
                    background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:9,
                    padding:"10px 11px",cursor:"grab",transition:"all 0.15s",
                    opacity:dragging===card.id?0.4:1,
                  }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=accent+"66"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                >
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
                    <Tag label={card.client} color={C.war} small/>
                    <Tag label={card.priority} color={priorityClr[card.priority]} small/>
                  </div>
                  <p style={{fontSize:11,fontWeight:600,color:C.text2,lineHeight:1.4,marginBottom:7}}>{card.title}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <Tag label={card.format} color={card.format==="Video"?"#ec4899":C.crm} small/>
                    <span style={{fontSize:9,color:C.text5}}>{card.dueDate}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:16,height:16,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#ec4899)",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff",flexShrink:0}}>
                        {card.assignee[0]}
                      </div>
                      <span style={{fontSize:9,color:C.text4}}>{card.assignee}</span>
                    </div>
                    {stage!=="Ready"&&(
                      <button onClick={()=>advanceCard(card.id)} style={{
                        fontSize:8,fontWeight:800,letterSpacing:"0.1em",color:accent,
                        background:accent+"15",border:`1px solid ${accent}30`,
                        borderRadius:5,padding:"2px 6px",cursor:"pointer"
                      }}>ADVANCE →</button>
                    )}
                  </div>
                </div>
              ))}

              {stageCards.length===0&&(
                <div style={{textAlign:"center",padding:"20px 0",color:C.text5,fontSize:11}}>
                  Drop here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 4 · FINANCE VAULT
// ═══════════════════════════════════════════════════════════════════════════════

function FinanceVault() {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const displayed = filterStatus==="All" ? BILLING_DATA : BILLING_DATA.filter(b=>b.invoiceStatus===filterStatus);
  const totalInvoiced = BILLING_DATA.reduce((a,b)=>a+b.invoiceTotal,0);
  const totalPaid     = BILLING_DATA.filter(b=>b.invoiceStatus==="Paid").reduce((a,b)=>a+b.invoiceTotal,0);
  const totalPending  = BILLING_DATA.filter(b=>b.invoiceStatus==="Pending").reduce((a,b)=>a+b.invoiceTotal,0);
  const totalOverdue  = BILLING_DATA.filter(b=>b.invoiceStatus==="Overdue").reduce((a,b)=>a+b.invoiceTotal,0);

  const invStClr = {Paid:"#22c55e",Pending:C.hr,Overdue:"#ef4444"};

  const sel = selected ? BILLING_DATA.find(b=>b.id===selected) : null;

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"0 22px",height:50,background:"rgba(34,197,94,0.06)",borderBottom:"1px solid rgba(34,197,94,0.15)",
        display:"flex",alignItems:"center",gap:14,flexShrink:0 }}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,letterSpacing:"0.18em",color:C.finance,textTransform:"uppercase"}}>◆ FINANCE VAULT</span>
        <div style={{width:1,height:20,background:"rgba(34,197,94,0.2)"}}/>
        {[
          {l:"TOTAL INVOICED",  v:fmtK(totalInvoiced), c:C.finance},
          {l:"COLLECTED",       v:fmtK(totalPaid),      c:"#22c55e"},
          {l:"PENDING",         v:fmtK(totalPending),   c:C.hr},
          {l:"OVERDUE",         v:fmtK(totalOverdue),   c:"#ef4444"},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:C.text4}}>STATUS</span>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{
            background:"rgba(255,255,255,0.07)",border:`1px solid ${C.borderHi}`,borderRadius:7,
            color:C.text2,fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:"4px 10px",cursor:"pointer",outline:"none"
          }}>
            {["All","Paid","Pending","Overdue"].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Left: Table */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>
          {/* Summary Cards */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
            {[
              {label:"Total Invoiced",  value:fmtFull(totalInvoiced), accent:C.finance},
              {label:"Collected",       value:fmtFull(totalPaid),     accent:"#22c55e"},
              {label:"Pending",         value:fmtFull(totalPending),  accent:C.hr},
              {label:"Overdue",         value:fmtFull(totalOverdue),  accent:"#ef4444"},
            ].map(m=>(
              <Card key={m.label} accent={m.accent} style={{padding:"14px 18px"}}>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.text4,textTransform:"uppercase",marginBottom:5}}>{m.label}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:m.accent}}>{m.value}</div>
              </Card>
            ))}
          </div>

          {/* Collection Rate */}
          <Card style={{padding:"12px 18px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.text4,textTransform:"uppercase"}}>Collection Rate — Jul 2025</span>
              <span style={{fontSize:12,fontWeight:800,color:"#22c55e"}}>{Math.round((totalPaid/totalInvoiced)*100)}%</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
              <div style={{width:`${Math.round((totalPaid/totalInvoiced)*100)}%`,height:"100%",
                background:"linear-gradient(90deg,#22c55e,#86efac)",borderRadius:99}}/>
            </div>
          </Card>

          {/* Invoice Table */}
          <TableWrap>
            <thead>
              <tr>{["Client","Tier","Gross GMV","Shipping","Refunds","Net Base","Rate","Commission","Retainer","Invoice Total","Status"].map(h=><Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {displayed.map(b=>(
                <tr key={b.id} onClick={()=>setSelected(b.id===selected?null:b.id)}
                  style={{
                    cursor:"pointer",
                    background:b.id===selected?"rgba(34,197,94,0.07)":b.invoiceStatus==="Overdue"?"rgba(239,68,68,0.04)":"transparent",
                    transition:"background 0.15s"
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background=b.id===selected?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background=b.id===selected?"rgba(34,197,94,0.07)":b.invoiceStatus==="Overdue"?"rgba(239,68,68,0.04)":"transparent"}
                >
                  <Td><span style={{fontWeight:700,color:C.text1,fontSize:13}}>{b.name}</span></Td>
                  <Td><Tag label={b.tier==="Hyper Scale"?"HS":"STD"} color={b.tier==="Hyper Scale"?C.ceo:C.text3} small/></Td>
                  <Td><span style={{fontWeight:600,color:C.text2,fontSize:12}}>{fmtFull(b.gmv)}</span></Td>
                  <Td><span style={{fontSize:11,color:C.text3}}>-{fmtFull(b.shipping)}</span></Td>
                  <Td><span style={{fontSize:11,color:C.text3}}>-{fmtFull(b.refunds)}</span></Td>
                  <Td><span style={{fontSize:12,fontWeight:600,color:C.text2}}>{fmtFull(b.netBase)}</span></Td>
                  <Td><Tag label={`${b.commRate}%`} color={b.commRate===8?C.finance:C.crm} small/></Td>
                  <Td><span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>{fmtFull(b.commission)}</span></Td>
                  <Td><span style={{fontSize:12,color:C.text3}}>{fmtFull(b.retainer)}</span></Td>
                  <Td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,color:C.text1}}>{fmtFull(b.invoiceTotal)}</span></Td>
                  <Td><Tag label={b.invoiceStatus} color={invStClr[b.invoiceStatus]} small/></Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <p style={{fontSize:10,color:C.text5,marginTop:10}}>↑ Click any row to preview invoice breakdown</p>
        </div>

        {/* Right: Invoice Preview */}
        {sel && (
          <div style={{
            width:320,flexShrink:0,borderLeft:`1px solid ${C.border}`,
            background:"rgba(255,255,255,0.015)",overflowY:"auto",padding:"24px 20px",
            animation:"fadeUp 0.2s ease"
          }}>
            {/* Invoice Doc */}
            <div style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px"}}>
              {/* Invoice top */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:900,color:C.text1,letterSpacing:"-0.01em"}}>CREAITORS</div>
                  <div style={{fontSize:8,color:C.text4,letterSpacing:"0.14em"}}>ENTERPRISE OS</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:C.finance,letterSpacing:"0.08em"}}>INVOICE</div>
                  <div style={{fontSize:10,color:C.text4}}>#{String(sel.id).padStart(4,"0")}-2025-07</div>
                </div>
              </div>
              <div style={{height:1,background:C.border,marginBottom:14}}/>

              {/* Client */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,color:C.text4,letterSpacing:"0.12em",marginBottom:4}}>BILLED TO</div>
                <div style={{fontSize:14,fontWeight:800,color:C.text1}}>{sel.name}</div>
                <Tag label={sel.tier} color={sel.tier==="Hyper Scale"?C.ceo:C.text3} small/>
              </div>

              {/* Dates */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[{l:"Invoice Date",v:sel.invoiceDate},{l:"Due Date",v:sel.dueDate}].map(d=>(
                  <div key={d.l} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"8px 10px"}}>
                    <div style={{fontSize:8,color:C.text4,marginBottom:3}}>{d.l}</div>
                    <div style={{fontSize:11,fontWeight:600,color:C.text2}}>{d.v}</div>
                  </div>
                ))}
              </div>
              <div style={{height:1,background:C.border,marginBottom:12}}/>

              {/* Line items */}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                {[
                  {desc:"Monthly Retainer",          amt:sel.retainer,    clr:C.text2},
                  {desc:`Gross GMV`,                  amt:sel.gmv,         clr:C.text2, sub:true},
                  {desc:"Less: Shipping",             amt:-sel.shipping,   clr:"#ef4444", sub:true},
                  {desc:"Less: Refunds",              amt:-sel.refunds,    clr:"#ef4444", sub:true},
                  {desc:`Net Base (× ${sel.commRate}% commission)`, amt:sel.netBase, clr:C.text3, sub:true},
                  {desc:`Commission (${sel.commRate}%)`, amt:sel.commission, clr:"#22c55e"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    paddingLeft:item.sub?12:0}}>
                    <span style={{fontSize:11,color:item.sub?C.text4:C.text3}}>{item.desc}</span>
                    <span style={{fontSize:11,fontWeight:item.sub?400:600,color:item.clr}}>
                      {item.amt<0?`-${fmtFull(-item.amt)}`:fmtFull(item.amt)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{height:1,background:C.border,marginBottom:10}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:800,color:C.text1}}>TOTAL DUE</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:C.finance}}>{fmtFull(sel.invoiceTotal)}</span>
              </div>
              <div style={{marginTop:10,textAlign:"center"}}>
                <Tag label={sel.invoiceStatus} color={invStClr[sel.invoiceStatus]}/>
              </div>

              {/* Note */}
              <div style={{marginTop:14,padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:7,fontSize:9,color:C.text5,lineHeight:1.6}}>
                Zero commission on shipping & refunds. Client retains full digital usage rights in perpetuity. Payment via bank transfer to Creaitors Sdn Bhd.
              </div>
            </div>

            <button onClick={()=>setSelected(null)} style={{
              marginTop:12,width:"100%",padding:"9px",background:"transparent",
              border:`1px solid ${C.border}`,borderRadius:8,color:C.text4,cursor:"pointer",
              fontSize:11,fontFamily:"'JetBrains Mono',monospace"
            }}>✕ Close Preview</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 5 · CRM / PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

function CRMPipeline() {
  const [leads, setLeads] = useState(CRM_LEADS);
  const [view, setView]   = useState("pipeline"); // pipeline | table
  const [selected, setSelected] = useState(null);

  const STAGES = ["Cold Outreach","Qualified Lead","Discovery Call","Proposal Sent","Negotiation","Contract Review","Closed Won","Closed Lost"];
  const stageClr = {
    "Cold Outreach":C.text4,"Qualified Lead":C.crm,"Discovery Call":"#06b6d4",
    "Proposal Sent":C.ceo,"Negotiation":C.hr,"Contract Review":"#22c55e",
    "Closed Won":"#22c55e","Closed Lost":"#ef4444"
  };

  const totalPipeline = leads.filter(l=>!["Closed Won","Closed Lost"].includes(l.stage)).reduce((a,l)=>a+l.value,0);
  const wonValue      = leads.filter(l=>l.stage==="Closed Won").reduce((a,l)=>a+l.value,0);
  const avgProb       = Math.round(leads.reduce((a,l)=>a+l.probability,0)/leads.length);

  const tierClr = {Standard:C.crm,"Hyper Scale":C.ceo};

  const advanceLead = (id) => {
    setLeads(prev=>prev.map(l=>{
      if(l.id!==id) return l;
      const idx=STAGES.indexOf(l.stage);
      if(idx<STAGES.length-3) return {...l,stage:STAGES[idx+1]};
      return l;
    }));
  };

  const sel = selected ? leads.find(l=>l.id===selected) : null;

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflow:"hidden" }}>
      {/* Header */}
      <div style={{padding:"0 22px",height:50,background:"rgba(6,182,212,0.06)",borderBottom:"1px solid rgba(6,182,212,0.15)",
        display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,letterSpacing:"0.18em",color:C.crm,textTransform:"uppercase"}}>◫ CRM / PIPELINE</span>
        <div style={{width:1,height:20,background:"rgba(6,182,212,0.2)"}}/>
        {[
          {l:"TOTAL PIPELINE",  v:fmtK(totalPipeline), c:C.crm},
          {l:"OPEN LEADS",      v:leads.filter(l=>!["Closed Won","Closed Lost"].includes(l.stage)).length, c:C.hr},
          {l:"AVG PROBABILITY", v:`${avgProb}%`, c:"#22c55e"},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:4}}>
          {[{id:"pipeline",label:"Pipeline"},{id:"table",label:"Table"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{
              padding:"5px 12px",background:view===v.id?C.crm+"20":"transparent",
              border:`1px solid ${view===v.id?C.crm+"60":C.border}`,borderRadius:7,
              color:view===v.id?C.crm:C.text4,fontSize:10,fontWeight:view===v.id?700:500,
              cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Main content */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
          {/* KPI Row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[
              {label:"Active Pipeline", value:fmtFull(totalPipeline), accent:C.crm},
              {label:"Won This Month",  value:fmtFull(wonValue),       accent:"#22c55e"},
              {label:"Total Leads",     value:leads.length,             accent:C.hr},
              {label:"Avg Probability", value:`${avgProb}%`,            accent:"#22c55e"},
            ].map(m=>(
              <Card key={m.label} accent={m.accent} style={{padding:"14px 18px"}}>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.text4,textTransform:"uppercase",marginBottom:5}}>{m.label}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:m.accent}}>{m.value}</div>
              </Card>
            ))}
          </div>

          {view==="pipeline" ? (
            /* Pipeline Stage View */
            <div>
              {STAGES.filter(s=>!["Closed Won","Closed Lost"].includes(s)).map(stage=>{
                const stageLeads = leads.filter(l=>l.stage===stage);
                if(stageLeads.length===0) return null;
                const accent = stageClr[stage];
                return (
                  <div key={stage} style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:accent,display:"inline-block",flexShrink:0}}/>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                        color:C.text2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{stage}</span>
                      <span style={{fontSize:10,fontWeight:700,color:accent,background:accent+"18",
                        padding:"1px 7px",borderRadius:99}}>{stageLeads.length}</span>
                      <div style={{flex:1,height:1,background:C.border}}/>
                      <span style={{fontSize:10,color:C.text5}}>
                        {fmtFull(stageLeads.reduce((a,l)=>a+l.value,0))}
                      </span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                      {stageLeads.map(lead=>(
                        <div key={lead.id} onClick={()=>setSelected(lead.id===selected?null:lead.id)}
                          style={{
                            background:lead.id===selected?"rgba(6,182,212,0.08)":"rgba(255,255,255,0.025)",
                            border:`1px solid ${lead.id===selected?C.crm+"50":C.border}`,
                            borderRadius:10,padding:"13px 15px",cursor:"pointer",transition:"all 0.15s"
                          }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=accent+"50"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=lead.id===selected?C.crm+"50":C.border}
                        >
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                            <span style={{fontSize:13,fontWeight:800,color:C.text1}}>{lead.name}</span>
                            <Tag label={lead.tier==="Hyper Scale"?"HYPER":"STD"} color={tierClr[lead.tier]} small/>
                          </div>
                          <div style={{display:"flex",gap:6,marginBottom:8}}>
                            <Tag label={`RM ${lead.value.toLocaleString()}/mo`} color={C.finance} small/>
                            <Tag label={`${lead.probability}% prob`} color={lead.probability>=70?"#22c55e":lead.probability>=40?C.hr:"#ef4444"} small/>
                          </div>
                          <p style={{fontSize:10,color:C.text4,margin:"0 0 8px",lineHeight:1.5}}>{lead.notes}</p>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:9,color:C.text5}}>BDM: {lead.bdm} · Last: {lead.lastContact}</span>
                            {!["Contract Review","Negotiation"].includes(stage)&&(
                              <button onClick={e=>{e.stopPropagation();advanceLead(lead.id);}} style={{
                                fontSize:8,fontWeight:800,letterSpacing:"0.1em",color:accent,
                                background:accent+"15",border:`1px solid ${accent}30`,
                                borderRadius:5,padding:"2px 7px",cursor:"pointer"
                              }}>ADVANCE →</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <TableWrap>
              <thead>
                <tr>{["Company","BDM","Tier","Stage","Value/mo","Probability","Last Contact","Notes"].map(h=><Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {leads.map(l=>(
                  <tr key={l.id}
                    style={{cursor:"pointer",transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Td><span style={{fontWeight:700,color:C.text1,fontSize:13}}>{l.name}</span></Td>
                    <Td><span style={{fontSize:11,color:C.text3}}>{l.bdm}</span></Td>
                    <Td><Tag label={l.tier==="Hyper Scale"?"HYPER":"STD"} color={tierClr[l.tier]} small/></Td>
                    <Td>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:stageClr[l.stage],display:"inline-block",flexShrink:0}}/>
                        <span style={{fontSize:11,color:stageClr[l.stage],fontWeight:600}}>{l.stage}</span>
                      </div>
                    </Td>
                    <Td><span style={{fontSize:12,fontWeight:600,color:C.finance}}>RM {l.value.toLocaleString()}</span></Td>
                    <Td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:60,height:4,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
                          <div style={{width:`${l.probability}%`,height:"100%",background:l.probability>=70?"#22c55e":l.probability>=40?C.hr:"#ef4444",borderRadius:99}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:700,color:l.probability>=70?"#22c55e":l.probability>=40?C.hr:"#ef4444"}}>{l.probability}%</span>
                      </div>
                    </Td>
                    <Td><span style={{fontSize:11,color:C.text4}}>{l.lastContact}</span></Td>
                    <Td><span style={{fontSize:10,color:C.text4,maxWidth:180,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.notes}</span></Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>

        {/* Lead Detail Panel */}
        {sel && (
          <div style={{
            width:300,flexShrink:0,borderLeft:`1px solid ${C.border}`,
            background:"rgba(255,255,255,0.015)",overflowY:"auto",padding:"20px 18px",
            animation:"fadeUp 0.2s ease"
          }}>
            <div style={{marginBottom:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:900,color:C.text1,marginBottom:4}}>{sel.name}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Tag label={sel.tier} color={tierClr[sel.tier]} small/>
                <Tag label={sel.stage} color={stageClr[sel.stage]} small/>
              </div>
            </div>

            {[
              {l:"BDM Owner",    v:sel.bdm},
              {l:"Monthly Value",v:`RM ${sel.value.toLocaleString()}`},
              {l:"Probability",  v:`${sel.probability}%`},
              {l:"Last Contact", v:sel.lastContact},
            ].map(item=>(
              <div key={item.l} style={{marginBottom:12,padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8}}>
                <div style={{fontSize:9,color:C.text4,letterSpacing:"0.12em",marginBottom:3}}>{item.l}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.text1}}>{item.v}</div>
              </div>
            ))}

            <div style={{padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8,marginBottom:14}}>
              <div style={{fontSize:9,color:C.text4,letterSpacing:"0.12em",marginBottom:5}}>NOTES</div>
              <p style={{fontSize:12,color:C.text3,lineHeight:1.6,margin:0}}>{sel.notes}</p>
            </div>

            <div style={{padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8,marginBottom:14}}>
              <div style={{fontSize:9,color:C.text4,letterSpacing:"0.12em",marginBottom:8}}>PROBABILITY GAUGE</div>
              <div style={{height:8,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
                <div style={{width:`${sel.probability}%`,height:"100%",borderRadius:99,
                  background:sel.probability>=70?"linear-gradient(90deg,#22c55e,#86efac)":sel.probability>=40?"linear-gradient(90deg,#f59e0b,#fcd34d)":"linear-gradient(90deg,#ef4444,#fca5a5)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                <span style={{fontSize:9,color:C.text5}}>0%</span>
                <span style={{fontSize:11,fontWeight:800,color:sel.probability>=70?"#22c55e":sel.probability>=40?C.hr:"#ef4444"}}>{sel.probability}%</span>
                <span style={{fontSize:9,color:C.text5}}>100%</span>
              </div>
            </div>

            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>advanceLead(sel.id)} style={{
                flex:1,padding:"9px",background:`${C.crm}20`,border:`1px solid ${C.crm}50`,
                borderRadius:8,color:C.crm,cursor:"pointer",fontSize:11,fontWeight:700,
                fontFamily:"'JetBrains Mono',monospace"
              }}>ADVANCE →</button>
              <button onClick={()=>setSelected(null)} style={{
                padding:"9px 12px",background:"transparent",border:`1px solid ${C.border}`,
                borderRadius:8,color:C.text4,cursor:"pointer",fontSize:11,
                fontFamily:"'JetBrains Mono',monospace"
              }}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 6 · TEAM & HR
// ═══════════════════════════════════════════════════════════════════════════════

const TEAM_DATA = [
  {id:1,name:"Rayyan",role:"CEO",dept:"Leadership",status:"Active",  tasks:3, kpis:"MRR RM185K",  avatar:"R"},
  {id:2,name:"Afzan", role:"CMO",dept:"Leadership",status:"Active",  tasks:7, kpis:"Portfolio ROAS 4.2x",avatar:"A"},
  {id:3,name:"Sarah", role:"COO",dept:"Leadership",status:"Deep Work",tasks:9,kpis:"SLA 94%",      avatar:"S"},
  {id:4,name:"Haziq", role:"BDM",dept:"Sales",     status:"Active",  tasks:5, kpis:"Pipeline RM185K",avatar:"H"},
  {id:5,name:"Nadia", role:"PM", dept:"Production",status:"Active",  tasks:11,kpis:"8 assets pending",avatar:"N"},
  {id:6,name:"Aiman", role:"Editor",dept:"Production",status:"Active",tasks:14,kpis:"12 edits queue",avatar:"A"},
  {id:7,name:"Syira", role:"Host",dept:"Live Studio",status:"Active", tasks:2, kpis:"3 sessions today",avatar:"S"},
  {id:8,name:"Danial",role:"Host",dept:"Live Studio",status:"Leave",  tasks:0, kpis:"On leave Jul 28–30",avatar:"D"},
  {id:9,name:"Iman",  role:"ME", dept:"Sales",     status:"Active",  tasks:6, kpis:"3 leads outreach",avatar:"I"},
];
const statusClrHR = {Active:"#22c55e","Deep Work":"#6366f1",Leave:"#f59e0b"};
const deptClr     = {Leadership:C.ceo,Sales:C.crm,Production:C.content,"Live Studio":"#ec4899"};

function TeamHR() {
  const depts = Array.from(new Set(TEAM_DATA.map(t=>t.dept)));
  return (
    <div style={{padding:22,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,color:C.text1,margin:0}}>Team & HR</h2>
          <p style={{fontSize:11,color:C.text4,marginTop:3}}>{TEAM_DATA.length} staff · {TEAM_DATA.filter(t=>t.status==="Active").length} active now</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"ACTIVE",v:TEAM_DATA.filter(t=>t.status==="Active").length,c:"#22c55e"},
            {l:"DEEP WORK",v:TEAM_DATA.filter(t=>t.status==="Deep Work").length,c:C.ceo},
            {l:"LEAVE",v:TEAM_DATA.filter(t=>t.status==="Leave").length,c:C.hr}
          ].map(s=>(
            <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>
      {depts.map(dept=>(
        <div key={dept} style={{marginBottom:20}}>
          <SectionDivider label={dept}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10,marginTop:10}}>
            {TEAM_DATA.filter(t=>t.dept===dept).map(m=>(
              <div key={m.id} style={{
                background:"rgba(255,255,255,0.025)",border:`1px solid ${C.border}`,
                borderRadius:10,padding:"14px 16px",transition:"border-color 0.15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=deptClr[dept]+"55"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
              >
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",
                    background:`linear-gradient(135deg,${deptClr[dept]},${deptClr[dept]}88)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:14,fontWeight:900,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:800,color:C.text1}}>{m.name}</div>
                    <div style={{display:"flex",gap:5,marginTop:2}}>
                      <Tag label={m.role} color={deptClr[dept]} small/>
                      <Tag label={m.status} color={statusClrHR[m.status]} small/>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",
                  background:"rgba(255,255,255,0.04)",borderRadius:7}}>
                  <div>
                    <div style={{fontSize:8,color:C.text4,marginBottom:2}}>ACTIVE TASKS</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,color:C.text1}}>{m.tasks}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:8,color:C.text4,marginBottom:2}}>KPI</div>
                    <div style={{fontSize:10,color:C.text3}}>{m.kpis}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODULE 7 · LIVE STUDIO
// ═══════════════════════════════════════════════════════════════════════════════

const LIVE_SESSIONS = [
  {id:1,client:"CuddleMe",  host:"Syira",  status:"LIVE",    gmv:18400, hours:3.2, target:25000,viewers:342,platform:"TikTok"},
  {id:2,client:"HMNS",      host:"Danial", status:"Upcoming",gmv:0,     hours:0,   target:30000,viewers:0,  platform:"TikTok",  startTime:"8:00 PM"},
  {id:3,client:"NaturaCo",  host:"Syira",  status:"Done",    gmv:12800, hours:4.0, target:15000,viewers:0,  platform:"Shopee",  startTime:"Completed"},
  {id:4,client:"FreshBrews",host:"Extern", status:"Done",    gmv:8200,  hours:2.5, target:10000,viewers:0,  platform:"TikTok",  startTime:"Completed"},
];

function LiveStudio() {
  const totalGMV    = LIVE_SESSIONS.filter(s=>s.status==="Done"||s.status==="LIVE").reduce((a,s)=>a+s.gmv,0);
  const liveNow     = LIVE_SESSIONS.filter(s=>s.status==="LIVE");
  return (
    <div style={{padding:22,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
            <PulseDot color="#ef4444" size={8}/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,color:C.text1,margin:0}}>Live Studio</h2>
          </div>
          <p style={{fontSize:11,color:C.text4}}>{liveNow.length} session live now · {LIVE_SESSIONS.length} total today</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"LIVE GMV TODAY",v:fmtK(totalGMV),c:"#22c55e"},{l:"SESSIONS LIVE",v:liveNow.length,c:"#ef4444"}]
            .map(s=>(
              <div key={s.l} style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.14em",color:C.text5}}>{s.l}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:s.c,background:s.c+"18",padding:"1px 7px",borderRadius:5}}>{s.v}</span>
              </div>
            ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {LIVE_SESSIONS.map(s=>{
          const isLive = s.status==="LIVE";
          const pct = s.target>0?Math.min(Math.round((s.gmv/s.target)*100),100):0;
          return (
            <div key={s.id} style={{
              background: isLive?"rgba(239,68,68,0.07)":"rgba(255,255,255,0.025)",
              border:`1px solid ${isLive?"rgba(239,68,68,0.25)":C.border}`,
              borderRadius:12,padding:"16px 18px"
            }}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:C.text1}}>{s.client}</div>
                  <div style={{fontSize:10,color:C.text4}}>Host: {s.host} · {s.platform}</div>
                </div>
                <div>
                  {isLive ? (
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <PulseDot color="#ef4444" size={7}/>
                      <Tag label="LIVE" color="#ef4444" small/>
                    </div>
                  ) : <Tag label={s.status} color={s.status==="Done"?"#22c55e":C.hr} small/>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {[
                  {l:"GMV",       v:fmtFull(s.gmv),      c:isLive?"#22c55e":C.text2},
                  {l:"TARGET",    v:fmtFull(s.target),    c:C.text3},
                  {l:"HOURS",     v:s.hours>0?`${s.hours}h`:"—",c:C.text3},
                  {l:"VIEWERS",   v:s.viewers>0?s.viewers:"—",c:isLive?"#ec4899":C.text4},
                ].map(item=>(
                  <div key={item.l} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"7px 9px"}}>
                    <div style={{fontSize:8,color:C.text4,marginBottom:2}}>{item.l}</div>
                    <div style={{fontSize:13,fontWeight:700,color:item.c,fontFamily:"'Barlow Condensed',sans-serif"}}>{item.v}</div>
                  </div>
                ))}
              </div>
              {s.target>0&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:9,color:C.text4}}>GMV vs Target</span>
                    <span style={{fontSize:10,fontWeight:700,color:pct>=100?"#22c55e":pct>=60?C.hr:"#ef4444"}}>{pct}%</span>
                  </div>
                  <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
                    <div style={{width:`${pct}%`,height:"100%",borderRadius:99,
                      background:pct>=100?"#22c55e":pct>=60?C.hr:"#ef4444",transition:"width 0.8s"}}/>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIDEBAR & TOPBAR
// ═══════════════════════════════════════════════════════════════════════════════

const NAV = [
  {id:"ceo",     label:"CEO Command",   icon:"◈", section:null},
  {type:"div",   label:"OPERATIONS"},
  {id:"warroom", label:"War Room",      icon:"⚔"},
  {id:"content", label:"Content Factory",icon:"◧"},
  {id:"live",    label:"Live Studio",   icon:"◉"},
  {type:"div",   label:"GROWTH"},
  {id:"crm",     label:"CRM / Pipeline",icon:"◫"},
  {type:"div",   label:"BACK OFFICE"},
  {id:"finance", label:"Finance Vault", icon:"◆"},
  {id:"hr",      label:"Team & HR",     icon:"◎"},
];

const moduleAccent = { ceo:C.ceo, warroom:C.war, content:C.content, crm:C.crm, finance:C.finance, live:"#ec4899", hr:C.hr };

function Sidebar({ active, onNav, currentUser, onSwitchUser, collapsed }) {
  const [userMenu, setUserMenu] = useState(false);
  const accentClr = moduleAccent[active] || C.ceo;

  return (
    <div style={{
      width: collapsed?56:218, background:"#070a0d",
      borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column",
      transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)", overflow:"hidden", flexShrink:0
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed?"16px 0":"16px 18px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", gap:10, justifyContent:collapsed?"center":"flex-start"
      }}>
        <div style={{
          width:28,height:28,borderRadius:8,flexShrink:0,
          background:`linear-gradient(135deg,${C.ceo},#8b5cf6)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:900,color:"#fff",fontFamily:"'Syne',sans-serif"
        }}>C</div>
        {!collapsed&&(
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:900,color:C.text1,letterSpacing:"-0.01em",lineHeight:1}}>CREAITORS</div>
            <div style={{fontSize:8,color:C.text5,letterSpacing:"0.16em",fontWeight:600}}>ENTERPRISE OS</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"10px 6px",overflowY:"auto",overflowX:"hidden"}}>
        {NAV.map((item,i)=>{
          if(item.type==="div") return collapsed
            ? <div key={i} style={{margin:"6px 0",height:1,background:C.border}}/>
            : <div key={i} style={{padding:"12px 10px 5px",fontSize:8,fontWeight:800,letterSpacing:"0.18em",color:C.text5,textTransform:"uppercase"}}>{item.label}</div>;
          const isActive = active===item.id;
          const ac = moduleAccent[item.id]||C.ceo;
          return (
            <button key={item.id} onClick={()=>onNav(item.id)} style={{
              width:"100%",display:"flex",alignItems:"center",gap:9,
              padding: collapsed?"9px 0":"8px 10px",
              justifyContent: collapsed?"center":"flex-start",
              background: isActive?`${ac}18`:"transparent",
              border: isActive?`1px solid ${ac}30`:"1px solid transparent",
              borderRadius:7,cursor:"pointer",
              color: isActive?ac:C.text4,
              fontSize:12,fontWeight:isActive?700:500,
              transition:"all 0.15s",marginBottom:1,whiteSpace:"nowrap"
            }}
              onMouseEnter={e=>{if(!isActive){e.currentTarget.style.color=C.text2;e.currentTarget.style.background="rgba(255,255,255,0.04)";}}}
              onMouseLeave={e=>{if(!isActive){e.currentTarget.style.color=C.text4;e.currentTarget.style.background="transparent";}}}
            >
              <span style={{fontSize:15,flexShrink:0,opacity:isActive?1:0.7}}>{item.icon}</span>
              {!collapsed&&<span>{item.label}</span>}
              {!collapsed&&isActive&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:ac}}/>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{padding:collapsed?"10px 0":"10px",borderTop:`1px solid ${C.border}`,position:"relative"}}>
        <button onClick={()=>setUserMenu(!userMenu)} style={{
          width:"100%",display:"flex",alignItems:"center",gap:8,
          padding:collapsed?"8px 0":"7px 9px",justifyContent:collapsed?"center":"flex-start",
          background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",color:C.text2
        }}>
          <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,
            background:`linear-gradient(135deg,${currentUser.accent},#ec4899)`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>{currentUser.avatar}</div>
          {!collapsed&&(
            <div style={{flex:1,textAlign:"left",overflow:"hidden"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.text1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.name}</div>
              <div style={{fontSize:9,color:currentUser.accent,fontWeight:600}}>{currentUser.role}</div>
            </div>
          )}
          {!collapsed&&<span style={{fontSize:9,color:C.text5}}>⌄</span>}
        </button>
        {userMenu&&!collapsed&&(
          <div style={{position:"absolute",bottom:"100%",left:10,right:10,
            background:"#0f1318",border:`1px solid ${C.borderHi}`,borderRadius:9,padding:7,
            marginBottom:5,boxShadow:"0 -8px 30px rgba(0,0,0,0.6)"}}>
            <div style={{fontSize:8,fontWeight:800,letterSpacing:"0.16em",color:C.text5,padding:"3px 7px 6px",textTransform:"uppercase"}}>Switch Role</div>
            {USERS.map(u=>(
              <button key={u.id} onClick={()=>{onSwitchUser(u);setUserMenu(false);}} style={{
                width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 9px",
                background:u.id===currentUser.id?`${u.accent}18`:"transparent",border:"none",borderRadius:6,cursor:"pointer",color:C.text2
              }}>
                <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${u.accent},#ec4899)`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff",flexShrink:0}}>{u.avatar}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:11,fontWeight:600}}>{u.name}</div>
                  <div style={{fontSize:9,color:u.accent}}>{u.role}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Topbar({ currentUser, active, onToggle }) {
  const labels = {ceo:"CEO Command",warroom:"War Room",content:"Content Factory",crm:"CRM / Pipeline",finance:"Finance Vault",hr:"Team & HR",live:"Live Studio"};
  const ac = moduleAccent[active]||C.ceo;
  return (
    <div style={{height:50,background:"#070a0d",borderBottom:`1px solid ${C.border}`,
      display:"flex",alignItems:"center",padding:"0 18px",gap:14,flexShrink:0}}>
      <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",color:C.text4,fontSize:17,display:"flex",alignItems:"center",padding:3}}>☰</button>
      <div style={{width:1,height:18,background:C.border}}/>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:ac,display:"inline-block"}}/>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:C.text2,letterSpacing:"0.06em",textTransform:"uppercase"}}>{labels[active]||"Dashboard"}</span>
      </div>
      <div style={{flex:1}}/>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",
          background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:99}}>
          <PulseDot color="#22c55e" size={6}/>
          <span style={{fontSize:9,fontWeight:700,color:"#22c55e",letterSpacing:"0.1em"}}>3 LIVES ACTIVE</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",
          background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:99}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.hr,display:"inline-block"}}/>
          <span style={{fontSize:9,fontWeight:700,color:C.hr,letterSpacing:"0.1em"}}>2 URGENT</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,padding:"4px 10px",
          background:"rgba(255,255,255,0.05)",border:`1px solid ${C.borderHi}`,borderRadius:99}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:`linear-gradient(135deg,${currentUser.accent},#ec4899)`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff"}}>{currentUser.avatar}</div>
          <span style={{fontSize:10,fontWeight:600,color:C.text2}}>{currentUser.name} · {currentUser.role}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [active, setActive]       = useState("ceo");
  const [user, setUser]           = useState(USERS[0]);
  const [collapsed, setCollapsed] = useState(false);

  const panels = {
    ceo:     <CEODashboard/>,
    warroom: <WarRoom/>,
    content: <ContentFactory/>,
    finance: <FinanceVault/>,
    crm:     <CRMPipeline/>,
    hr:      <TeamHR/>,
    live:    <LiveStudio/>,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg,overflow:"hidden"}}>
        <Topbar currentUser={user} active={active} onToggle={()=>setCollapsed(c=>!c)}/>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          <Sidebar active={active} onNav={setActive} currentUser={user} onSwitchUser={setUser} collapsed={collapsed}/>
          <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>
            {panels[active] || (
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:C.text5}}>
                <div style={{fontSize:40,opacity:0.2}}>◈</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700}}>Module Coming Soon</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
