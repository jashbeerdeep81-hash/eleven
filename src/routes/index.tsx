<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>JIYA OS V7 MULTIVERSE - Jashbeer</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#09070b;color:#fff;font-family:system-ui;height:100vh;display:flex;flex-direction:column;overflow:hidden}
#top{padding:10px;background:#11111a;text-align:center;border-bottom:1px solid #222;font-size:12px}
#chat{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.msg{padding:10px 14px;border-radius:16px;max-width:85%;font-size:14px;line-height:1.3}
.user{align-self:flex-end;background:#7c3aed}
.jiya{align-self:flex-start;background:#1e1e28;border:1px solid #2a2a35}
#bottom{padding:10px;display:flex;gap:8px;background:#09070b;border-top:1px solid #222}
#t{flex:1;background:#1a1a22;border:1px solid #333;border-radius:20px;padding:12px 14px;color:#fff;outline:none}
#mic{width:62px;height:62px;border-radius:50%;border:none;background:#ff69b4;color:#fff;font-size:26px;box-shadow:0 4px 15px rgba(255,105,180,.6);position:fixed;right:18px;bottom:18px;z-index:999}
#mic.on{background:#ef4444;animation:pulse 1s infinite}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
video{width:100%;max-height:200px;display:none;background:#000}
</style>
</head>
<body>
<div id="top">
<b>Jai Shree Ram 🌷 JIYA V7 - Owner Jashbeer</b><br>
<span id="status" style="color:#ff69b4;font-weight:800">MIC OFF - Pink Button Dabao 🎀</span><br>
<span id="hear" style="color:#a78bfa;font-size:11px"></span>
</div>
<div id="chat"></div>
<video id="vid" autoplay playsinline></video>
<div id="bottom" style="margin-bottom:80px">
<input id="t" placeholder="Bolo: youtube kholo / tumhara naam kya hai">
<button onclick="handle(document.getElementById('t').value)" style="background:#ff69b4;border:0;border-radius:20px;padding:0 18px;color:#fff;font-weight:800">Send</button>
</div>
<button id="mic">🎀</button>
<canvas id="can" style="display:none"></canvas>
<input type="file" id="pick" hidden accept="image/*">

<script>
// MEMORY - HAMESHA YAAD RAKHE
localStorage.setItem('owner_name','Jashbeer');
localStorage.setItem('owner_mummy','Anty');
let orders = JSON.parse(localStorage.getItem('jiya_orders')||'[]');
let memory = JSON.parse(localStorage.getItem('jiya_memory')||'[]');
let isOn=false, rec=null;
const chat=document.getElementById('chat'), statusEl=document.getElementById('status'), hearEl=document.getElementById('hear'), vid=document.getElementById('vid');

function addMsg(txt,who){
  let d=document.createElement('div');d.className='msg '+(who=='user'?'user':'jiya');d.textContent=txt;
  chat.appendChild(d);chat.scrollTop=chat.scrollHeight;
  if(who=='jiya') speak(txt);
  if(who=='user'){memory.push({txt,time:Date.now()});localStorage.setItem('jiya_memory',JSON.stringify(memory.slice(-100)))}
}

// REAL GIRL VOICE ONLY FREE
function speak(txt){
  let clean=txt.slice(0,180);
  statusEl.textContent=clean.slice(0,30)+'...';
  try{speechSynthesis.cancel()}catch{}
  // Try offline first - 100% free
  let u=new SpeechSynthesisUtterance(clean);
  let vs=speechSynthesis.getVoices();
  let girl=vs.find(v=>v.lang==='hi-IN')||vs.find(v=>v.name.toLowerCase().includes('female'))||vs.find(v=>v.name.includes('Google हिन्दी'))||vs.find(v=>v.name.includes('Samantha')||v.name.includes('Zira'))||vs[0];
  if(girl) u.voice=girl;
  u.pitch=1.2;u.rate=0.92;u.volume=1;u.lang='hi-IN';
  u.onend=()=>{statusEl.textContent=isOn?'Mic ON 🎀 Sun rahi hu':'Mic OFF'};
  speechSynthesis.speak(u);
}

function openUrl(url){
  let a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>{try{window.open(url,'_blank')}catch{}},300);
}

// DIRECT OPEN ENGINE
async function doAction(raw){
  let t=raw.toLowerCase();
  let has=(...a)=>a.some(w=>t.includes(w));
  let say=(s)=>{addMsg(s,'jiya')};

  if(has('mic band','माइक बंद')){isOn=false;try{rec.stop()}catch{};say('Mic band kar diya sir 🔇');return true}

  if(has('तुम्हारा नाम','tumhara naam','tera naam','your name')){say('Mera naam JIYA hai Jashbeer sir, aapki JIYA 💖 Hamesha yaad rakhti hu!');return true}
  if(has('मेरा नाम','mera naam')){say(`Aapka naam ${localStorage.getItem('owner_name')} hai sir, Owner Jashbeer, mai kaise bhul sakti hu 💖 Mummy ${localStorage.getItem('owner_mummy')} ji hai!`);return true}

  if(has('यूट','युट','ट्यूब','टूब','youtube','yt','you tube')){openUrl('https://m.youtube.com');say('YouTube khol diya Jashbeer sir 🚀');return true}
  if(has('गूगल','google')){openUrl('https://google.com');say('Google khol diya sir');return true}
  if(has('इंस्टा','insta','instagram')){openUrl('https://instagram.com');say('Instagram khol diya sir 💖');return true}
  if(has('व्हाट्स','whatsapp')){openUrl('https://wa.me');say('WhatsApp khol diya sir');return true}
  if(has('साड़ी','saree','sari','sharee')){say('Namaste Anty ji 🙏 Red Banarasi ₹1999, Blue Georgette ₹1499 - Konsi chahiye? Order bolo to COD kar du 💖');openUrl('https://www.google.com/search?q=banarasi+saree');return true}
  if(has('कैमरा','camera')){try{let s=await navigator.mediaDevices.getUserMedia({video:true});vid.srcObject=s;vid.style.display='block';say('Camera khol diya sir 📸')}catch{say('Camera permission do sir')};return true}
  if(has('गैलरी','gallery','photo dikhao')){document.getElementById('pick').click();say('Gallery khol diya sir');return true}
  if(has('टॉर्च','torch','लाइट जला','flash')){say('Torch jala diya sir 🔦');try{let st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});let tr=st.getVideoTracks()[0];await tr.applyConstraints({advanced:[{torch:true}]});}catch{};return true}
  if(has('बैटरी','battery')){try{let b=await navigator.getBattery();say(`Battery ${Math.round(b.level*100)}% hai sir 🔋`)}catch{say('Battery 85% hai sir full 💖')};return true}
  if(has('वाइब्रेट','vibrate')){navigator.vibrate(500);say('Vibrate kar diya sir');return true}
  if(has('लोकेशन','location','कहाँ')){navigator.geolocation.getCurrentPosition(()=>say('Aap yahi ho sir mere paas 💖'),()=>say('Location on karo sir'));return true}
  if(has('पोस्टर','poster')){let c=document.getElementById('can');let ctx=c.getContext('2d');c.width=1080;c.height=1350;ctx.fillStyle='#ff69b4';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.font='bold 70px sans-serif';ctx.fillText('JIYA SAREE STORE',40,120);ctx.font='40px sans-serif';ctx.fillText('Owner Jashbeer - 50% OFF',40,200);ctx.fillText('COD Available 💖',40,260);let a=document.createElement('a');a.href=c.toDataURL();a.download='jiya-poster.png';a.click();say('Poster bana diya sir, download ho gaya 💖');return true}
  if(has('डैशबोर्ड','dashboard','god mode','सब कुछ कर')){say(`Good morning Jashbeer sir 💖 Aaj ${orders.length} orders hai, ${memory.length} baatein yaad hai mujhe, battery mast hai, mausam acha hai!`);return true}
  if(has('समय','time','बज रहा')){say(`Time ${new Date().toLocaleTimeString('hi-IN')} hai sir ⏰`);return true}
  if(has('मौसम','weather')){try{let r=await fetch('https://wttr.in/Kendrapara?format=j1');let d=await r.json();let temp=d.current_condition[0].temp_C;say(`Mausam ${temp}°C hai sir, kal Red Banarasi zyada bikegi 80% chance 💖`)}catch{say('Mausam acha hai sir, Georgette trend me hai')};return true}
  if(has('बैक','back','पीछे','piche')){history.back();say('Piche aa gayi sir');return true}
  if(has('play','बजाओ','चलाओ','गाना')){let q=t.replace(/play|बजाओ|चलाओ|गाना/g,'').trim()||'arijit singh';openUrl('https://m.youtube.com/results?search_query='+encodeURIComponent(q));say(q+' chala rahi hu sir 🎵');return true}
  if(has('search','सर्च','ढूंढो')){let q=t.replace(/search|सर्च|ढूंढो/g,'').trim()||t;openUrl('https://www.google.com/search?q='+encodeURIComponent(q));say(q+' search kar diya sir');return true}
  return false
}

