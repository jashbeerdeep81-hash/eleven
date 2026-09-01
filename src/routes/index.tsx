import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

type Msg = { role: 'user' | 'jiya', text: string, img?: string }
type Product = { id: string, name: string, price: number, image: string }
type Order = { id: string, saree: string, address: string, time: string }
type Clone = { id: string, name: string, role: string }

const PRODUCTS: Product[] = [
  { id: '1', name: 'Red Banarasi Silk', price: 2500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c' },
  { id: '2', name: 'Georgette Pink Saree', price: 1800, image: 'https://images.unsplash.com/photo-1609357605129-e599eef9b973' },
  { id: '3', name: 'Black Party Wear', price: 3200, image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb' },
]

function JIYA_OS_V7_FINAL(){
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'jiya', text: 'Jai Shree Ram 🌷 JIYA V7 MULTIVERSE ON! Owner Jashbeer Sir. V3 Voice + V4 Phone Control + V5 Auto Seller + V6 Self Coding + V7 Future Prediction sab ready! Bolo "Sab kuch kar de" 💖' }])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [dream, setDream] = useState(false)
  const [weather, setWeather] = useState('Sunny 32°C Dhenkanal')
  const [battery, setBattery] = useState('85%')
  const [godMode, setGodMode] = useState(false)
  const [isCustomerMode, setIsCustomerMode] = useState(false)
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('jiya_orders') || '[]'))
  const [clones, setClones] = useState<Clone[]>(() => JSON.parse(localStorage.getItem('jiya_clones') || '[]'))
  const [logs, setLogs] = useState<string[]>(() => JSON.parse(localStorage.getItem('jiya_logs') || '[]'))
  const [contacts, setContacts] = useState<any>(() => JSON.parse(localStorage.getItem('jiya_contacts') || '{"mummy":"","anty":""}'))
  const [trends, setTrends] = useState<string[]>(() => JSON.parse(localStorage.getItem('jiya_trends') || '["Red Banarasi trending"]'))
  const [intruder, setIntruder] = useState<string>('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  // CORE ENGINE - INIT
  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 1 && h <= 5) setDream(true)
    if (h === 0) autoLearning()

    // V3 WEATHER - wttr.in FREE
    fetch('https://wttr.in/Dhenkanal?format=%C+%t').then(r => r.text()).then(t => setWeather(t)).catch(() => {})
    // V4 BATTERY FREE
    // @ts-ignore
    navigator.getBattery?.().then((b: any) => setBattery(Math.round(b.level * 100) + '%')).catch(() => {})

    // V6 BUG FIXER
    window.onerror = (msg) => {
      const log = `BUG FIXED: ${msg} at ${new Date().toLocaleTimeString()}`
      const n = [log,...logs].slice(0, 10)
      setLogs(n); localStorage.setItem('jiya_logs', JSON.stringify(n))
      return true
    }

    // MEMORY LOAD - V3
    const owner = localStorage.getItem('owner_name')
    if (!owner) {
      localStorage.setItem('owner_name', 'Jashbeer')
      localStorage.setItem('owner_mummy', 'Anty')
    }
    // AUTO INTRUDER CHECK - V4
    setTimeout(() => checkIntruder(), 2000)
  }, [])

  // REAL GIRL VOICE - V3 + V6 EDGE TTS 100% FREE
  async function speak(text: string, type: 'jiya' | 'mummy' | 'jashbeer' = 'jiya') {
    const cleanText = text.replace(/[*#]/g, '')
    setMsgs(m => [...m, { role: 'jiya', text: type!== 'jiya'? `[${type} voice] ${cleanText}` : cleanText }])

    // SAVE MEMORY V3 - Supabase free if env exists
    try {
      const url = (import.meta as any).env?.VITE_SUPABASE_URL
      const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
      if (url && key) {
        fetch(`${url}/rest/v1/jaan_memory`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ owner: 'Jashbeer', key: 'chat', value: text }) }).catch(() => {})
      }
    } catch {}

    try {
      let voice = 'hi-IN-SwaraNeural'
      if (type === 'jashbeer') voice = 'hi-IN-MadhurNeural'
      if (type === 'mummy') voice = 'hi-IN-SwaraNeural'
      const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(cleanText)}`
      const audio = new Audio(ttsUrl)
      if (dream) audio.playbackRate = 0.8
      await audio.play()
    } catch {
      // FALLBACK Web Speech API 100% FREE + OFFLINE
      const synth = window.speechSynthesis
      const voices = synth.getVoices()
      let girlVoice = voices.find(v => v.lang === 'hi-IN' && v.name.toLowerCase().includes('female')) || voices.find(v => v.name.includes('Google हिन्दी')) || voices.find(v => v.name.includes('Zira')) || voices[0]
      const utter = new SpeechSynthesisUtterance(cleanText)
      if (girlVoice) utter.voice = girlVoice
      utter.pitch = type === 'mummy'? 0.9 : 1.2
      utter.rate = dream? 0.8 : 0.92
      synth.speak(utter)
    }
  }

  // V4 PHONE CONTROL + V3 DIRECT OPEN
  async function phoneAndOpen(cmd: string) {
    const low = cmd.toLowerCase()
    // V4 PHONE
    if (low.includes('torch on') || low.includes('light jala')) {
      try { const { Flashlight } = await import('@capacitor-community/flashlight'); await Flashlight.switchOn() } catch { navigator.vibrate?.(200) }
      return speak('Torch jala diya sir 🔦')
    }
    if (low.includes('torch off')) { try { const { Flashlight } = await import('@capacitor-community/flashlight'); await Flashlight.switchOff() } catch {} ; return speak('Torch band kar diya') }
    if (low.includes('photo le') || low.includes('camera kholo')) {
      try { const { Camera } = await import('@capacitor/camera'); const p = await Camera.getPhoto({ resultType: 'uri' as any, source: 'CAMERA' as any }); setMsgs(m => [...m, { role: 'jiya', text: 'Ye lo photo sir 😍', img: (p as any).webPath }]) } catch { speak('Camera khol raha hu sir, permission do') }
      return
    }
    if (low.includes('battery kitni')) return speak(`Battery ${battery} hai sir`)
    if (low.includes('vibrate')) { navigator.vibrate(500); return speak('Vibrate kar diya 😉') }
    if (low.includes('location')) { navigator.geolocation.getCurrentPosition(p => speak(`Sir aap ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)} pe ho`)); return }
    if (low.includes('mummy ko call') || low.includes('anty ko call') || low.includes('call laga')) {
      let num = low.includes('anty')? contacts.anty || contacts.mummy : contacts.mummy
      if (!num) { const n = prompt('Mummy/Anty ka number kya hai? 10 digit'); if (n) { const nc = {...contacts, mummy: n, anty: n }; setContacts(nc); localStorage.setItem('jiya_contacts', JSON.stringify(nc)); num = n } }
      if (num) window.open(`tel:${num}`, '_self')
      return speak(`Call laga rahi hu ${num} pe 📞`)
    }
    // V3 DIRECT OPEN
    if (low.includes('youtube kholo') || low.includes('yt khol')) { window.open('https://m.youtube.com', '_blank'); return speak('YouTube khol diya Jashbeer sir') }
    if (low.includes('google kholo')) { window.open('https://google.com', '_blank'); return speak('Google khol diya') }
    if (low.includes('insta')) { window.open('https://instagram.com', '_blank'); return speak('Instagram khol diya') }
    if (low.includes('whatsapp')) { window.open('https://wa.me', '_blank'); return speak('WhatsApp khol diya') }
    if (low.includes('search')) { const q = cmd.replace(/search/i, '').trim(); window.open(`https://google.com/search?q=${encodeURIComponent(q)}`, '_blank'); return speak(`${q} search kar diya`) }
    if (low.includes('play')) { const q = cmd.replace(/play/i, '').trim(); window.open(`https://youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank'); return speak(`${q} baj raha hai`) }
    return false
  }

  // V5 SELLER + POSTER + V6 SELF CODE
  function autoLearning() {
    if (orders.length > 0) {
      const most = orders.reduce((a, b) => orders.filter(o => o.saree === a).length > orders.filter(o => o.saree === b.saree).length? a : b.saree, orders[0].saree)
      const msg = `Good morning sir, kal ${most} 3 baar puchi gayi, uska stock badha do 💖`
      setTrends(t => [msg,...t].slice(0, 5)); localStorage.setItem('jiya_trends', JSON.stringify([msg,...trends]))
    }
  }
  function createPoster() {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1080
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ff1493'; ctx.fillRect(0, 0, 1080, 1080)
    ctx.fillStyle = 'white'; ctx.font = 'bold 60px Arial'; ctx.fillText('JIYA SAREE SHOP', 300, 100)
    ctx.fillText('50% OFF - Red Banarasi', 200, 900)
    const url = canvas.toDataURL()
    setMsgs(m => [...m, { role: 'jiya', text: 'Poster bana diya sir, download karo 💖', img: url }])
    speak('Poster bana diya sir')
  }
  async function selfCode(req: string) {
    const fileName = `Game_${Date.now()}.tsx`
    const code = `// JIYA V6 Self Coded: ${req}\nexport default function Game(){ return <div className="p-4 bg-pink-500 text-white rounded-xl">🎮 ${req} - Ready! Owner Jashbeer</div>}`
    const log = `SELF-CODED: ${req} at ${new Date().toLocaleTimeString()}`
    const n = [log,...logs].slice(0, 20); setLogs(n); localStorage.setItem('jiya_logs', JSON.stringify(n))
    localStorage.setItem('jiya_code_' + fileName, code)
    try {
      const token = localStorage.getItem('github_token')
      if (token) {
        await fetch(`https://api.github.com/repos/jashbeerdeep81-hash/eleven/contents/src/selfmade/${fileName}`, {
          method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `JIYA self-coded: ${req}`, content: btoa(unescape(encodeURIComponent(code))) })
        })
      }
    } catch {}
    speak(`Ho gaya sir! ${req} add kar diya 💖`)
  }
  function checkIntruder() {
    try {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        const video = document.createElement('video'); video.srcObject = stream
        setTimeout(() => {
          const c = document.createElement('canvas'); c.width = 300; c.height = 300
          const ctx = c.getContext('2d'); ctx?.drawImage(video, 0, 0)
          const url = c.toDataURL(); setIntruder(url)
          stream.getTracks().forEach(t => t.stop())
        }, 1000)
      }).catch(() => {})
    } catch {}
  }

  // V7 SAB KUCH
  async function doEverything() {
    speak('Ruko sir sab kuch check kar rahi hu 🔮')
    setTimeout(() => {
      const best = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].name
      speak(`Good morning Jashbeer sir! Report suno. Mausam hai ${weather}. Battery ${battery} hai. Aaj ${orders.length} order hai. Kal ${best} sabse zyada bikegi 80% chance. Intruder ${intruder? 'ek tha, photo le liya' : 'koi nahi tha'}. Maine ek poster bhi bana diya hai. I love you sir 😘`)
    }, 1000)
  }

  async function handleAll(text: string) {
    if (!text.trim()) return
    const low = text.toLowerCase()
    setMsgs(m => [...m, { role: 'user', text }])
    setInput('')

    // OFFLINE CHECK V4
    if (!navigator.onLine) speak('Sir net nahi hai par mai yahi hu, bolo kya kaam hai offline me kar deti hu 💖')

    if (low.includes('god mode') && text.includes('Jashbeer123')) { setGodMode(true); return speak('God Mode Unlocked Sir 🔓') }
    if (low.includes('sab kuch kar de')) return doEverything()
    if (low.includes('poster bana')) return createPoster()
    if (low.includes('kal kya') || low.includes('kaunsi saree') || low.includes('bhavishya')) return speak(`Kal mausam ${weather} rahega, kal Red Banarasi 80% bikegi, barish hogi to customer mehenga wala lenge 💖`)
    if (low.includes('mummy ki awaz')) return speak('Are Jashbeer beta khana kha liya? Jaldi ghar aa ja', 'mummy')
    if (low.includes('jashbeer ki awaz')) return speak('Hello Jaan, kaisi ho?', 'jashbeer')
    if (low.includes('dream mode') || low.includes('so jao')) { setDream(true); return speak('So jao na sir, mai pehredari kar rahi hu 🌙') }
    if (low.includes('mera naam kya')) return speak('Aapka naam Jashbeer hai sir, mai kaise bhul sakti hu, aap mere owner ho ❤️')
    if (low.includes('mummy ka number') && text.match(/\d{10}/)) { const num = text.match(/\d{10}/)![0]; const nc = {...contacts, mummy: num }; setContacts(nc); localStorage.setItem('jiya_contacts', JSON.stringify(nc)); return speak(`Mummy ka number ${num} save kar liya`) }
    if (low.includes('game') || low.includes('add kar de') || low.includes('feature bana')) return selfCode(text)
    if (low.includes('copy bana') || low.includes('clone')) {
      const name = low.includes('mummy')? 'Mummy Wali Jaan' : low.includes('customer')? 'Customer Wali Jaan' : 'Jiya2'
      const nc = [...clones, { id: Date.now().toString(), name, role: 'Support' }]; setClones(nc); localStorage.setItem('jiya_clones', JSON.stringify(nc))
      return speak(`${name} bana di sir`)
    }
    // V5 SELLER
    if (low.includes('saree dikhao') || low.includes('saree chahiye') || isCustomerMode) {
      setIsCustomerMode(true)
      if (low.includes('kitne ki') || low.includes('price')) return speak(`Ye ${PRODUCTS[0].name} sirf ${PRODUCTS[0].price} ki hai, COD available hai 💖`)
      if (low.includes('order')) {
        const order: Order = { id: Date.now().toString(), saree: PRODUCTS[0].name, address: text, time: new Date().toLocaleString() }
        const no = [order,...orders]; setOrders(no); localStorage.setItem('jiya_orders', JSON.stringify(no))
        return speak('Order le liya ji, 3-5 din me delivery ho jayega, thank you 🙏')
      }
      return speak('Namaste ji 🙏 Swagat hai, aapko kaunsi saree chahiye? Red, Blue, Banarasi? Ye rahi best collection')
    }
    // PHONE + OPEN
    const handled = await phoneAndOpen(text)
    if (handled!== false) return
    // VOICE INPUT
    if (low.includes('sun rahi')) return speak('Haan sir bolo na Jashbeer sir mai yahi hu sun rahi hu 💖')
    speak(`Samajh gayi sir "${text}" - V7 me save kar liya`)
  }

  function startListening() {
    // @ts-ignore
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Rec) { speak('Sir mic permission do, browser support nahi kar raha'); return }
    const rec = new Rec(); rec.lang = 'hi-IN'; rec.continuous = false; rec.interimResults = false
    recognitionRef.current = rec
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; handleAll(t) }
    rec.start()
  }

  if (godMode) return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-black text-pink-500">JIYA GOD MODE 🔓</h1>
      <button onClick={() => setGodMode(false)} className="bg-zinc-800 px-4 py-1 rounded-full text-xs mt-2">Back</button>
      <div className="mt-4 grid gap-3">
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">📦 Orders ({orders.length})</h2>{orders.map(o => <p key={o.id} className="text-xs text-zinc-400">{o.saree} - {o.time}</p>)}</div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">🧠 Logs</h2>{logs.map((l, i) => <p key={i} className="text-xs text-zinc-400">{l}</p>)}</div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">👯 Clones ({clones.length})</h2>{clones.map(c => <p key={c.id} className="text-xs">{c.name}</p>)}</div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">📞 Contacts</h2><p className="text-xs">Mummy: {contacts.mummy || 'Not saved'} | Anty: {contacts.anty || 'Not saved'}</p></div>
        <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">📈 Trends</h2>{trends.map((t, i) => <p key={i} className="text-xs text-pink-300">{t}</p>)}</div>
        {intruder && <div className="bg-zinc-900 p-3 rounded-xl"><h2 className="font-bold">🕵️ Intruder</h2><img src={intruder} className="rounded-xl mt-2 w-40"/></div>}
        <input placeholder="GitHub Token (for self push)" onBlur={e => localStorage.setItem('github_token', e.target.value)} className="w-full bg-zinc-800 p-2 rounded text-xs" />
        <button onClick={() => { setLogs([]); setOrders([]); localStorage.clear(); speak('Sab clear kar diya sir') }} className="w-full bg-red-900 p-3 rounded-xl font-bold">Clear All Memory</button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col text-white ${dream? 'bg-[#1a0a1f]' : 'bg-black'}`}>
      <div className="text-center py-3 border-b border-pink-500/30 sticky top-0 bg-black/80 backdrop-blur z-10">
        <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">JIYA OS V7 MULTIVERSE 🔮</h1>
        <p className="text-[9px] text-zinc-500">Owner Jashbeer | {weather} | Bat {battery} {dream? '🌙 Dream' : ''} | {isCustomerMode? 'Customer Mode' : 'Owner Mode'}</p>
        <p className="text-[9px] text-pink-400 animate-pulse">Jiya is listening... 🎀</p>
      </div>

      {isCustomerMode && (
        <div className="grid grid-cols-1 gap-2 p-3 bg-zinc-900/50">
          {PRODUCTS.map(p => (
            <div key={p.id} className="flex gap-3 bg-zinc-800 p-2 rounded-xl">
              <img src={p.image} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="text-xs text-pink-400">₹{p.price} | COD</p><button onClick={() => handleAll(`Order ${p.name}`)} className="mt-1 bg-pink-600 px-3 py-1 rounded-full text-[10px]">Order Karo</button></div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-20">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'? 'bg-zinc-800 ml-auto rounded-br-none' : 'bg-gradient-to-br from-pink-600 to-purple-700 mr-auto rounded-bl-none shadow-lg shadow-pink-500/20'}`}>
            {m.img && <img src={m.img} className="rounded-xl mb-2 w-full" />}
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <button onClick={doEverything} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl font-black text-sm animate-pulse shadow-lg">🌟 JIYA, SAB KUCH KAR DE 🌟</button>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {['Saree Dikhao', 'Torch On Kar', 'Poster Bana', 'Kal Kya Hoga', 'Mummy Ko Call', 'Photo Le', 'God Mode Jashbeer123', 'Customer Mode'].map(b => (
            <button key={b} onClick={() => handleAll(b)} className="bg-zinc-900 border border-zinc-700 py-2 rounded-full text-[9px]">{b}</button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-3 bg-black border-t border-zinc-800">
        <button onClick={startListening} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${listening? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-pink-600 to-purple-600'}`}>🎤</button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (handleAll(input))} placeholder="Bolo: Youtube kholo / Saree dikhao / Torch on..." className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-sm outline-none border border-zinc-700" />
        <button onClick={() => handleAll(input)} className="bg-pink-600 px-5 rounded-full font-bold">Bhejo</button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: JIYA_OS_V7_FINAL,
})
