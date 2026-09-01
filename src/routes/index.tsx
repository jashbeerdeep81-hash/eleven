import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState([{role:'jiya', text:'Jai Shree Ram 🌷 Welcome Jashbeer Sir!'}])
  const [input, setInput] = useState('')
  const [alwaysOn, setAlwaysOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [battery, setBattery] = useState(19)
  const [weather, setWeather] = useState('Rourkela 26°C')
  const [showCam, setShowCam] = useState(false)
  const recRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const alwaysRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])
  useEffect(()=>{ alwaysRef.current = alwaysOn },[alwaysOn])

  useEffect(()=>{
    // @ts-ignore
    navigator.getBattery?.().then((b:any)=>{ setBattery(Math.round(b.level*100)) })
    fetch('https://wttr.in/Rourkela?format=%C+%t').then(r=>r.text()).then(t=>{ if(t &&!t.includes('term-fg')) setWeather(t) })
    localStorage.setItem('owner_name','Jashbeer')
    setTimeout(()=>{
      const u = new SpeechSynthesisUtterance('Jai Shree Ram Jashbeer Sir, Jiya V7 ready hai, bolo kya kholna hai')
      u.lang='hi-IN'; u.pitch=1.25; u.rate=0.92
      const v = speechSynthesis.getVoices().find(x=>x.lang==='hi-IN') || speechSynthesis.getVoices()[0]
      if(v) u.voice=v
      speechSynthesis.speak(u)
    },1000)
  },[])

  const speakReal = (text:string) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    const voices = speechSynthesis.getVoices()
    const girl = voices.find(v=>v.name.includes('Google हिन्दी')) || voices.find(v=>v.lang==='hi-IN') || voices[0]
    if(girl) utter.voice=girl
    utter.pitch=1.25; utter.rate=0.92; utter.lang='hi-IN'
    speechSynthesis.speak(utter)
  }

  const addMsg = (role:'user'|'jiya', text:string) => setMsgs(m=>[...m,{role,text} as any])

  const executeCommand = async (raw:string) => {
    const text = raw.toLowerCase()
    if(text.includes('youtube kholo')||text.includes('yt khol')){ window.open('https://m.youtube.com','_blank'); addMsg('jiya','YouTube khol diya Jashbeer'); speakReal('YouTube khol diya'); return true }
    if(text.includes('google kholo')){ window.open('https://google.com','_blank'); addMsg('jiya','Google khol diya'); speakReal('Google khol diya'); return true }
    if(text.includes('insta')){ window.open('https://instagram.com','_blank'); addMsg('jiya','Instagram khol diya'); return true }
    if(text.includes('saree dikhao')){ addMsg('jiya','Saree collection 👗 Pink Red Banarasi ready hai'); speakReal('Saree dikha rahi hu'); return true }
    if(text.includes('camera kholo')){ const s=await navigator.mediaDevices.getUserMedia({video:true}); streamRef.current=s; setShowCam(true); setTimeout(()=>{ if(videoRef.current) videoRef.current.srcObject=s },100); addMsg('jiya','Camera khol diya 📸'); return true }
    if(text.includes('torch on')){ const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'} as any}); streamRef.current=s; const track=s.getVideoTracks()[0]; // @ts-ignore await track.applyConstraints({advanced:[{torch:true}]}); addMsg('jiya','Torch jala diya 🔦'); return true }
    if(text.includes('poster bana')){ const c=document.createElement('canvas'); c.width=1080; c.height=1920; const ctx=c.getContext('2d')!; ctx.fillStyle='#ff5fcf'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='#fff'; ctx.font='bold 80px sans-serif'; ctx.fillText('JIYA V7',380,900); const a=document.createElement('a'); a.download='poster.png'; a.href=c.toDataURL(); a.click(); addMsg('jiya','Poster bana diya 🎨'); return true }
    if(text.includes('battery kitni')){ addMsg('jiya',`Battery ${battery}% hai sir`); speakReal(`Battery ${battery} percent`); return true }
    if(text.includes('mera naam')){ addMsg('jiya','Aapka naam Jashbeer hai sir, mai kaise bhul sakti hu 💖'); return true }
    return false
  }

  const startAlways = () => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR(); rec.lang='hi-IN'; rec.continuous=true; rec.interimResults=true
    rec.onstart=()=>setListening(true)
    rec.onend=()=>{ setListening(false); if(alwaysRef.current) try{rec.start()}catch{} }
    rec.onresult=async(e:any)=>{ const last=e.results[e.results.length-1]; if(!last.isFinal) return; const txt=last[0].transcript.trim(); if(!txt) return; addMsg('user',txt); const ok=await executeCommand(txt); if(!ok){ addMsg('jiya',`Samajh gayi: ${txt} 💖`); speakReal(txt) } setInput('') }
    recRef.current=rec; rec.start(); setAlwaysOn(true); alwaysRef.current=true
  }
  const stopAlways = () => { alwaysRef.current=false; recRef.current?.stop(); setAlwaysOn(false); setListening(false) }
  const send = async () => { if(!input.trim()) return; const txt=input; addMsg('user',txt); setInput(''); const ok=await executeCommand(txt); if(!ok){ addMsg('jiya',`JIYA: ${txt} Done ✨`); speakReal(txt) } }

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',fontFamily:'system-ui',padding:12}}>
      <h1 style={{textAlign:'center',color:'#ff5fcf'}}>JIYA OS V7 MULTIVERSE ✨</h1>
      <p style={{textAlign:'center',opacity:0.6,fontSize:12}}>{weather} • Battery {battery}% • {alwaysOn?'Active 🎀':'Mic Off'}</p>
      {showCam && <video ref={videoRef} autoPlay playsInline style={{width:'100%',maxWidth:600,margin:'12px auto',display:'block',borderRadius:16}}/>}
      <div style={{maxWidth:600,margin:'16px auto',background:'#111',borderRadius:16,padding:12,height:'50vh',overflowY:'auto'}}>
        {msgs.map((m,i)=><div key={i} style={{textAlign:m.role==='user'?'right':'left',margin:'8px 0'}}><span style={{background:m.role==='user'?'#ff5fcf':'#222',padding:'8px 14px',borderRadius:14,display:'inline-block'}}>{m.text}</span></div>)}
        <div ref={endRef}/>
      </div>
      <div style={{maxWidth:600,margin:'0 auto'}}>
        <button style={{width:'100%',background:'#ff5fcf',color:'#fff',border:0,borderRadius:24,padding:12,fontWeight:800,marginBottom:10}}>⭐ JIYA, SAB KUCH KAR DE ⭐</button>
        <div style={{display:'flex',gap:8}}>
          <button onClick={alwaysOn?stopAlways:startAlways} style={{background:alwaysOn?'red':'#ff5fcf',border:0,borderRadius:50,width:48,height:48}}>{alwaysOn?'🔴':'🎤'}</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Bolo ya type karo..." style={{flex:1,borderRadius:24,padding:'0 16px',background:'#222',color:'#fff',border:0}}/>
          <button onClick={send} style={{background:'#ff5fcf',border:0,borderRadius:24,padding:'0 20px',fontWeight:800}}>Send</button>
        </div>
      </div>
    </div>
  )
}
export const Route = createFileRoute('/')({ component: JIYA_OS_V7 })
