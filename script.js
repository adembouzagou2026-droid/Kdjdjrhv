(()=>{
const $=id=>document.getElementById(id),N=500,W=24,LAPS=3;
const COL=[0xff2b6a,0x00e5ff,0xffd400,0x7cff3a,0xb06bff,0xffffff];
const touch=matchMedia('(pointer:coarse)').matches;if(touch)document.body.classList.add('touch');
const angD=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const cv=$('g'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.75));
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x2e0f55,.0034);
const cam=new THREE.PerspectiveCamera(62,1,.5,1800);
function rs(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
scene.add(new THREE.HemisphereLight(0x9a8bff,0x1a1030,.95));
const sun=new THREE.DirectionalLight(0xffa6ff,.9);sun.position.set(60,120,40);scene.add(sun);
// sky
{const g=new THREE.SphereGeometry(1500,24,16),p=g.attributes.position,c=[],top=new THREE.Color(0x03030f),hz=new THREE.Color(0x4a1470),m=new THREE.Color();
for(let i=0;i<p.count;i++){const y=Math.max(0,p.getY(i)/1500);m.copy(hz).lerp(top,Math.pow(y,.5));c.push(m.r,m.g,m.b)}
g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));
scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false})));
const sp=[];for(let i=0;i<600;i++){const a=Math.random()*6.283,e=Math.random()*1.3+.1;sp.push(Math.cos(a)*Math.cos(e)*1400,Math.sin(e)*1400,Math.sin(a)*Math.cos(e)*1400)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
scene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:2.5,sizeAttenuation:false,fog:false,color:0xffffff})));
const mo=new THREE.Mesh(new THREE.SphereGeometry(70,24,16),new THREE.MeshBasicMaterial({color:0xffd9ff,fog:false}));mo.position.set(-600,420,-1000);scene.add(mo)}
// ground
{const g=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),new THREE.MeshBasicMaterial({color:0x090818}));g.rotation.x=-Math.PI/2;g.position.y=-.06;scene.add(g);
const gr=new THREE.GridHelper(4000,100,0xb030ff,0x3a1070);gr.position.y=-.04;scene.add(gr)}
// track
const K=14,cp=[];for(let i=0;i<K;i++){const a=i/K*6.2832,r=230+60*Math.sin(a*3+1)+45*Math.cos(a*2)+(i%2?25:-15);cp.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r))}
const curve=new THREE.CatmullRomCurve3(cp,true,'catmullrom',.5),P=curve.getSpacedPoints(N),T=[],segL=curve.getLength()/N;
for(let i=0;i<N;i++){const a=P[(i+1)%N],b=P[(i-1+N)%N],t=new THREE.Vector3(a.x-b.x,0,a.z-b.z).normalize();T.push(t)}
const curvF=T.map((t,i)=>{const u=T[(i+6)%N];return Math.min(.38,Math.abs(Math.atan2(t.x*u.z-t.z*u.x,t.x*u.x+t.z*u.z))*3.5)});
const RM=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
function ribbon(o1,o2,y1,y2,col){const pos=[],cl=[],ix=[];
 for(let i=0;i<=N;i++){const j=i%N,p=P[j],t=T[j],rx=-t.z,rz=t.x,c=col(i);
  pos.push(p.x+rx*o1,y1,p.z+rz*o1,p.x+rx*o2,y2,p.z+rz*o2);cl.push(c.r,c.g,c.b,c.r,c.g,c.b);
  if(i<N){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cl,3));g.setIndex(ix);scene.add(new THREE.Mesh(g,RM))}
