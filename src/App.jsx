import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";

const EARN_SOURCES = {
  email: { label: "绑定邮箱", icon: "✉" },
  refer: { label: "邀请好友", icon: "👥" },
  task:  { label: "任务系统", icon: "✅" },
};
const SPEND_SOURCES = {
  vip:  { label: "兑换 VIP",  icon: "👑" },
  svip: { label: "兑换 SVIP", icon: "⭐" },
  img:  { label: "图片生成",  icon: "🖼" },
};
const ALL_SOURCES = { ...EARN_SOURCES, ...SPEND_SOURCES };

const VIP_PLANS  = [
  { days:1,  pts:30,  color:"#FAC775", bg:"#FEF4E2", text:"#633806" },
  { days:3,  pts:70,  color:"#EF9F27", bg:"#FAEEDA", text:"#633806" },
  { days:7,  pts:150, color:"#BA7517", bg:"#F5E2C0", text:"#412402" },
  { days:30, pts:500, color:"#854F0B", bg:"#EDD7B0", text:"#412402" },
];
const SVIP_PLANS = [
  { days:1,  pts:60,  color:"#9FE1CB", bg:"#E8FAF4", text:"#085041" },
  { days:3,  pts:150, color:"#5DCAA5", bg:"#CBEFE2", text:"#085041" },
  { days:7,  pts:300, color:"#1D9E75", bg:"#B0E5D0", text:"#04342C" },
  { days:30, pts:900, color:"#0F6E56", bg:"#9FE1CB", text:"#04342C" },
];

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
const NAMES = ["wx_user88","refer_king","task001","alg123456","ik254","qq258","wsxnko","986571","2378rygfae","gfa_vip","moon99","sky_top","netfan","promax1","daily01","aloha22","bright5","coolx7","doge_m","elitevpn"];
const TASK_LABELS = [
  "完成关注 X 平台账号任务",
  "完成留言 @吴老师 帖子任务",
  "完成关注小红书平台账号任务",
  "完成留言 @李老师 帖子任务",
  "完成关注 INS 平台账号任务",
];

function pickWeighted(plans, weights) {
  const total = weights.reduce((a,b) => a+b, 0);
  let r = rnd(0, total-1);
  for (let i=0; i<weights.length; i++) { r -= weights[i]; if (r < 0) return plans[i]; }
  return plans[0];
}

const TRANSACTIONS = Array.from({ length:200 }, (_, i) => {
  const isEarn = Math.random() > 0.42;
  let src, pts, plan = null;
  let taskLabel = null;
  if (isEarn) {
    src = ["email","refer","task"][rnd(0,2)];
    pts = [30,50,70,100][rnd(0,3)];
    if (src === "task") taskLabel = TASK_LABELS[rnd(0, TASK_LABELS.length - 1)];
  } else {
    src = ["vip","svip","img"][rnd(0,2)];
    if (src==="vip")       { plan = pickWeighted(VIP_PLANS,  [40,25,15,20]); pts = plan.pts; }
    else if (src==="svip") { plan = pickWeighted(SVIP_PLANS, [30,25,20,25]); pts = plan.pts; }
    else pts = [10,20,50][rnd(0,2)];
  }
  const base = new Date("2026-05-11T10:45:00");
  const ts   = new Date(base.getTime() - i * rnd(2,15) * 60000);
  return { id:i+1, user:NAMES[rnd(0,NAMES.length-1)], src, pts, plan, taskLabel, type:isEarn?"earn":"spend", ts, balance:rnd(60,3000) };
});

const EARN_PIE = [
  { name:"绑定邮箱", value:34, color:"#1D9E75" },
  { name:"邀请好友", value:41, color:"#5DCAA5" },
  { name:"任务系统", value:25, color:"#9FE1CB" },
];

