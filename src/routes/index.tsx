import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

function JIYA() {
  const [msgs, setMsgs] = useState([{ role: 'jiya' as const, text: 'Hi Jashbeer! Main JIYA V7 hoon 🔮 Bol, kya karna hai?' }])
  const [input, setInput] = useState('')
  const [alwaysOn, setAlwaysOn] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [showCam, setShowCam] = useState(false)
  const recRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const alwaysRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { alwaysRef.current = alwaysOn }, [alwaysOn])

  useEffect(() => {
    const timer = setTimeout(() => speak('Hi Jashbeer! Jiya V7 Multiverse ready hai. Mic on karo, main hamesha sunungi.'), 800)
    return () => clearTimeout(timer)
  }, [])

  const speak = (t: string) => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(t)
    u.lang = 'en-IN'
    u.rate = 1
    u.pitch = 1.1
    speechSynthesis.speak(u)
  }

  const addMsg = (role: 'user' | 'jiya', text: string) => {
    setMsgs(m => [...m, { role, text }])
  }

  const handleCommand = async (cmd: string) => {
    const c = cmd.toLowerCase()
    if (c.includes('torch on') || c.includes('flash on') || c.includes('light on')) {
      await toggleTorch(true); addMsg('jiya', 'Torch ON kar diya Jashbeer 🔦'); speak('Torch on kar diya'); return true
    }
    if (c.includes('torch off') || c.includes('light off')) {
      await toggleTorch(false); addMsg('jiya', 'Torch OFF'); speak('Torch off'); return true
    }
    if (c.includes('camera khol') || c.includes('camera on')) {
      openCamera(); addMsg('jiya', 'Camera khol diya 📸'); speak('Camera khol diya'); return true
    }
    if (c.includes('camera band') || c.includes('camera off')) {
      closeCamera(); addMsg('jiya', 'Camera band'); speak('Camera band'); return true
    }
    if (c.includes('poster bana')) {
      makePoster(); addMsg('jiya', 'Poster bana diya! 🎨'); speak('Poster bana diya'); return true
    }
    if (c.includes('saree dikhao')) {
      addMsg('jiya', 'Ye lo Jashbeer, saree collection 👗 - Pink, Red, Black saree ready hai!'); speak('Saree dikha rahi hoon'); return true
    }
    return false
  }

  const toggleTorch = async (on: boolean) => {
    try {
      if (!streamRef.current) {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } as any })
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
      }
      const track = streamRef.current.getVideoTracks()[0]
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: on }] })
      setTorchOn(on)
    } catch (e) { alert('Torch support nahi hai is phone me') }
  }

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = s
      setShowCam(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s }, 100)
    } catch { alert('Camera permission do') }
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setShowCam(false); setTorchOn(false)
  }

  const makePoster = () => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#ff5fcf'; ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 80px sans-serif'; ctx.fillText('JIYA V7', 380, 900)
    ctx.font = '40px sans-serif'; ctx.fillText('Owner: Jashbeer', 380, 1000)
    const a = document.createElement('a'); a.download = 'jiya-poster.png'; a.href = c.toDataURL(); a.click()
  }

  const startAlways = () => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return alert('Mic support nahi hai')
    const rec = new SR()
    rec.lang = 'en-IN'; rec.continuous = true; rec.interimResults = false
    rec.onresult = async (e: any) => {
      const txt = e.results[e.results.length - 1][0].transcript.trim()
      if (!txt) return
      addMsg('user', txt)
      const handled = await handleCommand(txt)
      if (!handled) { const reply = `Samajh gayi Jashbeer: ${txt}. Batao kya karu?`; addMsg('jiya', reply); speak(reply) }
      setInput('')
    }
    rec.onend = () => { if (alwaysRef.current) try { rec.start() } catch {} }
    rec.onerror = () => { if (alwaysRef.current) try { rec.start() } catch {} }
    recRef.current = rec; rec.start(); setAlwaysOn(true); alwaysRef.current = true
    addMsg('jiya', 'Always ON mic active hai, ab sunti rahungi 🎤')
  }

  const stopAlways = () => {
    alwaysRef.current = false; recRef.current?.stop(); setAlwaysOn(false)
    addMsg('jiya', 'Mic OFF kar diya')
  }

  const send = async () => {
    if (!input.trim()) return
    const txt = input; addMsg('user', txt); setInput('')
    const handled = await handleCommand(txt)
    if (!handled) { const reply = `JIYA V7: ${txt} Done ✨`; addMsg('jiya', reply); speak(reply) }
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', padding: 12 }}>
      <h1 style={{ textAlign: 'center', color: '#ff5fcf', margin: '12px 0 0' }}>JIYA OS V7 MULTIVERSE ✨</h1>
      <p style={{ textAlign: 'center', opacity: 0.6, fontSize: 12 }}>Battery 24% • Always Listening • Zero Bug</p>

      {showCam && <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 600, margin: '12px auto', display: 'block', borderRadius: 16, background: '#111' }} />}

      <div style={{ maxWidth: 600, margin: '16px auto', background: '#111', borderRadius: 16, padding: 12, height: '52vh', overflowY: 'auto', border: '1px solid #222' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user'? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: m.role === 'user'? '#ff5fcf' : '#222', padding: '8px 14px', borderRadius: 14, display: 'inline-block', maxWidth: '85%' }}>{m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={alwaysOn? stopAlways : startAlways} style={{ background: alwaysOn? 'red' : '#ff5fcf', border: 0, borderRadius: 24, padding: '12px 16px', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {alwaysOn? '🔴 OFF' : '🎤 ON'}
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Bolo Jashbeer..." style={{ flex: 1, borderRadius: 24, padding: '12px 16px', background: '#222', color: '#fff', border: 0, outline: 'none' }} />
        <button onClick={send} style={{ background: '#fff', color: '#000', border: 0, borderRadius: 24, padding: '12px 20px', fontWeight: 800 }}>Send</button>
      </div>

      <div style={{ maxWidth: 600, margin: '14px auto 0', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => handleCommand('saree dikhao')} style={{ background: '#222', color: '#fff', border: 0, borderRadius: 20, padding: '8px 14px' }}>Saree dikhao</button>
        <button onClick={makePoster} style={{ background: '#222', color: '#fff', border: 0, borderRadius: 20, padding: '8px 14px' }}>Poster bana</button>
        <button onClick={() => toggleTorch(!torchOn)} style={{ background: torchOn? '#ff5fcf' : '#222', color: '#fff', border: 0, borderRadius: 20, padding: '8px 14px' }}>{torchOn? 'Torch off' : 'Torch on'}</button>
        <button onClick={showCam? closeCamera : openCamera} style={{ background: '#222', color: '#fff', border: 0, borderRadius: 20, padding: '8px 14px' }}>{showCam? 'Camera band' : 'Camera Kholo'}</button>
        <button onClick={() => { const d = new Date(); addMsg('jiya', `Kal ${new Date(d.getTime()+86400000).toDateString()} hai Jashbeer`); speak('Kal ka date bata diya') }} style={{ background: '#222', color: '#fff', border: 0, borderRadius: 20, padding: '8px 14px' }}>Kal kya hai</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10, opacity: 0.5, fontSize: 11, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <span>🔋 Battery 25%</span><span>•</span><span style={{ color: alwaysOn? '#0f0' : '#888' }}>{alwaysOn? 'Active Listening' : 'Mic Off'}</span>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({ component: JIYA })