const C=h=>new THREE.Color(h),r1=C(0x1b1b30),r2=C(0x232342),wh=C(0xffffff),rd=C(0xff2244);
ribbon(-W/2,W/2,0,0,i=>(i>>3)%2?r1:r2);
ribbon(-.35,.35,.03,.03,i=>i%10<5?C(0xffe680):r1);
for(const s of[-1,1]){const a=s*(W/2-1.4),b=s*(W/2-.7);ribbon(a,b,.03,.03,()=>wh);
 ribbon(s*W/2,s*(W/2+2.2),.02,.02,i=>(i/3|0)%2?wh:rd);
 ribbon(s*(W/2+2.4),s*(W/2+2.4),0,1.6,()=>s>0?C(0x00e5ff):C(0xff2bd6));
 ribbon(s*(W/2+2.4),s*(W/2+2.4),1.6,1.9,()=>wh)}
{const d=new THREE.Object3D(),pl=new THREE.InstancedMesh(new THREE.BoxGeometry(.5,10,.5),new THREE.MeshBasicMaterial({color:0x5a3cff}),50),hd=new THREE.InstancedMesh(new THREE.BoxGeometry(3.4,.5,1),new THREE.MeshBasicMaterial({color:0xfff2b0}),50);
 for(let k=0;k<50;k++){const i=k*10,s=k%2?1:-1,p=P[i],t=T[i],o=s*(W/2+6);d.position.set(p.x-t.z*o,5,p.z+t.x*o);d.rotation.y=Math.atan2(t.x,t.z);d.updateMatrix();pl.setMatrixAt(k,d.matrix);d.position.y=10;d.updateMatrix();hd.setMatrixAt(k,d.matrix)}
 scene.add(pl,hd)}
{const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xff2bd6}),c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
 for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#fff':'#111';x.fillRect(i*8,j*8,8,8)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,1);
 const l=new THREE.Mesh(new THREE.PlaneGeometry(W,3),new THREE.MeshBasicMaterial({map:t}));l.rotation.x=-Math.PI/2;l.position.y=.05;g.add(l);
 for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(1.2,13,1.2),m);p.position.set(s*(W/2+3),6.5,0);g.add(p)}
 const b=new THREE.Mesh(new THREE.BoxGeometry(W+7,1.6,1.4),new THREE.MeshBasicMaterial({color:0x00f0ff}));b.position.y=13;g.add(b);
 g.position.copy(P[0]);g.rotation.y=Math.atan2(T[0].x,T[0].z);scene.add(g)}
// city
{const c=document.createElement('canvas');c.width=64;c.height=128;const g=c.getContext('2d');g.fillStyle='#0b0b1e';g.fillRect(0,0,64,128);
 for(let y=4;y<124;y+=8)for(let x=4;x<60;x+=8)if(Math.random()<.45){g.fillStyle=['#ffd27a','#7ae7ff','#ff7ad9'][Math.random()*3|0];g.fillRect(x,y,4,5)}
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
 const ms=[0xffffff,0xbfd0ff,0xffd0f5].map(h=>new THREE.MeshBasicMaterial({map:tx,color:h}));
 for(let n=0,k=0;n<700&&k<260;n++){const a=Math.random()*6.283,r=40+Math.random()*700,x=Math.cos(a)*r,z=Math.sin(a)*r,w=14+Math.random()*22,h=12+Math.pow(Math.random(),2)*120;
  let ok=true;for(let i=0;i<N;i+=4){const dx=x-P[i].x,dz=z-P[i].z;if(dx*dx+dz*dz<(W/2+w+22)**2){ok=false;break}}if(!ok)continue;
  const bg=new THREE.BoxGeometry(w,h,w),uv=bg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/18,uv.getY(i)*h/20);
  const m=new THREE.Mesh(bg,ms[k%3]);m.position.set(x,h/2,z);scene.add(m);k++}}