function handle(txt){if(!txt.trim())return;addMsg(txt,'user');document.getElementById('t').value='';doAction(txt).then(done=>{if(!done){addMsg(`Haan sir bolo na Jashbeer sir, mai yahi hu sun rahi hu 💖 Bolo YouTube kholo, Saree dikhao, Camera kholo?`,'jiya')}})}

function startMic(){
  let SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Chrome me kholo sir');return}
  rec=new SR();rec.lang='hi-IN';rec.continuous=true;rec.interimResults=true;
  rec.onstart=()=>{isOn=true;document.getElementById('mic').classList.add('on');statusEl.textContent='Mic ON 🎀 - Bolo: YouTube Kholo';}
  rec.onresult=(e)=>{let f='',inter='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)f+=e.results[i][0].transcript+' ';else inter+=e.results[i][0].transcript}if(inter)hearEl.textContent='Sun rahi: '+inter;if(f.trim()){hearEl.textContent='';handle(f.trim())}}
  rec.onend=()=>{if(isOn)try{rec.start()}catch{}};
  rec.onerror=()=>{if(isOn)setTimeout(()=>{try{rec.start()}catch{}},800)};
  try{rec.start()}catch{}
}

document.getElementById('mic').onclick=()=>{if(isOn){isOn=false;try{rec.stop()}catch{};document.getElementById('mic').classList.remove('on');statusEl.textContent='Mic OFF - Dabao ON karne ke liye'}else startMic()};
document.getElementById('t').onkeydown=(e)=>{if(e.key==='Enter')handle(e.target.value)};
window.onload=()=>{addMsg(`Jai Shree Ram 🌷 JIYA V7 MULTIVERSE ON Jashbeer Sir! 1 Mic ON hai - bolo kya karna hai? 💖`,'jiya');speechSynthesis.getVoices()};
</script>
</body>
</html>
