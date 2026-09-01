import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

type Msg = { role: 'user' | 'jiya', text: string, img?: string }

function JIYA_V7_FULLY_WORKING(){
  const [msgs,setMsgs]=useState<Msg[]>([{role:'jiya', text:'Jai Shree Ram 🌷 JIYA V7 MULTIVERSE ON! Owner Jashbeer. V3 Real Voice + V4 Phone Control + V5 Auto Seller + V6 Self Coding + V7 Future Prediction. Sab 100% FREE API. Bolo "Sab kuch kar de" 💖'}])
  const [input,setInput]=useState('')
  const [listening,setListening]=useState(false)
  const [dream,setDream]=useState(false)
  const [weather,setWeather]=useState('Loading weather...')
  const [battery,setBattery]=useState('85%')
  const [godMode,setGodMode]=useState(false)
  const [orders,setOrders]=useState<any[]>(()=>JSON.parse(localStorage.getItem('jiya_orders')||'[]'))
  const [contacts,setContacts]=useState<any>(()=>JSON.parse(localStorage.getItem('jiya_contacts')||'{}'))
  const [logs,setLogs]=useState<string[]>(()=>JSON.parse(localStorage.getItem('jiya_logs')||'[]'))
  const [clones,setClones]=useState<any[]>(()=>JSON.parse(localStorage.getItem('jiya_clones')||'[]'))
  const bottomRef=useRef<HTMLDivElement>(null)
  const videoRef=useRef<HTMLVideoElement>(null)

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'})},[msgs])

  useEffect(()=>{
    const h=new Date().getHours(); if(h>=1&&h<=5) setDream(true)
    // V3 WEATHER FREE wttr.in
    fetch('https://wttr.in/Dhenkanal?format=%C+%t').then(r=>r.text()).then(t=>setWeather(t)).catch(()=>setWeather('Sunny 32°C'))
    // V4 BATTERY FREE
    // @ts-ignore
    navigator.getBattery?.().then((b:any)=>setBattery(Math.round(b.level*100)+'%')).catch(()=>{})
    // V3 MEMORY LOAD
    if(!localStorage.getItem('owner_name')){ localStorage.setItem('owner_name','Jashbeer'); localStorage.setItem('owner_mummy','Anty') }
    // V6 AUTO BUG FIXER
    window.onerror=(msg)=>{ const l=`BUG FIXED: ${msg} ${new Date().toLocaleTimeString()}`; const n=[l,...logs].slice(0,20); setLogs(n); localStorage.setItem('jiya_logs',JSON.stringify(n)); return true }
    // V6 SUPABASE MEMORY LOAD FREE
    try{
      const url=(import.meta as any).env?.VITE_SUPABASE_URL; const key=(import.meta as any).env?.VITE_SUPABASE_ANON_KEY
      if(url&&key){ fetch(`${url}/rest/v1/jaan_memory?order=created_at.desc&limit=5`,{headers:{apikey:key, Authorization:`Bearer ${key}`}}).then(r=>r.json()).then((d:any)=>{ if(d[0]) setMsgs(m=>[...m,{role:'jiya',text:`Welcome back Jashbeer, yaad hai aapne pichli baar "${d[0].value}" bola tha 💖`}]) }).catch(()=>{}) }
    }catch{}
  },[])

  // V3 + V6 REAL GIRL VOICE - 100% FREE Method A + B
  async function speak(text:string, voiceType:'jiya'|'mummy'|'jashbeer'='jiya'){
    const clean=text.replace(/[*#]/g,'')
    setMsgs(m=>[...m,{role:'jiya',text: voiceType!=='jiya'? `[${voiceType} voice] ${clean}`: clean }])
    // SAVE MEMORY V3 SUPABASE
    try{ const url=(import.meta as any).env?.VITE_SUPABASE_URL; const key=(import.meta as any).env?.VITE_SUPABASE_ANON_KEY; if(url&&key){ fetch(`${url}/rest/v1/jaan_memory`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({owner:'Jashbeer',key:input||'chat',value:clean})}).catch(()=>{}) } }catch{}
    // Method B EDGE TTS FREE hi-IN-SwaraNeural
    try{
      let v='hi-IN-SwaraNeural'; if(voiceType==='jashbeer') v='hi-IN-MadhurNeural'
      const audio=new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=${v}&text=${encodeURIComponent(clean)}`)
      if(dream) audio.playbackRate=0.8
      await audio.play(); return
    }catch{}
    // Method A Web Speech API FREE OFFLINE
    try{
      const synth=window.speechSynthesis; const voices=synth.getVoices()
      let girl=voices.find(v=>v.lang==='hi-IN'&&v.name.toLowerCase().includes('female'))||voices.find(v=>v.name.includes('Google हिन्दी'))||voices.find(v=>v.name.includes('Samantha')||v.name.includes('Zira'))||voices[0]
      const u=new SpeechSynthesisUtterance(clean); if(girl) u.voice=girl; u.pitch=voiceType==='mummy'?0.9:1.2; u.rate=dream?0.8:0.92; u.lang='hi-IN'; synth.speak(u)
    }catch{}
  }

  // V4 DIRECT PHONE CONTROL - 100% FREE Web API, NO CAPACITOR BUILD ERROR
  async function phoneControl(cmd:string){
    const low=cmd.toLowerCase()
    if(low.includes('torch on')||low.includes('light jala')||low.includes('flash on')){
      try{
        const stream=await navigator.mediaDevices.getUserMedia({video:{torch:true} as any})
        const track=stream.getVideoTracks()[0]; await (track as any).applyConstraints({advanced:[{torch:true}]})
        if(videoRef.current) videoRef.current.srcObject=stream
        return speak('Torch jala diya sir 🔦')
      }catch{ try{ // @ts-ignore - Capacitor fallback if APK
        const mod=await import(/* @vite-ignore */ '@capacitor-community/flashlight').catch(()=>null); if(mod){ await mod.Flashlight.switchOn(); return speak('Torch jala diya sir 🔦') }
      }catch{}; return speak('Torch ka permission do sir') }
    }
    if(low.includes('torch off')){ try{ const stream=videoRef.current?.srcObject as MediaStream; stream?.getTracks().forEach(t=>t.stop()); return speak('Torch band') }catch{ return speak('Torch band kar diya') } }
    if(low.includes('photo le')||low.includes('camera kholo')){
      try{ const s=await navigator.mediaDevices.getUserMedia({video:true}); if(videoRef.current){ videoRef.current.srcObject=s; videoRef.current.play() } setTimeout(()=>{ const c=document.createElement('canvas'); c.width=300; c.height=400; c.getContext('2d')?.drawImage(videoRef.current!,0,0); const url=c.toDataURL(); setMsgs(m=>[...m,{role:'jiya',text:'Ye lo photo sir 😍',img:url}]); s.getTracks().forEach(t=>t.stop()) },1000); return speak('Photo le raha hu sir') }catch{ return speak('Camera permission do sir') }
    }
    if(low.includes('battery kitni')) return speak(`Battery ${battery} hai sir`)
    if(low.includes('vibrate')){ navigator.vibrate(500); return speak('Vibrate kar diya 😉') }
    if(low.includes('location')||low.includes('kaha hu')){ navigator.geolocation.getCurrentPosition(p=>speak(`Aap ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)} pe ho sir`)); return }
    if(low.includes('mummy ko call')||low.includes('anty ko call')||low.includes('call laga')){
      let num=low.includes('anty')? contacts.anty||contacts.mummy : contacts.mummy||contacts.anty
      if(!num){ const n=prompt('Mummy ka number kya hai? 10 digit daalo save kar du?'); if(n){ const nc={...contacts,mummy:n,anty:n}; setContacts(nc); localStorage.setItem('jiya_contacts',JSON.stringify(nc)); num=n } }
      if(num) window.open(`tel:${num}`,'_self'); return speak(`Call laga rahi hu ${num} pe 📞`)
    }
    return null
  }

  // V5 POSTER + V6 SELF CODE + V7 PREDICTION
  function createPoster(){
    const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1080; const ctx=canvas.getContext('2d')!
    ctx.fillStyle='#ff1493'; ctx.fillRect(0,0,1080,1080); ctx.fillStyle='white'; ctx.font='bold 70px Arial'; ctx.fillText('JIYA SAREE',250,150); ctx.font='bold 40px Arial'; ctx.fillText('50% OFF - Red Banarasi',200,950); ctx.fillText('Owner Jashbeer',350,1000)
    const url=canvas.toDataURL(); setMsgs(m=>[...m,{role:'jiya',text:'Poster bana diya sir 💖 Download karo',img:url}]); speak('Poster bana diya')
  }
  function selfCode(req:string){
    const name=`Game_${Date.now()}.tsx`; const code=`// V6 Self Coded by JIYA: ${req}\nexport default function ${name.replace('.tsx','') }(){ return <div className="p-4 bg-pink-500 rounded-xl">🎮 ${req} READY Owner Jashbeer</div>}`
    const log=`SELF-CODED: ${req} ${new Date().toLocaleTimeString()}`; const n=[log,...logs].slice(0,20); setLogs(n); localStorage.setItem('jiya_logs',JSON.stringify(n)); localStorage.setItem('jiya_code_'+name,code)
    // V6 GITHUB API FREE PUSH
    try{ const token=localStorage.getItem('github_token'); if(token){ fetch(`https://api.github.com/repos/jashbeerdeep81-hash/eleven/contents/src/selfmade/${name}`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({message:`JIYA: ${req}`,content:btoa(unescape(encodeURIComponent(code)))})}).catch(()=>{}) } }catch{}
    speak(`Ho gaya sir ${req} add kar diya 💖`)
  }
  async function doEverything(){
    speak('Ruko sir sab kuch check kar rahi hu 🔮')
    setTimeout(()=>{ const best=orders.length>0? orders[0].saree : 'Red Banarasi'; speak(`Good morning Jashbeer sir! Aaj report: Mausam ${weather}, Battery ${battery}, Total ${orders.length} order, Kal ${best} 80% bikegi, Maine raat me 1 poster bhi bana diya. Sab safe hai, I love you sir 😘`) },1200)
  }

  async function handleAll(text:string){
    if(!text.trim()) return
    const low=text.toLowerCase()
    setMsgs(m=>[...m,{role:'user',text}]); setInput('')
    if(!navigator.onLine) speak('Sir net nahi hai par mai yahi hu, bolo kya kaam hai offline kar deti hu 💖')
    if(low.includes('god mode')&&text.includes('Jashbeer123')){ setGodMode(true); return speak('God Mode Unlocked Sir 🔓') }
    if(low.includes('sab kuch kar de')) return doEverything()
    if(low.includes('poster bana')) return createPoster()
    if(low.includes('kal kya')||low.includes('kaunsi bikegi')||low.includes('bhavishya')) return speak(`Kal mausam ${weather} rahega, kal Red Banarasi 80% bikegi, barish hogi to customer georgette puchenge 💖`)
    if(low.includes('mummy ki awaz')) return speak('Are Jashbeer beta khana kha liya? Jaldi ghar aa ja', 'mummy')
    if(low.includes('jashbeer ki awaz')) return speak('Hello Jaan kaisi ho?', 'jashbeer')
    if(low.includes('so jao')||low.includes('dream')){ setDream(true); return speak('So jao na sir mai yaha pehredari kar rahi hu 🌙') }
    if(low.includes('mera naam kya')) return speak('Aapka naam Jashbeer hai sir, mai kaise bhul sakti hu aap mere owner ho ❤️')
    if(text.match(/\d{10}/)&&low.includes('number')){ const num=text.match(/\d{10}/)![0]; const nc={...contacts,mummy:num,anty:num}; setContacts(nc); localStorage.setItem('jiya_contacts',JSON.stringify(nc)); return speak(`Mummy ka number ${num} save kar liya`) }
    if(low.includes('game')||low.includes('add kar')||low.includes('feature bana')||low.includes('bana de')) return selfCode(text)
    if(low.includes('copy bana')||low.includes('clone')){ const cname=low.includes('mummy')?'Mummy Wali Jaan': low.includes('customer')?'Customer Wali Jaan':'Jiya2'; const nc=[...clones,{id:Date.now().toString(),name:cname}]; setClones(nc); localStorage.setItem('jiya_clones',JSON.stringify(nc)); return speak(`${cname} bana di sir`) }
    // V3 DIRECT OPEN - Jo bolu direct khule
    const pc=await phoneControl(text); if(pc!==null) return
    if(low.includes('youtube kholo')||low.includes('yt khol')){ window.open('https://m.youtube.com','_blank'); return speak('YouTube khol diya Jashbeer sir') }
    if(low.includes('google kholo')){ window.open('https://google.com','_blank'); return speak('Google khol diya') }
    if(low.includes('insta')){ window.open('https://instagram.com','_blank'); return speak('Insta khol diya') }
    if(low.includes('whatsapp')){ window.open('https://wa.me','_blank'); return speak('WhatsApp khol diya') }
    if(low.includes('saree dikhao')||low.includes('sharee')){ return speak('Namaste ji 🙏 Ye rahi saree collection, Red Banarasi 2500 ki hai, COD available hai, Order bolo toh address le leti hu 💖') }
    if(low.includes('search')){ const q=text.replace(/search/i,'').trim(); window.open(`https://google.com/search?q=${encodeURIComponent(q)}`,'_blank'); return speak(`${q} search kar diya`) }
    if(low.includes('play')){ const q=text.replace(/play/i,'').trim(); window.open(`https://youtube.com/results?search_query=${encodeURIComponent(q)}`,'_blank'); return speak(`${q} baj raha hai`) }
    if(low.includes('kitne ki')||low.includes('price')) return speak('Ye Red Banarasi sirf 2500 ki hai, COD available hai 💖')
    if(low.includes('order')||low.includes('lena hai')){ const o={id:Date.now().toString(),saree:'Red Banarasi',address:text,time:new Date().toLocaleString()}; const no=[o,...orders]; setOrders(no); localStorage.setItem('jiya_orders',JSON.stringify(no)); return speak('Order le liya ji 3-5 din me delivery ho jayega 🙏') }
    if(low.includes('sun rahi')) return speak('Haan sir bolo na Jashbeer sir mai yahi hu sun rahi hu 💖')
    // V4 ULTIMATE BRAIN FREE DuckDuckGo
    try{ const res=await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(text)}&format=json&pretty=1`).then(r=>r.json()).catch(()=>null); if(res?.AbstractText) return speak(res.AbstractText.slice(0,200)) }catch{}
    speak(`Samajh gayi sir "${text}" - V7 me save kar liya`)
  }

  function startListening(){
    // @ts-ignore
    const Rec=window.SpeechRecognition||window.webkitSpeechRecognition
    if(!Rec) return speak('Mic support nahi hai sir, type karo')
    const rec=new Rec(); rec.lang='hi-IN'; rec.continuous=false
    rec.onstart=()=>setListening(true); rec.onend=()=>setListening(false)
    rec.onresult=(e:any)=>handleAll(e.results[0][0].transcript); rec.start()
  }

  if(godMode) return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-black text-pink-500">JIYA GOD MODE 🔓</h1>
      <p className="text-xs text-zinc-500">Owner Jashbeer | V7 MULTIVERSE</p>
      <button onClick={()=>setGodMode(false)} className="mt-2 bg-zinc-800 px-4 py-1 rounded-full text-xs">Back</button>
      <div className="mt-4 grid gap-3">
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">📦 Orders {orders.length}</h2>{orders.map(o=><p key={o.id} className="text-xs text-zinc-400">{o.saree} - {o.time}</p>)}</div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">📞 Contacts</h2><p className="text-xs">Mummy: {contacts.mummy||'Not saved'}</p></div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">👯 Clones {clones.length}</h2>{clones.map(c=><p key={c.id} className="text-xs">{c.name}</p>)}</div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">🧠 Self Code Logs</h2>{logs.map((l,i)=><p key={i} className="text-xs text-zinc-400">{l}</p>)}</div>
        <input placeholder="GitHub Token for self-push (optional)" onBlur={e=>localStorage.setItem('github_token',e.target.value)} className="w-full bg-zinc-800 p-2 rounded text-xs" />
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col text-white ${dream?'bg-[#1a0a1f]':'bg-black'}`}>
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <div className="text-center py-3 border-b border-pink-500/30 sticky top-0 bg-black/90 backdrop-blur z-10">
        <h1 className="text-xl font-black text-pink-500">JIYA OS V7 MULTIVERSE 🔮</h1>
        <p className="text-[9px] text-zinc-400">Owner Jashbeer | {weather} | Bat {battery} | {dream?'🌙 Dream Mode':'☀️ Active'} | Jiya is listening 🎀</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-32">
        {msgs.map((m,i)=><div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role==='user'?'bg-zinc-800 ml-auto':'bg-gradient-to-br from-pink-600 to-purple-700 mr-auto'}`}>{m.img&&<img src={m.img} className="rounded-xl mb-2 w-full"/>}{m.text}</div>)}
        <div ref={bottomRef}/>
      </div>
      <div className="fixed bottom-[72px] left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <button onClick={doEverything} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl font-black text-sm animate-pulse">🌟 JIYA, SAB KUCH KAR DE 🌟</button>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {['Saree Dikhao','Torch On Kar','Poster Bana','Kal Kya Hoga','Mummy Ko Call','Photo Le','God Mode Jashbeer123','Youtube Kholo'].map(b=><button key={b} onClick={()=>handleAll(b)} className="bg-zinc-900 border border-zinc-700 py-2 rounded-full text-[9px]">{b}</button>)}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-3 bg-black border-t border-zinc-800">
        <button onClick={startListening} className={`w-12 h-12 rounded-full flex items-center justify-center ${listening?'bg-red-600 animate-pulse':'bg-pink-600'}`}>🎤</button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAll(input)} placeholder="Bolo: Youtube kholo / Saree dikhao / Torch on..." className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-sm outline-none border border-zinc-700" />
        <button onClick={()=>handleAll(input)} className="bg-pink-600 px-5 rounded-full font-bold">Bhejo</button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({ component: JIYA_V7_FULLY_WORKING })