// cars
function makeCar(col){const car=new THREE.Group(),b=new THREE.Group();car.add(b);car.userData.b=b;
 const M=(c,e)=>new THREE.MeshStandardMaterial({color:c,metalness:.45,roughness:.3,emissive:e||0}),B=c=>new THREE.MeshBasicMaterial({color:c});
 const bx=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);b.add(o)},body=M(col);
 bx(2.1,.55,4.4,0,.65,0,body);bx(1.7,.5,2.1,0,1.15,-.3,M(0x0a0f1e,0x112244));bx(2.3,.14,.8,0,1.5,-2,body);bx(.14,.5,.14,.8,1.25,-2,body);bx(.14,.5,.14,-.8,1.25,-2,body);
 for(const s of[-1,1]){bx(.5,.18,.1,s*.7,.7,2.2,B(0xffffff));bx(.6,.15,.1,s*.65,.78,-2.2,B(0xff1133))}
 const wg=new THREE.CylinderGeometry(.42,.42,.35,14);wg.rotateZ(Math.PI/2);const wm=M(0x111111);
 for(const x of[-1.1,1.1])for(const z of[-1.4,1.4]){const w=new THREE.Mesh(wg,wm);w.position.set(x,.42,z);car.add(w)}
 const ug=new THREE.Mesh(new THREE.PlaneGeometry(2.7,5.2),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.5,depthWrite:false}));ug.rotation.x=-Math.PI/2;ug.position.y=.08;car.add(ug);
 const fl=new THREE.Group(),cg=new THREE.ConeGeometry(.32,2.4,8);cg.rotateX(-Math.PI/2);
 for(const s of[-.5,.5]){const f=new THREE.Mesh(cg,B(0x55ddff));f.position.set(s,.7,-3.4);fl.add(f)}fl.visible=false;car.add(fl);car.userData.fl=fl;return car}