function buildSpendBar() {
  const tally = { vip:{1:0,3:0,7:0,30:0}, svip:{1:0,3:0,7:0,30:0}, img:0 };
  TRANSACTIONS.forEach(r => {
    if (r.type!=="spend") return;
    if ((r.src==="vip"||r.src==="svip") && r.plan) tally[r.src][r.plan.days]++;
    else if (r.src==="img") tally.img++;
  });
  return [
    { name:"VIP 1天",  count:tally.vip[1],   color:"#FAC775", src:"vip",  days:1  },
    { name:"VIP 3天",  count:tally.vip[3],   color:"#EF9F27", src:"vip",  days:3  },
    { name:"VIP 7天",  count:tally.vip[7],   color:"#BA7517", src:"vip",  days:7  },
    { name:"VIP 30天", count:tally.vip[30],  color:"#854F0B", src:"vip",  days:30 },
    { name:"SVIP 1天", count:tally.svip[1],  color:"#9FE1CB", src:"svip", days:1  },
    { name:"SVIP 3天", count:tally.svip[3],  color:"#5DCAA5", src:"svip", days:3  },
    { name:"SVIP 7天", count:tally.svip[7],  color:"#1D9E75", src:"svip", days:7  },
    { name:"SVIP 30天",count:tally.svip[30], color:"#0F6E56", src:"svip", days:30 },
    { name:"图片生成",  count:tally.img,      color:"#ccbfa0", src:"img",  days:null },
  ];
}
const SPEND_BAR = buildSpendBar();
const SPEND_TOTAL = SPEND_BAR.reduce((s, d) => s + d.count, 0);

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

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = SPEND_BAR.find(b => b.name===label);
  return (
    <div style={{ background:"#fff",border:"0.5px solid #e0e0e0",borderRadius:8,padding:"8px 12px",fontSize:13,boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ fontWeight:500,marginBottom:4,color:"#111" }}>{label}</div>
      <div style={{ color:"#888" }}>兑换次数：<b style={{ color:"#111" }}>{payload[0].value}</b></div>
      {d?.days && <div style={{ color:"#888",marginTop:2 }}>套餐时长：<b style={{ color:"#111" }}>{d.days} 天</b></div>}
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

  const planOptions = useMemo(() => {
    if (srcFilter==="vip")  return VIP_PLANS.map(p=>({ v:String(p.days), l:`${p.days}天` }));
    if (srcFilter==="svip") return SVIP_PLANS.map(p=>({ v:String(p.days), l:`${p.days}天` }));
    if (srcFilter==="task") return [...new Set(TASK_LABELS)].map(t=>({ v:t, l:t }));
    return [];
  }, [srcFilter]);

  const filtered = useMemo(() => TRANSACTIONS.filter(r => {
    if (tab==="earn"  && r.type!=="earn")  return false;
    if (tab==="spend" && r.type!=="spend") return false;
    if (srcFilter!=="all" && r.src!==srcFilter) return false;
    if (planFilter!=="all") {
      if (srcFilter==="task" ? r.taskLabel!==planFilter : (!r.plan || String(r.plan.days)!==planFilter)) return false;
    }
    if (search && !r.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tab, srcFilter, planFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/PER));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage-1)*PER, safePage*PER);
  const pgRange    = Array.from({length:totalPages},(_,i)=>i+1).filter(p=>Math.abs(p-safePage)<=2);

  const earnedPts = useMemo(() => filtered.filter(r=>r.type==="earn").reduce((s,r)=>s+r.pts,0), [filtered]);
  const spentPts  = useMemo(() => filtered.filter(r=>r.type==="spend").reduce((s,r)=>s+r.pts,0), [filtered]);
  const isFiltered = srcFilter!=="all" || planFilter!=="all" || tab!=="all" || search!=="";

  function changeTab(t)  { setTab(t);        setPage(1); }
  function changeSrc(s)  { setSrcFilter(s);  setPlanFilter("all"); setPage(1); }
  function changePlan(p) { setPlanFilter(p); setPage(1); }
  function doSearch(s)   { setSearch(s);     setPage(1); }
  function goPage(p)     { setPage(Math.max(1,Math.min(p,totalPages))); }

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif",fontSize:14,color:"#1a1a1a",background:"#f5f5f0",minHeight:"100vh",paddingBottom:"2rem" }}>

      {/* Header */}
      <div style={{ textAlign:"center",padding:"28px 24px 20px" }}>
        <h1 style={{ fontSize:28,fontWeight:600,margin:0,color:"#111" }}>积分记录</h1>
        <p style={{ fontSize:13,color:"#888",marginTop:6 }}>追踪积分的获取与消耗，分析来源与使用分布</p>
      </div>

      <div style={{ maxWidth:1440,margin:"0 auto",padding:"0 32px" }}>

        {/* Toolbar */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <button style={btn}>📅 2026-05-01 — 2026-05-11</button>
          <select value={srcFilter} onChange={e=>changeSrc(e.target.value)} style={sel}>
            <option value="all">全部来源</option>
            <optgroup label="获取">
              <option value="email">绑定邮箱</option>
              <option value="refer">邀请好友</option>
              <option value="task">任务系统</option>
            </optgroup>
            <optgroup label="消耗">
              <option value="vip">兑换 VIP</option>
              <option value="svip">兑换 SVIP</option>
              <option value="img">图片生成</option>
            </optgroup>
          </select>
          {planOptions.length > 0 && (
            <select value={planFilter} onChange={e=>changePlan(e.target.value)} style={sel}>
              <option value="all">{srcFilter==="task" ? "全部任务种类" : "全部时长"}</option>
              {planOptions.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          )}
          <div style={{ flex:1 }}/>
          <button style={btn}>⬇ 导出 CSV</button>
        </div>

        {/* Metrics */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
          {[
            { label:"总获取积分",    value: isFiltered ? earnedPts.toLocaleString() : "1,284,600", sub: isFiltered ? `筛选结果共 ${filtered.filter(r=>r.type==="earn").length} 笔` : "↑ 12.4% 较上期", color:"#0F6E56", icon:"＋" },
            { label:"总消耗积分",    value: isFiltered ? spentPts.toLocaleString()  : "987,450",   sub: isFiltered ? `筛选结果共 ${filtered.filter(r=>r.type==="spend").length} 笔` : "↑ 8.1% 较上期",  color:"#993C1D", icon:"－" },
            { label:"净积分流通",    value: isFiltered ? (earnedPts - spentPts).toLocaleString()  : "297,150",   sub:"库存积分余量",      color:"#185FA5", icon:"≈"  },
            { label:"有积分活跃用户",value:"38,241",    sub:"平均余额 156 pts", color:"#854F0B", icon:"◉"  },
          ].map((m,i)=>(
            <div key={i} style={{ background:"#fff",borderRadius:10,border:"0.5px solid #e8e8e0",padding:"14px 16px" }}>
              <div style={{ fontSize:12,color:"#999",marginBottom:6,display:"flex",alignItems:"center",gap:5 }}>
                <span style={{ color:m.color,fontWeight:700 }}>{m.icon}</span>{m.label}
              </div>
              <div style={{ fontSize:22,fontWeight:600,color:m.color }}>{m.value}</div>
              <div style={{ fontSize:12,color:"#aaa",marginTop:3 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 2fr",gap:12,marginBottom:16 }}>

          {/* Earn donut */}
          <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,padding:"16px 20px" }}>
            <div style={{ fontWeight:500,fontSize:14,marginBottom:2 }}>积分获取来源</div>
            <div style={{ fontSize:12,color:"#999",marginBottom:10 }}>各渠道累计发放量</div>
            <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
              {EARN_PIE.map((d,i)=>(
                <span key={i} style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#666" }}>
                  <span style={{ width:10,height:10,borderRadius:2,background:d.color,flexShrink:0 }}/>
                  <span style={{ flex:1 }}>{d.name}</span>
                  <span style={{ fontWeight:500,color:"#333" }}>{d.value}%</span>
                </span>
              ))}
            </div>
            <DonutChart data={EARN_PIE} center="获取" />
          </div>

          {/* Spend bar */}
          <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,padding:"16px 20px" }}>
            <div style={{ fontWeight:500,fontSize:14,marginBottom:2 }}>积分消耗细分</div>
            <div style={{ fontSize:12,color:"#999",marginBottom:12 }}>VIP / SVIP 按套餐时长拆分</div>

            {/* Legend */}
            <div style={{ display:"flex",gap:24,marginBottom:12,flexWrap:"wrap" }}>
              {[
                { label:"VIP", items:[{c:"#FAC775",l:"1天"},{c:"#EF9F27",l:"3天"},{c:"#BA7517",l:"7天"},{c:"#854F0B",l:"30天"}] },
                { label:"SVIP",items:[{c:"#9FE1CB",l:"1天"},{c:"#5DCAA5",l:"3天"},{c:"#1D9E75",l:"7天"},{c:"#0F6E56",l:"30天"}] },
                { label:"其他",items:[{c:"#ccbfa0",l:"图片生成"}] },
              ].map((g,gi)=>(
                <div key={gi}>
                  <div style={{ fontSize:11,color:"#bbb",marginBottom:4 }}>{g.label}</div>
                  <div style={{ display:"flex",gap:8 }}>
                    {g.items.map((d,di)=>(
                      <span key={di} style={{ display:"flex",alignItems:"center",gap:3,fontSize:12,color:"#777" }}>
                        <span style={{ width:10,height:10,borderRadius:2,background:d.c,display:"inline-block" }}/>{d.l}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={SPEND_BAR} margin={{ top:20,right:0,left:-20,bottom:0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0ec"/>
                <XAxis dataKey="name" tick={{ fontSize:11,fill:"#bbb" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11,fill:"#ccc" }} axisLine={false} tickLine={false}/>
                <Tooltip content={<BarTooltip/>} cursor={{ fill:"#f8f8f4" }}/>
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {SPEND_BAR.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  <LabelList dataKey="count" position="top"
                    formatter={v => SPEND_TOTAL > 0 ? `${Math.round(v/SPEND_TOTAL*100)}%` : ""}
                    style={{ fontSize:10, fill:"#aaa" }}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:"#fff",border:"0.5px solid #e8e8e0",borderRadius:12,overflow:"hidden" }}>

          <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"0.5px solid #eee",flexWrap:"wrap" }}>
            <div style={{ display:"flex",gap:2,background:"#f0ede8",padding:3,borderRadius:8 }}>
              {[["all","全部"],["earn","获取"],["spend","消耗"]].map(([t,l])=>(
                <button key={t} onClick={()=>changeTab(t)}
                  style={{ height:28,padding:"0 14px",fontSize:12,border:tab===t?"0.5px solid #e0e0e0":"none",
                    borderRadius:6,cursor:"pointer",background:tab===t?"#fff":"transparent",
                    color:tab===t?"#111":"#888",fontWeight:tab===t?500:400 }}>{l}</button>
              ))}
            </div>
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
              <col style={{ width:"5%" }}/><col style={{ width:"13%" }}/><col style={{ width:"7%" }}/>
              <col style={{ width:"20%" }}/><col style={{ width:"12%" }}/><col style={{ width:"11%" }}/><col style={{ width:"32%" }}/>
            </colgroup>
            <thead>
              <tr style={{ background:"#fafaf8" }}>
                {["ID","用户名","类型","来源 / 场景","积分变化","变后余额","时间"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 14px",fontSize:12,fontWeight:500,color:"#999",
                    textAlign:i>=4&&i<=5?"right":"left",borderBottom:"0.5px solid #eee" }}>{h}</th>
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
                        {isEarn?"获取":"消耗"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {r.plan ? `兑换${r.plan.days}天${r.src.toUpperCase()}` : r.taskLabel ?? m.label}
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,fontWeight:500,textAlign:"right",color:isEarn?"#0F6E56":"#993C1D" }}>
                      {isEarn?"+":"-"}{r.pts}
                    </td>
                    <td style={{ padding:"10px 14px",fontSize:13,textAlign:"right",color:"#aaa" }}>{r.balance}</td>
                    <td style={{ padding:"10px 14px",fontSize:13,color:"#ccc" }}>{fmt(r.ts)}</td>
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
      </div>
    </div>
  );
}