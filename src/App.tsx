import{useState,useMemo}from'react'
  type Type='income'|'expense'
  interface Entry{id:string;label:string;amount:number;type:Type;category:string}
  const COLORS=['#38bdf8','#22c55e','#f59e0b','#ef4444','#a855f7','#ec4899','#06b6d4','#84cc16']
  const CATS_EXP=['Housing','Food','Transport','Utilities','Health','Entertainment','Shopping','Other']
  const CATS_INC=['Salary','Freelance','Investment','Gift','Other']
  const uid=()=>Math.random().toString(36).slice(2,8)
  const fmt=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(n)
  const DEFAULT:Entry[]=[
    {id:uid(),label:'Monthly Salary',amount:5000,type:'income',category:'Salary'},
    {id:uid(),label:'Freelance Project',amount:1200,type:'income',category:'Freelance'},
    {id:uid(),label:'Rent',amount:1500,type:'expense',category:'Housing'},
    {id:uid(),label:'Groceries',amount:400,type:'expense',category:'Food'},
    {id:uid(),label:'Internet & Phone',amount:120,type:'expense',category:'Utilities'},
    {id:uid(),label:'Gym',amount:80,type:'expense',category:'Health'},
  ]
  export default function App(){
    const[entries,setEntries]=useState<Entry[]>(DEFAULT)
    const[label,setLabel]=useState('')
    const[amount,setAmount]=useState('')
    const[type,setType]=useState<Type>('expense')
    const[cat,setCat]=useState('Food')
    const income=useMemo(()=>entries.filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0),[entries])
    const expense=useMemo(()=>entries.filter(e=>e.type==='expense').reduce((s,e)=>s+e.amount,0),[entries])
    const balance=income-expense
    const catTotals=useMemo(()=>{
      const map:Record<string,number>={}
      entries.filter(e=>e.type==='expense').forEach(e=>{map[e.category]=(map[e.category]||0)+e.amount})
      return Object.entries(map).sort(([,a],[,b])=>b-a)
    },[entries])
    const add=()=>{
      if(!label||!+amount)return
      setEntries(e=>[...e,{id:uid(),label,amount:+amount,type,category:cat}])
      setLabel('');setAmount('')
    }
    return(
      <div style={{minHeight:'100vh',background:'#0f172a',fontFamily:'Inter,system-ui,sans-serif',color:'#e2e8f0',padding:'2rem'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h1 style={{fontWeight:800,fontSize:'1.75rem',marginBottom:'1.5rem',color:'#f8fafc',textAlign:'center'}}>💰 Budget Planner</h1>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
            {[{label:'Income',val:income,color:'#22c55e'},{label:'Expenses',val:expense,color:'#ef4444'},{label:'Balance',val:balance,color:balance>=0?'#38bdf8':'#f59e0b'}].map(({label,val,color})=>(
              <div key={label} style={{background:'#111827',border:'1px solid #1e293b',borderRadius:12,padding:'1.25rem',textAlign:'center'}}>
                <div style={{fontSize:'1.75rem',fontWeight:800,color}}>{fmt(val)}</div>
                <div style={{color:'#94a3b8',fontSize:'0.85rem',marginTop:'0.25rem'}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'2rem'}}>
            <div style={{background:'#111827',border:'1px solid #1e293b',borderRadius:12,padding:'1.25rem'}}>
              <h3 style={{fontWeight:700,marginBottom:'1rem',color:'#94a3b8',fontSize:'0.85rem',letterSpacing:'0.05em'}}>EXPENSE BY CATEGORY</h3>
              {catTotals.map(([c,v],i)=>{
                const pct=expense>0?(v/expense)*100:0
                return(
                  <div key={c} style={{marginBottom:'0.75rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem',fontSize:'0.85rem'}}>
                      <span>{c}</span><span style={{color:COLORS[i%COLORS.length]}}>{fmt(v)}</span>
                    </div>
                    <div style={{height:6,background:'#1e293b',borderRadius:3}}><div style={{height:'100%',background:COLORS[i%COLORS.length],borderRadius:3,width:`${pct}%`}}/></div>
                  </div>
                )
              })}
            </div>
            <div style={{background:'#111827',border:'1px solid #1e293b',borderRadius:12,padding:'1.25rem'}}>
              <h3 style={{fontWeight:700,marginBottom:'1rem',color:'#94a3b8',fontSize:'0.85rem',letterSpacing:'0.05em'}}>ADD ENTRY</h3>
              <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Description..." style={{width:'100%',background:'#0f172a',border:'1px solid #334155',borderRadius:6,padding:'0.5rem 0.75rem',color:'#e2e8f0',outline:'none',marginBottom:'0.75rem',fontSize:'0.9rem'}}/>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" style={{width:'100%',background:'#0f172a',border:'1px solid #334155',borderRadius:6,padding:'0.5rem 0.75rem',color:'#e2e8f0',outline:'none',marginBottom:'0.75rem',fontSize:'0.9rem'}}/>
              <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.75rem'}}>
                {(['income','expense'] as Type[]).map(t=><button key={t} onClick={()=>{setType(t);setCat(t==='income'?CATS_INC[0]:CATS_EXP[0])}} style={{flex:1,padding:'0.45rem',background:type===t?(t==='income'?'#166534':'#7f1d1d'):'#1e293b',color:type===t?(t==='income'?'#86efac':'#fca5a5'):'#94a3b8',border:'none',borderRadius:6,cursor:'pointer',fontSize:'0.85rem',textTransform:'capitalize'}}>{t}</button>)}
              </div>
              <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:'100%',background:'#0f172a',border:'1px solid #334155',borderRadius:6,padding:'0.5rem',color:'#94a3b8',outline:'none',marginBottom:'0.75rem',fontSize:'0.85rem'}}>
                {(type==='income'?CATS_INC:CATS_EXP).map(c=><option key={c}>{c}</option>)}
              </select>
              <button onClick={add} style={{width:'100%',padding:'0.65rem',background:'#0ea5e9',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>+ Add Entry</button>
            </div>
          </div>
          <div style={{background:'#111827',border:'1px solid #1e293b',borderRadius:12,overflow:'hidden'}}>
            <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #1e293b',fontWeight:700,color:'#94a3b8',fontSize:'0.85rem',letterSpacing:'0.05em'}}>ALL ENTRIES</div>
            {entries.map(e=>(
              <div key={e.id} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.75rem 1.5rem',borderBottom:'1px solid #0f172a'}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:'0.9rem'}}>{e.label}</div>
                  <div style={{color:'#475569',fontSize:'0.75rem'}}>{e.category}</div>
                </div>
                <div style={{fontWeight:700,color:e.type==='income'?'#22c55e':'#ef4444'}}>{e.type==='income'?'+':'-'}{fmt(e.amount)}</div>
                <button onClick={()=>setEntries(es=>es.filter(x=>x.id!==e.id))} style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:'1rem'}}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }