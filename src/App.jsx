import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, AreaChart, Area, Legend } from "recharts";

const EARN_SOURCES = {
  email:     { label: "绑定邮箱",    icon: "✉" },
  refer:     { label: "邀请好友",    icon: "👥" },
  task:      { label: "任务系统",    icon: "✅" },
  buy:       { label: "购买套餐",    icon: "💳" },
  admin_add: { label: "后台添加积分", icon: "🔧" },
};
const SPEND_SOURCES = {
  vip:          { label: "兑换 VIP",    icon: "👑" },
  svip:         { label: "兑换 SVIP",   icon: "⭐" },
  img:          { label: "图片生成",    icon: "🖼" },
  admin_deduct: { label: "后台扣减积分", icon: "🔧" },
};
const ALL_SOURCES = { ...EARN_SOURCES, ...SPEND_SOURCES };

const VIP_PLANS = [
  { days:3,   label:"3天",   pts:50,   color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:7,   label:"7天",   pts:100,  color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:30,  label:"30天",  pts:350,  color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:90,  label:"90天",  pts:900,  color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:180, label:"180天", pts:1600, color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:365, label:"1年",   pts:2800, color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
  { days:730, label:"2年",   pts:5000, color:"#F97316", bg:"#FEF0E6", text:"#7C2D00" },
];
const SVIP_PLANS = [
  { days:3,   label:"3天",   pts:100,  color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:7,   label:"7天",   pts:200,  color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:30,  label:"30天",  pts:600,  color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:90,  label:"90天",  pts:1600, color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:180, label:"180天", pts:2800, color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:365, label:"1年",   pts:5000, color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
  { days:730, label:"2年",   pts:9000, color:"#8B5CF6", bg:"#F3EFFD", text:"#3B0764" },
];

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
const NAMES = ["wx_user88","refer_king","task001","alg123456","ik254","qq258","wsxnko","986571","2378rygfae","gfa_vip","moon99","sky_top","netfan","promax1","daily01","aloha22","bright5","coolx7","doge_m","elitevpn"];
const TASK_LABELS = [
  { label:"完成关注 X 平台账号任务",      pts: 80  },
  { label:"完成留言 @吴老师 帖子任务",    pts: 120 },
  { label:"完成关注小红书平台账号任务",    pts: 80  },
  { label:"完成留言 @李老师 帖子任务",    pts: 120 },
  { label:"完成关注 INS 平台账号任务",    pts: 80  },
  { label:"完成每日签到任务",            pts: 20  },
  { label:"完成分享至朋友圈任务",         pts: 50  },
];
const REFER_TYPES = [
  { label:"邀请奖励 - 使用邀请码", pts: 200 },
  { label:"被邀请人消费返利",       pts: 100 },
  { label:"邀请奖励 - 邀请好友",   pts: 500 },
];

function pickWeighted(plans, weights) {
  const total = weights.reduce((a,b) => a+b, 0);
  let r = rnd(0, total-1);
  for (let i=0; i<weights.length; i++) { r -= weights[i]; if (r < 0) return plans[i]; }
  return plans[0];
}

const EARN_PTS = { email: 200, refer: 500, buy: 300 };
const TRANSACTIONS = Array.from({ length:200 }, (_, i) => {
  const isEarn = Math.random() > 0.35;
  let src, pts, plan = null, taskLabel = null, referType = null;
  if (isEarn) {
    src = pickWeighted(["email","refer","task","buy","admin_add"], [10,20,25,20,5]);
    if (src === "task") {
      const t = TASK_LABELS[rnd(0, TASK_LABELS.length - 1)];
      taskLabel = t.label;
      pts = t.pts;
    } else if (src === "refer") {
      const rt = REFER_TYPES[rnd(0, REFER_TYPES.length - 1)];
      referType = rt.label;
      pts = rt.pts;
    } else if (src === "admin_add") {
      pts = rnd(1, 20) * 100;
    } else {
      pts = EARN_PTS[src];
    }
  } else {
    src = pickWeighted(["vip","svip","img","admin_deduct"], [35,30,20,5]);
    if (src==="vip")            { plan = pickWeighted(VIP_PLANS,  [35,25,20,10,5,3,2]); pts = plan.pts; }
    else if (src==="svip")      { plan = pickWeighted(SVIP_PLANS, [30,22,20,12,8,5,3]); pts = plan.pts; }
    else if (src==="img")       { pts = [5, 10, 20][rnd(0,2)]; }
    else                        { pts = rnd(1, 30) * 50; }
  }
  const base = new Date("2026-05-11T10:45:00");
  const ts   = new Date(base.getTime() - i * rnd(8,16) * 3600000);
  return { id:i+1, user:NAMES[rnd(0,NAMES.length-1)], src, pts, plan, taskLabel, referType, type:isEarn?"earn":"spend", ts, balance:rnd(1200,9800) };
});

const EARN_PIE = [
  { name:"绑定邮箱", value:15, color:"#1D9E75" },
  { name:"邀请好友", value:35, color:"#5DCAA5" },
  { name:"任务系统", value:27, color:"#9FE1CB" },
  { name:"购买套餐", value:23, color:"#0F6E56" },
];
const TASK_COLORS = ["#FAC775","#EF9F27","#5DCAA5","#1D9E75","#9FE1CB","#854F0B","#0F6E56","#BA7517"];

const SPEND_DURATIONS = [
  { days:3, label:"3天" }, { days:7, label:"7天" }, { days:30, label:"30天" },
  { days:90, label:"90天" }, { days:180, label:"180天" }, { days:365, label:"1年" }, { days:730, label:"2年" },
];
function buildSpendBar() {
  const tally = {};
  SPEND_DURATIONS.forEach(d => { tally[d.days] = { vip:0, svip:0 }; });
  let imgPts = 0;
  TRANSACTIONS.forEach(r => {
    if (r.type!=="spend") return;
    if ((r.src==="vip"||r.src==="svip") && r.plan && tally[r.plan.days]) tally[r.plan.days][r.src] += r.pts;
    else if (r.src==="img") imgPts += r.pts;
  });
  const entries = [
    ...SPEND_DURATIONS.map(d => ({ name: d.label, vip: tally[d.days].vip, svip: tally[d.days].svip })),
    { name: "图片生成", img: imgPts },
  ];
  const total = entries.reduce((s, e) => s + (e.vip||0) + (e.svip||0) + (e.img||0), 0);
  return entries.map(e => ({
    ...e,
    vipPct:  total > 0 && e.vip  ? Math.round(e.vip  / total * 100) : undefined,
    svipPct: total > 0 && e.svip ? Math.round(e.svip / total * 100) : undefined,
    imgPct:  total > 0 && e.img  ? Math.round(e.img  / total * 100) : undefined,
  }));
}
const SPEND_BAR = buildSpendBar();

function buildTimeSeries(granularity, txns = TRANSACTIONS) {
  const buckets = {};
  txns.forEach(r => {
    const d = r.ts;
    let key;
    if (granularity === "hour") { const h2 = Math.floor(d.getHours()/2)*2; const h2e = h2+2; key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(h2).padStart(2,"0")}:00~${String(h2e).padStart(2,"0")}:00`; }
    else if (granularity === "day")   key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    else if (granularity === "month") key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    else key = `${d.getFullYear()}`;
    if (!buckets[key]) buckets[key] = { date: key, earn: 0, spend: 0 };
    if (r.type === "earn") buckets[key].earn += r.pts;
    else buckets[key].spend += r.pts;
  });
  return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
}

function buildSpendBarFrom(txns) {
  const tally = {};
  SPEND_DURATIONS.forEach(d => { tally[d.days] = { vip:0, svip:0 }; });
  let imgPts = 0;
  txns.forEach(r => {
    if (r.type!=="spend") return;
    if ((r.src==="vip"||r.src==="svip") && r.plan && tally[r.plan.days]) tally[r.plan.days][r.src] += r.pts;
    else if (r.src==="img") imgPts += r.pts;
  });
  const entries = [
    ...SPEND_DURATIONS.map(d => ({ name: d.label, vip: tally[d.days].vip, svip: tally[d.days].svip })),
    { name: "图片生成", img: imgPts },
  ];
  const total = entries.reduce((s, e) => s + (e.vip||0) + (e.svip||0) + (e.img||0), 0);
  return entries.map(e => ({
    ...e,
    vipPct:  total > 0 && e.vip  ? Math.round(e.vip  / total * 100) : undefined,
    svipPct: total > 0 && e.svip ? Math.round(e.svip / total * 100) : undefined,
    imgPct:  total > 0 && e.img  ? Math.round(e.img  / total * 100) : undefined,
  }));
}

function DonutChart({ data, center }) {
  const [active, setActive] = useState(null);
  return (
    <div style={{ position:"relative" }}>
      <ResponsiveContainer width="100%" height={155}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={46} outerRadius={64}
            dataKey="value" paddingAngle={3}
            onMouseEnter={(_,i)=>setActive(i)} onMouseLeave={()=>setActive(null)}>
            {data.map((d,i) => <Cell key={i} fill={d.color} opacity={active===null||active===i?1:0.35} stroke="none"/>)}
          </Pie>
          <Tooltip formatter={v=>`${v}%`} contentStyle={{ fontSize:13,borderRadius:8,border:"0.5px solid #e0e0e0" }}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none" }}>
        <div style={{ fontSize:11,color:"#bbb" }}>{center}</div>
      </div>
    </div>
  );
}


const PER = 10;
function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} `
       + `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}
const btn  = { height:34,padding:"0 14px",fontSize:13,borderRadius:8,border:"0.5px solid #ddd",background:"#fff",color:"#333",cursor:"pointer" };
const sel  = { height:34,padding:"0 10px",fontSize:13,borderRadius:8,border:"0.5px solid #ddd",background:"#fff",color:"#333",cursor:"pointer" };

export default function CreditHistory() {
  const [tab,        setTab]        = useState("all");
  const [srcFilter,  setSrcFilter]  = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [openMenu,        setOpenMenu]        = useState(null);
  const [timeGranularity, setTimeGranularity] = useState("day");
  const [trendView,       setTrendView]       = useState("chart");
  const [currentPage,     setCurrentPage]     = useState("records");
  const [startDate, setStartDate] = useState("2026-02-10");
  const [endDate,   setEndDate]   = useState("2026-05-11");
  const [aStartDate, setAStartDate] = useState("2026-02-10T00:00");
  const [aEndDate,   setAEndDate]   = useState("2026-05-11T23:59");

  const MENU_ITEMS = ["用户详情","标签详情","修改用户套餐","修改邮箱","用户密码重置","注销申请","修改积分额度","推荐用户列表","打开工单","封禁用户","提升用户为代理","修改设备注册限制"];

  const dateTxns = useMemo(() => {
    const from = new Date(startDate + "T00:00:00");
    const to   = new Date(endDate   + "T23:59:59");
    return TRANSACTIONS.filter(r => r.ts >= from && r.ts <= to);
  }, [startDate, endDate]);

  const analyticsTxns = useMemo(() => {
    const from = new Date(aStartDate);
    const to   = new Date(aEndDate);
    return TRANSACTIONS.filter(r => r.ts >= from && r.ts <= to);
  }, [aStartDate, aEndDate]);

  const planOptions = useMemo(() => {
    if (srcFilter==="vip")   return VIP_PLANS.map(p=>({ v:String(p.days), l:`${p.days}天` }));
    if (srcFilter==="svip")  return SVIP_PLANS.map(p=>({ v:String(p.days), l:`${p.days}天` }));
    if (srcFilter==="task")  return TASK_LABELS.map(t=>({ v:t.label, l:t.label }));
    if (srcFilter==="refer") return REFER_TYPES.map(t=>({ v:t.label, l:t.label }));
    return [];
  }, [srcFilter]);

  const filtered = useMemo(() => dateTxns.filter(r => {
    if (tab==="earn"  && r.type!=="earn")  return false;
    if (tab==="spend" && r.type!=="spend") return false;
    if (srcFilter!=="all" && r.src!==srcFilter) return false;
    if (planFilter!=="all") {
      if (srcFilter==="task"  && r.taskLabel!==planFilter) return false;
      if (srcFilter==="refer" && r.referType!==planFilter) return false;
      if (srcFilter!=="task" && srcFilter!=="refer" && (!r.plan || String(r.plan.days)!==planFilter)) return false;
    }
    if (search && !r.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [dateTxns, tab, srcFilter, planFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/PER));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage-1)*PER, safePage*PER);
  const pgRange    = Array.from({length:totalPages},(_,i)=>i+1).filter(p=>Math.abs(p-safePage)<=2);

  const earnedPts = useMemo(() => filtered.filter(r=>r.type==="earn").reduce((s,r)=>s+r.pts,0), [filtered]);
  const spentPts  = useMemo(() => filtered.filter(r=>r.type==="spend").reduce((s,r)=>s+r.pts,0), [filtered]);
  const isFiltered = srcFilter!=="all" || planFilter!=="all" || tab!=="all" || search!=="";

  const earnPieData = useMemo(() => {
    if (srcFilter !== "task") {
      const srcKeys = ["email","refer","task","buy"];
      const srcColors = ["#1D9E75","#5DCAA5","#9FE1CB","#0F6E56"];
      const ptsBySource = {};
      dateTxns.filter(r=>r.type==="earn" && r.src!=="admin_add").forEach(r => {
        ptsBySource[r.src] = (ptsBySource[r.src] || 0) + r.pts;
      });
      const totalPts = Object.values(ptsBySource).reduce((s,v)=>s+v, 0);
      if (totalPts === 0) return EARN_PIE.map(d=>({...d, pts:0}));
      const raw = srcKeys.map((k,i) => ({
        name: EARN_SOURCES[k]?.label || k,
        pts: ptsBySource[k] || 0,
        raw: ((ptsBySource[k] || 0) / totalPts) * 100,
        color: srcColors[i],
      })).filter(e => e.pts > 0);
      const floors = raw.map(e => Math.floor(e.raw));
      const diff = 100 - floors.reduce((a,b)=>a+b,0);
      raw.map((e,i)=>({i, frac: e.raw - Math.floor(e.raw)}))
         .sort((a,b)=>b.frac-a.frac).slice(0,diff)
         .forEach(({i})=>floors[i]++);
      return raw.map((e,i)=>({...e, value: floors[i]}));
    }
    const taskTxns = dateTxns.filter(r => r.src === "task" && r.taskLabel);
    const totalPts = taskTxns.reduce((s,r)=>s+r.pts, 0);
    if (totalPts === 0) return EARN_PIE.map(d=>({...d, pts:0}));
    const ptsByLabel = {};
    taskTxns.forEach(r => { ptsByLabel[r.taskLabel] = (ptsByLabel[r.taskLabel] || 0) + r.pts; });
    const sorted = Object.entries(ptsByLabel).sort((a, b) => b[1] - a[1]);
    const raw = sorted.map(([name, pts]) => ({ name, pts, raw: pts / totalPts * 100 }));
    const floors = raw.map(e => Math.floor(e.raw));
    const diff = 100 - floors.reduce((a, b) => a + b, 0);
    raw.map((e, i) => ({ i, frac: e.raw - Math.floor(e.raw) }))
       .sort((a, b) => b.frac - a.frac).slice(0, diff)
       .forEach(({ i }) => floors[i]++);
    return raw.map((e, i) => ({ ...e, value: floors[i], color: TASK_COLORS[i % TASK_COLORS.length] }));
  }, [srcFilter, dateTxns]);

  const timeSeriesData = useMemo(() => buildTimeSeries(timeGranularity, dateTxns), [timeGranularity, dateTxns]);
  const spendBarData   = useMemo(() => buildSpendBarFrom(dateTxns), [dateTxns]);

  function changeTab(t)  { setTab(t);        setPage(1); }
  function changeSrc(s)  { setSrcFilter(s);  setPlanFilter("all"); setPage(1); }
  function changePlan(p) { setPlanFilter(p); setPage(1); }
  function doSearch(s)   { setSearch(s);     setPage(1); }
  function goPage(p)     { setPage(Math.max(1,Math.min(p,totalPages))); }

  return (
    <div onClick={()=>setOpenMenu(null)} style={{ fontFamily:"system-ui,-apple-system,sans-serif",fontSize:14,color:"#1a1a1a",background:"#f5f5f0",minHeight:"100vh",paddingBottom:"2rem" }}>

      {/* Header */}
      <div style={{ textAlign:"center",padding:"28px 24px 16px" }}>
        <h1 style={{ fontSize:28,fontWeight:600,margin:0,color:"#111" }}>积分记录</h1>
        <p style={{ fontSize:13,color:"#888",marginTop:6 }}>追踪积分的发行与消耗，分析来源与使用分布</p>
        <div style={{ display:"inline-flex",gap:2,background:"#ece9e4",padding:3,borderRadius:10,marginTop:16 }}>
          {[["records","积分记录"],["analytics","积分分析"]].map(([v,l])=>(
            <button key={v} onClick={()=>setCurrentPage(v)}
              style={{ height:32,padding:"0 20px",fontSize:13,border:currentPage===v?"0.5px solid #e0e0e0":"none",
                borderRadius:8,cursor:"pointer",background:currentPage===v?"#fff":"transparent",
                color:currentPage===v?"#111":"#888",fontWeight:currentPage===v?500:400 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1440,margin:"0 auto",padding:"0 32px" }}>

        {currentPage==="records" && <>

        {/* Toolbar */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,background:"#fff",border:"0.5px solid #ddd",borderRadius:8,padding:"0 12px",height:34 }}>
            <span style={{ fontSize:13,color:"#aaa" }}>📅</span>
            <input type="date" value={startDate} max={endDate}
              onChange={e=>{ setStartDate(e.target.value); setPage(1); }}
              style={{ border:"none",outline:"none",fontSize:13,color:"#333",background:"transparent",cursor:"pointer",fontFamily:"'Inter','Noto Sans SC',system-ui,sans-serif" }}/>
            <span style={{ fontSize:12,color:"#ccc" }}>—</span>
            <input type="date" value={endDate} min={startDate}
              onChange={e=>{ setEndDate(e.target.value); setPage(1); }}
              style={{ border:"none",outline:"none",fontSize:13,color:"#333",background:"transparent",cursor:"pointer",fontFamily:"'Inter','Noto Sans SC',system-ui,sans-serif" }}/>
          </div>
          <div style={{ flex:1 }}/>
        </div>


        {/* Charts */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 2fr",gap:12,marginBottom:16 }}>

          {/* Earn donut / task breakdown */}
          <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,padding:"16px 20px",height:350,display:"flex",flexDirection:"column" }}>
            <div style={{ fontWeight:500,fontSize:14,marginBottom:2 }}>积分发行来源</div>
            <div style={{ fontSize:12,color:"#999",marginBottom:14 }}>
              {srcFilter==="task" ? "任务系统各类型占比" : "各渠道累计发放量"}
            </div>
            {srcFilter==="task" ? (
              <div className="hide-scrollbar" style={{ display:"flex",flexDirection:"column",gap:10,overflowY:"auto",flex:1 }}>
                {earnPieData.map((d,i)=>(
                  <div key={i}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",fontSize:12,color:"#555",marginBottom:4 }}>
                      <span>{d.name}</span>
                      <span style={{ display:"flex",gap:8,alignItems:"baseline" }}>
                        <span style={{ fontSize:11,color:"#aaa" }}>{d.pts!=null ? d.pts.toLocaleString()+" pts" : ""}</span>
                        <span style={{ fontWeight:500,color:"#333",minWidth:32,textAlign:"right" }}>{d.value}%</span>
                      </span>
                    </div>
                    <div style={{ height:6,borderRadius:3,background:"#f0f0ec" }}>
                      <div style={{ height:"100%",borderRadius:3,background:d.color,width:`${d.value}%`,transition:"width 0.3s" }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
                  {earnPieData.map((d,i)=>(
                    <span key={i} style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#666" }}>
                      <span style={{ width:10,height:10,borderRadius:2,background:d.color,flexShrink:0 }}/>
                      <span style={{ flex:1 }}>{d.name}</span>
                      {d.name==="任务系统" && <span onClick={()=>changeSrc("task")} style={{ fontSize:11,color:"#bbb",cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted" }}>点击筛选查看明细</span>}
                      <span style={{ color:"#aaa",fontSize:11 }}>{d.pts!=null ? d.pts.toLocaleString()+" pts" : ""}</span>
                      <span style={{ fontWeight:500,color:"#333",minWidth:32,textAlign:"right" }}>{d.value}%</span>
                    </span>
                  ))}
                </div>
                <DonutChart data={earnPieData} center="发行" />
              </>
            )}
          </div>

          {/* Spend bar */}
          <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,padding:"16px 20px",height:350,display:"flex",flexDirection:"column" }}>
            <div style={{ fontWeight:500,fontSize:14,marginBottom:2 }}>积分消耗细分</div>
            <div style={{ fontSize:12,color:"#999",marginBottom:12 }}>各套餐积分消耗占比</div>
            <ResponsiveContainer width="100%" style={{ flex:1 }}>
              <BarChart data={spendBarData} margin={{ top:20,right:8,left:-20,bottom:0 }} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0ec"/>
                <XAxis dataKey="name" tick={{ fontSize:12,fill:"#bbb" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11,fill:"#ccc" }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}`} unit=" pts"/>
                <Tooltip cursor={{ fill:"#f8f8f4" }} contentStyle={{ fontSize:13,borderRadius:8,border:"0.5px solid #e0e0e0" }}
                  formatter={(v,n,props)=>{
                    const pct = n==="vip"?props.payload.vipPct:n==="svip"?props.payload.svipPct:props.payload.imgPct;
                    const label = n==="vip"?"VIP":n==="svip"?"SVIP":"图片生成";
                    return [`${v.toLocaleString()} pts (${pct??0}%)`, label];
                  }}/>
                <Legend formatter={v=>v==="vip"?"VIP":v==="svip"?"SVIP":"图片生成"}
                  wrapperStyle={{ fontSize:12,paddingTop:8 }} iconType="circle" iconSize={8}/>
                <Bar dataKey="vip"  fill="#F97316" radius={[4,4,0,0]}>
                  <LabelList dataKey="vipPct"  position="top" formatter={v=>v!=null?`${v}%`:""} style={{ fontSize:10,fill:"#aaa" }}/>
                </Bar>
                <Bar dataKey="svip" fill="#8B5CF6" radius={[4,4,0,0]}>
                  <LabelList dataKey="svipPct" position="top" formatter={v=>v!=null?`${v}%`:""} style={{ fontSize:10,fill:"#aaa" }}/>
                </Bar>
                <Bar dataKey="img"  fill="#ccbfa0" radius={[4,4,0,0]}>
                  <LabelList dataKey="imgPct"  position="top" formatter={v=>v!=null?`${v}%`:""} style={{ fontSize:10,fill:"#aaa" }}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,overflow:"hidden" }}>

          <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"0.5px solid #eee",flexWrap:"wrap" }}>
            <div style={{ display:"flex",gap:2,background:"#f0ede8",padding:3,borderRadius:8 }}>
              {[["all","全部"],["earn","发行"],["spend","消耗"]].map(([t,l])=>(
                <button key={t} onClick={()=>changeTab(t)}
                  style={{ height:28,padding:"0 14px",fontSize:12,border:tab===t?"0.5px solid #e0e0e0":"none",
                    borderRadius:6,cursor:"pointer",background:tab===t?"#fff":"transparent",
                    color:tab===t?"#111":"#888",fontWeight:tab===t?500:400 }}>{l}</button>
              ))}
            </div>
            <select value={srcFilter} onChange={e=>changeSrc(e.target.value)} style={sel}>
              <option value="all">全部来源</option>
              <optgroup label="发行">
                <option value="email">绑定邮箱</option>
                <option value="refer">邀请好友</option>
                <option value="task">任务系统</option>
                <option value="buy">购买套餐</option>
                <option value="admin_add">后台添加积分</option>
              </optgroup>
              <optgroup label="消耗">
                <option value="vip">兑换 VIP</option>
                <option value="svip">兑换 SVIP</option>
                <option value="img">图片生成</option>
                <option value="admin_deduct">后台扣减积分</option>
              </optgroup>
            </select>
            {planOptions.length > 0 && (
              <select value={planFilter} onChange={e=>changePlan(e.target.value)} style={sel}>
                <option value="all">{srcFilter==="task" ? "全部任务种类" : srcFilter==="refer" ? "全部邀请类型" : "全部时长"}</option>
                {planOptions.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            )}
            <div style={{ position:"relative",display:"flex",alignItems:"center" }}>
              <span style={{ position:"absolute",left:9,fontSize:14,color:"#aaa" }}>🔍</span>
              <input value={search} onChange={e=>doSearch(e.target.value)}
                placeholder="搜索用户名..."
                style={{ paddingLeft:28,height:32,width:180,fontSize:13,borderRadius:8,border:"0.5px solid #ddd",outline:"none",color:"#333",backgroundColor:"#fff" }}/>
            </div>
            <div style={{ flex:1 }}/>
            <span style={{ fontSize:12,color:"#aaa" }}>共 {filtered.length} 条记录</span>
          </div>

          <table style={{ width:"100%",borderCollapse:"collapse",tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width:"5%" }}/><col style={{ width:"12%" }}/><col style={{ width:"7%" }}/>
              <col style={{ width:"18%" }}/><col style={{ width:"11%" }}/><col style={{ width:"10%" }}/><col style={{ width:"27%" }}/><col style={{ width:"10%" }}/>
            </colgroup>
            <thead>
              <tr style={{ background:"#fafaf8" }}>
                {["ID","用户名","类型","来源 / 场景","积分变化","变后余额","时间","操作"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 14px",fontSize:12,fontWeight:500,color:"#999",
                    textAlign:i>=4&&i<=5?"right":i===7?"center":"left",borderBottom:"0.5px solid #eee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r,i)=>{
                const m = ALL_SOURCES[r.src];
                const isEarn = r.type==="earn";
                let planBadge = <span style={{ color:"#ddd",fontSize:13 }}>—</span>;
                if (r.plan) {
                  const planStyle = r.src==="vip"
                    ? VIP_PLANS.find(p=>p.days===r.plan.days)
                    : SVIP_PLANS.find(p=>p.days===r.plan.days);
                  planBadge = (
                    <span style={{ display:"inline-block",padding:"2px 9px",borderRadius:5,fontSize:12,fontWeight:500,
                      background:planStyle?.bg||"#f0f0f0",color:planStyle?.text||"#333" }}>
                      {r.plan.days}天
                    </span>
                  );
                }
                return (
                  <tr key={r.id} style={{ borderBottom:i<slice.length-1?"0.5px solid #f0f0ec":"none" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#fafaf8"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px",fontSize:13,color:"#ccc" }}>{r.id}</td>
                    <td style={{ padding:"10px 14px",fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.user}</td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ display:"inline-flex",alignItems:"center",padding:"3px 8px",borderRadius:6,fontSize:12,fontWeight:500,
                        background:isEarn?"#E1F5EE":"#FAECE7",color:isEarn?"#085041":"#4A1B0C" }}>
                        {isEarn?"发行":"消耗"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {r.plan ? `兑换${r.plan.days}天${r.src.toUpperCase()}` : r.referType ?? r.taskLabel ?? m.label}
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,fontWeight:500,textAlign:"right",color:isEarn?"#0F6E56":"#993C1D" }}>
                      {isEarn?"+":"-"}{r.pts}
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,textAlign:"right",color:"#aaa" }}>{r.balance}</td>
                    <td style={{ padding:"10px 14px",fontSize:13,color:"#ccc" }}>{fmt(r.ts)}</td>
                    <td style={{ padding:"10px 14px",textAlign:"center",position:"relative" }}>
                      <button onClick={e=>{ e.stopPropagation(); setOpenMenu(openMenu===r.id?null:r.id); }}
                        style={{ background:"none",border:"0.5px solid #e0e0e0",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16,color:"#999",display:"inline-flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>
                        ···
                      </button>
                      {openMenu===r.id && (
                        <div onClick={e=>e.stopPropagation()}
                          style={{ position:"absolute",right:8,top:38,zIndex:100,background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,.08)",minWidth:160,padding:"4px 0" }}>
                          <div style={{ fontSize:12,fontWeight:500,color:"#bbb",padding:"6px 14px 4px" }}>操作</div>
                          {MENU_ITEMS.map((item,mi)=>(
                            <div key={mi}
                              style={{ padding:"7px 14px",fontSize:13,color: item==="封禁用户"?"#993C1D":"#333",cursor:"pointer",whiteSpace:"nowrap" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#f8f8f4"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ padding:"10px 16px",borderTop:"0.5px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontSize:12,color:"#aaa" }}>第 {safePage} / {totalPages} 页</span>
            <div style={{ display:"flex",gap:4 }}>
              {[["‹",safePage-1],...pgRange.map(p=>[String(p),p]),["›",safePage+1]].map(([label,p],idx)=>(
                <button key={idx} onClick={()=>goPage(Number(p))}
                  style={{ height:28,minWidth:28,padding:"0 6px",borderRadius:6,fontSize:12,cursor:"pointer",
                    border:String(p)===String(safePage)?"none":"0.5px solid #e0e0e0",
                    background:String(p)===String(safePage)?"#185FA5":"#fff",
                    color:String(p)===String(safePage)?"#fff":"#555",
                    fontWeight:String(p)===String(safePage)?500:400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        </> }

        {currentPage==="analytics" && (() => {
          const dailyRows = buildTimeSeries(timeGranularity, analyticsTxns);
          const analyticsSeriesData = buildTimeSeries(timeGranularity, analyticsTxns);
          const tblTotalPages = Math.max(1, Math.ceil(dailyRows.length / 10));
          const tblSafePage  = Math.min(trendView === "chart" ? 1 : parseInt(trendView) || 1, tblTotalPages);
          const tblSlice     = dailyRows.slice((tblSafePage - 1) * 10, tblSafePage * 10);
          const tblRange     = Array.from({length:tblTotalPages},(_,i)=>i+1).filter(p=>Math.abs(p-tblSafePage)<=2);
          const goTblPage    = p => setTrendView(String(Math.max(1, Math.min(p, tblTotalPages))));
          return (
            <>
              {/* Analytics date picker */}
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,background:"#fff",border:"0.5px solid #ddd",borderRadius:8,padding:"0 12px",height:34 }}>
                  <span style={{ fontSize:13,color:"#aaa" }}>📅</span>
                  <input type="datetime-local" value={aStartDate} max={aEndDate}
                    onChange={e=>setAStartDate(e.target.value)}
                    style={{ border:"none",outline:"none",fontSize:13,color:"#333",background:"transparent",cursor:"pointer",fontFamily:"'Inter','Noto Sans SC',system-ui,sans-serif" }}/>
                  <span style={{ fontSize:12,color:"#ccc" }}>—</span>
                  <input type="datetime-local" value={aEndDate} min={aStartDate}
                    onChange={e=>setAEndDate(e.target.value)}
                    style={{ border:"none",outline:"none",fontSize:13,color:"#333",background:"transparent",cursor:"pointer",fontFamily:"'Inter','Noto Sans SC',system-ui,sans-serif" }}/>
                </div>
              </div>
              <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,padding:"16px 20px",marginBottom:16 }}>
                {/* Chart header */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:500,fontSize:14 }}>积分流动趋势</div>
                    <div style={{ fontSize:12,color:"#999",marginTop:2 }}>发行与消耗积分随时间的变化</div>
                  </div>
                  <div style={{ display:"flex",gap:2,background:"#f0ede8",padding:3,borderRadius:8 }}>
                    {[["hour","按小时"],["day","按天"],["month","按月"],["year","按年"]].map(([v,l])=>(
                      <button key={v} onClick={()=>{ setTimeGranularity(v); setTrendView("1"); }}
                        style={{ height:28,padding:"0 14px",fontSize:12,border:timeGranularity===v?"0.5px solid #e0e0e0":"none",
                          borderRadius:6,cursor:"pointer",background:timeGranularity===v?"#fff":"transparent",
                          color:timeGranularity===v?"#111":"#888",fontWeight:timeGranularity===v?500:400 }}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Trend chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analyticsSeriesData} margin={{ top:4,right:4,left:-16,bottom:0 }}>
                    <defs>
                      <linearGradient id="gEarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#993C1D" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#993C1D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0ec"/>
                    <XAxis dataKey="date" tick={{ fontSize:11,fill:"#bbb" }} axisLine={false} tickLine={false}
                      interval={["hour","day"].includes(timeGranularity) ? Math.max(0, Math.floor(analyticsSeriesData.length/8)) : 0}/>
                    <YAxis tick={{ fontSize:11,fill:"#ccc" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ fontSize:13,borderRadius:8,border:"0.5px solid #e0e0e0" }}
                      formatter={(v,n)=>[v.toLocaleString(), n==="earn"?"发行积分":"消耗积分"]}/>
                    <Legend formatter={v=>v==="earn"?"发行积分":"消耗积分"} wrapperStyle={{ fontSize:12,color:"#888" }}/>
                    <Area type="monotone" dataKey="earn"  stroke="#1D9E75" strokeWidth={1.5} fill="url(#gEarn)"  dot={false}/>
                    <Area type="monotone" dataKey="spend" stroke="#993C1D" strokeWidth={1.5} fill="url(#gSpend)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>

                {/* Divider */}
                <div style={{ borderTop:"0.5px solid #f0f0ec",margin:"16px 0 12px" }}/>

                {/* Daily table header */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
                  <div style={{ fontWeight:500,fontSize:13 }}>{{ hour:"每小时明细", day:"每日明细", month:"每月明细", year:"每年明细" }[timeGranularity]}</div>
                  <span style={{ fontSize:12,color:"#aaa" }}>共 {dailyRows.length} 条</span>
                </div>
                <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                  <thead>
                    <tr style={{ background:"#fafaf8" }}>
                      {["日期","发行积分","消耗积分"].map((h,i)=>(
                        <th key={i} style={{ padding:"8px 14px",fontSize:12,fontWeight:500,color:"#999",
                          textAlign:i===0?"left":"right",borderBottom:"0.5px solid #eee" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tblSlice.map((row,i)=>(
                      <tr key={i} style={{ borderBottom:i<tblSlice.length-1?"0.5px solid #f0f0ec":"none" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#fafaf8"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"8px 14px",color:"#555" }}>{row.date}</td>
                        <td style={{ padding:"8px 14px",textAlign:"right",color:"#0F6E56",fontWeight:500 }}>+{row.earn.toLocaleString()}</td>
                        <td style={{ padding:"8px 14px",textAlign:"right",color:"#993C1D",fontWeight:500 }}>-{row.spend.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding:"10px 14px",borderTop:"0.5px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontSize:12,color:"#aaa" }}>第 {tblSafePage} / {tblTotalPages} 页</span>
                  <div style={{ display:"flex",gap:4 }}>
                    {[["‹",tblSafePage-1],...tblRange.map(p=>[String(p),p]),["›",tblSafePage+1]].map(([label,p],idx)=>(
                      <button key={idx} onClick={()=>goTblPage(Number(p))}
                        style={{ height:28,minWidth:28,padding:"0 6px",borderRadius:6,fontSize:12,cursor:"pointer",
                          border:String(p)===String(tblSafePage)?"none":"0.5px solid #e0e0e0",
                          background:String(p)===String(tblSafePage)?"#185FA5":"#fff",
                          color:String(p)===String(tblSafePage)?"#fff":"#555",
                          fontWeight:String(p)===String(tblSafePage)?500:400 }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
}