function label(t){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.font='bold 34px Tahoma';g.textAlign='center';g.fillStyle='#fff';g.shadowColor='#0ff';g.shadowBlur=8;g.fillText(t,128,44);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.scale.set(8,2,1);s.position.y=3.8;return s}
// state
let state='menu',t0=0,ci=1,shake=0,camH=0,fov=62,netN=0,total=0,lastSend=0;
const me={x:0,z:0,h:0,vx:0,vz:0,idx:N-20,lap:0,nitro:100,steer:0},inp={};
const names=['شبح','صقر','برق','نمر'],bots=[{b:52,c:0},{b:49,c:3},{b:55,c:4},{b:46,c:2}];
bots.forEach((o,k)=>{o.m=makeCar(COL[o.c]);o.m.add(label(names[k]));scene.add(o.m);o.v=0;o.total=0;o.lat=0});
const myCar=makeCar(COL[ci]);scene.add(myCar);
function slot(s){const i=N-8-Math.floor(s/2)*8,lat=s%2?5.5:-5.5,p=P[i],t=T[i];return{i,lat,x:p.x-t.z*lat,z:p.z+t.x*lat,h:Math.atan2(t.x,t.z)}}
{const g0=slot(2);me.x=g0.x;me.z=g0.z;me.h=g0.h}
function near(x,z,f){let b=1e9,bi=f;for(let k=-14;k<=14;k++){const j=(f+k+N)%N,dx=x-P[j].x,dz=z-P[j].z,d=dx*dx+dz*dz;if(d<b){b=d;bi=j}}return bi}
// audio
let au,osc,gn;function audio(){if(au)return;try{au=new(window.AudioContext||window.webkitAudioContext)();osc=au.createOscillator();osc.type='sawtooth';const f=au.createBiquadFilter();f.type='lowpass';f.frequency.value=650;gn=au.createGain();gn.gain.value=0;osc.connect(f);f.connect(gn);gn.connect(au.destination);osc.start()}catch(e){au=null}}
function beep(fr,d){if(!au)return;try{const o=au.createOscillator(),g=au.createGain();o.frequency.value=fr;g.gain.value=.12;g.gain.exponentialRampToValueAtTime(.001,au.currentTime+(d||.25));o.connect(g);g.connect(au.destination);o.start();o.stop(au.currentTime+(d||.25))}catch(e){}}
// input
const km={ArrowUp:'g',w:'g',ArrowDown:'b',s:'b',ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r',' ':'h',Shift:'n'};
addEventListener('keydown',e=>{const k=km[e.key.length>1?e.key:e.key.toLowerCase()];if(k){inp[k]=1;e.preventDefault()}});
addEventListener('keyup',e=>{const k=km[e.key.length>1?e.key:e.key.toLowerCase()];if(k)inp[k]=0});
document.querySelectorAll('.bt').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{inp[k]=1;e.preventDefault()});for(const ev of['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,()=>inp[k]=0)});
// menu
const sw=$('sw');COL.forEach((c,i)=>{const e=document.createElement('i');e.style.background=e.style.color='#'+c.toString(16).padStart(6,'0');if(i===ci)e.className='on';e.onclick=()=>{ci=i;[...sw.children].forEach((x,j)=>x.className=j===i?'on':'');myCar.userData.b.children[0].material.color.setHex(COL[i])};sw.appendChild(e)});
$('nm').value='لاعب'+(100+Math.random()*899|0);
let best=0;try{best=+localStorage.getItem('nr_best')||0}catch(e){}
const cd=t=>$('cd').textContent=t;
function startRace(){audio();const g=slot(2);Object.assign(me,{x:g.x,z:g.z,h:g.h,vx:0,vz:0,idx:g.i,lap:0,nitro:100,steer:0});
 bots.forEach((o,k)=>{const s=slot([0,1,3,4][k]);o.total=s.i;o.lat=s.lat;o.v=0;o.slow=0});
 state='count';$('end').style.display='none';$('menu').style.display='none';let n=3;
 const tick=()=>{if(n>0){cd(n);beep(440);n--;setTimeout(tick,900)}else{cd('انطلق!');beep(880,.4);state='race';t0=performance.now();setTimeout(()=>cd(''),800)}};tick()}
$('go').onclick=startRace;$('again').onclick=startRace;
function rankNow(){let r=1;for(const o of bots)if(o.total>total)r++;for(const o of peers.values())if((o.t||0)>total)r++;return r}
function finish(){state='done';const tm=(performance.now()-t0)/1000;let r=1;for(const o of bots)if(o.total>=(LAPS+1)*N)r++;for(const o of peers.values())if((o.t||0)>=(LAPS+1)*N)r++;
 const nb=best===0||tm<best;if(nb){best=tm;try{localStorage.setItem('nr_best',tm)}catch(e){}}
 $('er').textContent=r===1?'🏆 المركز الأول! أسطورة':'🏁 المركز '+r;$('et').textContent='زمنك: '+tm.toFixed(2)+' ثانية'+(nb?' · رقم قياسي جديد! ⭐':' · أفضل زمن: '+best.toFixed(2));
 setTimeout(()=>$('end').style.display='flex',1500)}
// online (PeerJS: اتصال مباشر بين المتصفحات)
const peers=new Map();let pr=null,conns=[],hostConn=null,isHost=true,myCode='';
const clearPeers=()=>{for(const o of peers.values())scene.remove(o.m);peers.clear()};
const gen=()=>Math.random().toString(36).slice(2,7).replace(/[^a-z0-9]/g,'x');
const NS=(t,c)=>{const e=$('ns');e.textContent=t;e.style.color=c||'#7fffb0'};
function setPeer(id,d){if(!d||!Number.isFinite(d.x)||!Number.isFinite(d.z))return;let o=peers.get(id);
 if(!o){const m=makeCar(COL[Math.abs(d.c|0)%6]);m.add(label(String(d.n||'لاعب').slice(0,12)));m.position.set(d.x,0,d.z);scene.add(m);o={m};peers.set(id,o)}
 o.x=d.x;o.z=d.z;o.h=Number.isFinite(d.h)?d.h:0;o.t=Number.isFinite(d.t)?d.t:0;o.seen=performance.now();
 o.raw={x:o.x,z:o.z,h:o.h,c:Math.abs(d.c|0)%6,n:String(d.n||'لاعب').slice(0,12),t:o.t}}
function dropPeer(id){const o=peers.get(id);if(o){scene.remove(o.m);peers.delete(id)}}
function stop(){try{pr&&pr.destroy()}catch(e){}pr=null;conns=[];hostConn=null;clearPeers()}
function host(code){if(!window.Peer){NS('❌ مكتبة الاتصال ما اتحمّلتش','#ff8a8a');return}
 stop();isHost=true;myCode=code;$('rc').textContent=code.toUpperCase();NS('⏳ جاري إنشاء الغرفة…');
 const me=pr=new Peer('neonrush-'+code);
 me.on('open',()=>NS('✅ غرفتك جاهزة · ابعت الكود لأصحابك'));
 me.on('connection',c=>{c.on('open',()=>{conns.push(c);NS('✅ '+(conns.length+1)+' لاعبين في الغرفة')});
  c.on('data',d=>{if(d&&d.s)setPeer(c.peer,d.s)});
  c.on('close',()=>{conns=conns.filter(x=>x!==c);dropPeer(c.peer);NS('✅ '+(conns.length+1)+' لاعبين في الغرفة')});c.on('error',()=>{})});
 me.on('error',e=>{if(pr!==me)return;if(e.type==='unavailable-id')host(gen());else NS('❌ مشكلة اتصال: '+e.type,'#ff8a8a')})}
function join(code){code=String(code).toLowerCase().trim();if(!/^[a-z0-9]{3,12}$/.test(code)){NS('❌ كود غير صالح','#ff8a8a');return}
 if(!window.Peer)return;stop();isHost=false;NS('⏳ جاري الدخول…');let ok=false;const me=pr=new Peer();
 const fail=t=>{if(pr!==me||ok)return;NS(t,'#ff8a8a');setTimeout(()=>host(gen()),1800)};
 me.on('open',()=>{const c=hostConn=me.connect('neonrush-'+code,{reliable:true});
  c.on('open',()=>{ok=true;myCode=code;$('rc').textContent=code.toUpperCase();NS('✅ دخلت الغرفة')});
  c.on('data',d=>{if(!d||!Array.isArray(d.all))return;const ids=new Set();for(const e of d.all.slice(0,12)){if(!e||typeof e.id!=='string')continue;ids.add(e.id);setPeer(e.id,e)}
   for(const k of[...peers.keys()])if(!ids.has(k))dropPeer(k);NS('✅ '+(ids.size+1)+' لاعبين في الغرفة')});
  c.on('close',()=>{if(pr!==me)return;NS('⚠️ انقطع الاتصال بالغرفة','#ffd400');hostConn=null;clearPeers();setTimeout(()=>host(gen()),1800)});
  setTimeout(()=>fail('❌ ما قدرتش أدخل (الكود غلط أو الشبكة بتمنع الاتصال)'),10000)});
 me.on('error',e=>fail(e.type==='peer-unavailable'?'❌ الغرفة دي مش موجودة':'❌ مشكلة اتصال: '+e.type))}
$('jb').onclick=()=>{join($('jc').value);$('jc').value=''};
host(gen());
// minimap
const mm=$('mm'),mx=mm.getContext('2d'),base=document.createElement('canvas');base.width=base.height=208;
let ms=1;{const g=base.getContext('2d');let mxr=0;for(const p of P)mxr=Math.max(mxr,Math.abs(p.x),Math.abs(p.z));ms=92/mxr;g.strokeStyle='#ff2bd6';g.lineWidth=7;g.shadowColor='#0ff';g.shadowBlur=8;g.beginPath();P.slice(0,N).forEach((p,i)=>i?g.lineTo(104+p.x*ms,104+p.z*ms):g.moveTo(104+p.x*ms,104+p.z*ms));g.closePath();g.stroke()}
function dot(x,z,c,r){mx.fillStyle=c;mx.beginPath();mx.arc(104+x*ms,104+z*ms,r,0,6.283);mx.fill()}
// loop
let last=performance.now(),fr=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;fr++;
 const racing=state==='race',drive=state==='race'||state==='count'||state==='done';
 let vf=0,spd=0,nt=false;
 if(drive){
  const fx=Math.sin(me.h),fz=Math.cos(me.h),rx=-fz,rz=fx;vf=me.vx*fx+me.vz*fz;let vl=me.vx*rx+me.vz*rz;
  const g=racing&&(inp.g||(touch&&!inp.b)),br=racing&&inp.b,hb=racing&&inp.h;nt=racing&&inp.n&&me.nitro>0&&vf>8;const mv=nt?88:62;
  if(g)vf+=(nt?58:34)*dt*Math.max(0,1-vf/mv);if(br)vf-=(vf>0?65:22)*dt;if(!g&&!br)vf*=Math.exp(-.35*dt);vf*=Math.exp(-.05*dt);if(vf<-14)vf=-14;if(vf>mv)vf-=(vf-mv)*1.5*dt;
  me.steer+=((racing?(inp.r?1:0)-(inp.l?1:0):0)-me.steer)*Math.min(1,9*dt);
  const sf=Math.min(1,Math.abs(vf)/10)*(1-Math.min(.5,Math.abs(vf)/150));
  me.h-=me.steer*(hb?2.6:1.9)*sf*(vf<0?-1:1)*dt;vl*=Math.exp(-(hb?1.4:6)*dt);
  if(nt)me.nitro=Math.max(0,me.nitro-32*dt);else me.nitro=Math.min(100,me.nitro+(Math.abs(vl)>6&&vf>20?16:4)*dt);
  const f2=Math.sin(me.h),c2=Math.cos(me.h);me.vx=f2*vf-c2*vl;me.vz=c2*vf+f2*vl;me.x+=me.vx*dt;me.z+=me.vz*dt;
  const pi=me.idx;me.idx=near(me.x,me.z,me.idx);const p=P[me.idx],t=T[me.idx],lat=(me.x-p.x)*-t.z+(me.z-p.z)*t.x,al=Math.abs(lat);
  if(al>W/2){const k=Math.exp(-1.6*dt);me.vx*=k;me.vz*=k}
  const lim=W/2+2.4;if(al>lim){const s=lat<0?-1:1;me.x=p.x-t.z*s*lim;me.z=p.z+t.x*s*lim;const vo=(me.vx*-t.z+me.vz*t.x)*s;if(vo>0){me.vx-=-t.z*s*vo*1.4;me.vz-=t.x*s*vo*1.4}me.vx*=.93;me.vz*=.93;if(vo>3){shake=.7;beep(110,.15)}}
  if(pi>N*.8&&me.idx<N*.2){me.lap++;if(me.lap>LAPS&&racing)finish();else if(me.lap>1)beep(660,.3)}else if(pi<N*.2&&me.idx>N*.8)me.lap--;
  for(const o of bots){const dx=me.x-o.m.position.x,dz=me.z-o.m.position.z,d=Math.hypot(dx,dz);if(d<3.6&&d>.01){me.x+=dx/d*(3.6-d);me.z+=dz/d*(3.6-d);me.vx*=.97;me.vz*=.97;o.slow=.5;shake=.3}}
  total=me.lap*N+me.idx;spd=Math.hypot(me.vx,me.vz);
 }
 // bots
 for(const[k,o]of bots.entries()){if(racing||state==='done'){const i0=(o.total%N+N)%N|0,rub=Math.max(-4,Math.min(5,(total-o.total)*.03));o.slow=Math.max(0,(o.slow||0)-dt);
   const tg=o.b*(1-curvF[i0])+rub-(o.slow>0?14:0);o.v+=(tg-o.v)*Math.min(1,1.5*dt);o.total+=o.v/segL*dt}
  const a=(o.total%N+N)%N,i=a|0,f=a-i,p=P[i],q=P[(i+1)%N],t=T[i],lat=o.lat+Math.sin(now/1200+k*2)*2;
  o.m.position.set(p.x+(q.x-p.x)*f-t.z*lat,0,p.z+(q.z-p.z)*f+t.x*lat);o.m.rotation.y=Math.atan2(t.x,t.z);}
 // peers
 for(const o of peers.values()){if(o.x===undefined)continue;const k=1-Math.exp(-12*dt);o.m.position.x+=(o.x-o.m.position.x)*k;o.m.position.z+=(o.z-o.m.position.z)*k;o.m.rotation.y+=angD(o.m.rotation.y,o.h)*k}
 // my mesh + cam
 const b=myCar.userData.b;myCar.position.set(me.x,0,me.z);myCar.rotation.y=me.h;b.rotation.z+=(me.steer*Math.min(1,vf/40)*.08-b.rotation.z)*Math.min(1,8*dt);
 myCar.userData.fl.visible=nt;if(nt)myCar.userData.fl.scale.z=.8+Math.random()*.6;
 if(state==='menu'){const a=now/4000,p=P[N-14];cam.position.set(p.x+Math.cos(a)*26,7,p.z+Math.sin(a)*26);cam.lookAt(p.x,1,p.z);myCar.visible=false;myCar.position.set(p.x,0,p.z)}
 else{myCar.visible=true;camH+=angD(camH,me.h)*(1-Math.exp(-5*dt));const back=9+spd*.04,sk=shake*(Math.random()-.5)*1.2+(nt?.25*(Math.random()-.5):0);shake=Math.max(0,shake-dt*2);
  cam.position.set(me.x-Math.sin(camH)*back+sk,3.8+spd*.01+sk,me.z-Math.cos(camH)*back+sk);cam.lookAt(me.x+Math.sin(camH)*10,1.6,me.z+Math.cos(camH)*10);
  fov+=((62+spd*.28+(nt?10:0))-fov)*Math.min(1,4*dt);cam.fov=fov;cam.updateProjectionMatrix()}
 R.render(scene,cam);
 // HUD + audio + net
 if(au&&gn){osc.frequency.setTargetAtTime(48+spd*2.4+(nt?30:0),au.currentTime,.05);gn.gain.setTargetAtTime(state==='menu'?0:.05+(inp.g||touch?.025:0),au.currentTime,.1)}
 if(fr%3===0&&state!=='menu'){$('spd').firstChild.nodeValue=Math.round(spd*3.6);$('pos').textContent=rankNow()+'/'+(5+peers.size);$('lap').textContent=Math.min(Math.max(me.lap,1),LAPS)+'/'+LAPS;
  $('nf').style.width=me.nitro+'%';$('fx').style.opacity=nt?1:0;
  const tm=state==='race'?(now-t0)/1000:0;$('tm').textContent=String(tm/60|0).padStart(2,'0')+':'+(tm%60).toFixed(1).padStart(4,'0');
  $('net').textContent=netN>1?'🌐 '+netN+' لاعبين أونلاين':'🌐 بانتظار لاعبين آخرين…';
  mx.clearRect(0,0,208,208);mx.drawImage(base,0,0);for(const o of bots)dot(o.m.position.x,o.m.position.z,'#ff2bd6',5);for(const o of peers.values())dot(o.m.position.x,o.m.position.z,'#7fffb0',5);dot(me.x,me.z,'#00f0ff',7)}
netN=peers.size+1;if(pr&&now-lastSend>66){lastSend=now;const s={x:+me.x.toFixed(1),z:+me.z.toFixed(1),h:+me.h.toFixed(2),c:ci,n:$('nm').value.slice(0,12),t:total};
  if(isHost){for(const[k,o]of peers)if(now-o.seen>8000)dropPeer(k);
   for(const c of conns){if(!c.open)continue;const all=[Object.assign({id:'host'},s)];for(const[k,o]of peers)if(k!==c.peer&&o.raw)all.push(Object.assign({id:k},o.raw));try{c.send({all})}catch(e){}}}
  else if(hostConn&&hostConn.open){try{hostConn.send({s})}catch(e){}}}
}
requestAnimationFrame(frame);
})();
