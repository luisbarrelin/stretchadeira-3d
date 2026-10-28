import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CSS2DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';
import {createDimensions} from './dimensions.js';
export async function createViewer(container,onSelect){
const started=performance.now(),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.01,100);let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){throw new Error('WebGL não disponível neste navegador. '+e.message);}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.appendChild(renderer.domElement);
const labels=new CSS2DRenderer();labels.domElement.style.cssText='position:absolute;inset:0;pointer-events:none';container.appendChild(labels.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.12;controls.minDistance=.5;controls.maxDistance=18;controls.maxPolarAngle=Math.PI*.495;controls.target.set(1.46,1,-1.9);
scene.add(new THREE.HemisphereLight(0xdce9ff,0x544b35,2));const key=new THREE.DirectionalLight(0xfff3d9,3.5);key.position.set(3,8,4);scene.add(key);const fill=new THREE.DirectionalLight(0xc0d5ff,2);fill.position.set(-3,4,-4);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x18222c,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.018;scene.add(ground);const grid=new THREE.GridHelper(16,32,0x3a4854,0x293640);grid.position.set(1.46,-.014,-1.9);scene.add(grid);
let currentView='iso';let scheduled=false,transition=null,dims,model,selected=null,wire=false;const target=new THREE.Vector3(1.465,1,-1.925),size=new THREE.Vector2();
function invalidate(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
function render(){scheduled=false;if(transition){const t=Math.min((performance.now()-transition.start)/550,1),s=t*t*(3-2*t);camera.position.lerpVectors(transition.from,transition.to,s);controls.target.lerpVectors(transition.targetFrom,target,s);if(t===1)transition=null;else invalidate();}if(controls.update())invalidate();renderer.render(scene,camera);labels.render(scene,camera);}
controls.addEventListener('change',invalidate);
const observer=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);labels.setSize(w,h);if(model)view(currentView,false);invalidate();});observer.observe(container);
const meta=await (await fetch(import.meta.env.BASE_URL+'models/metadata.json')).json();model=(await new GLTFLoader().loadAsync(import.meta.env.BASE_URL+'models/stretchadeira.glb')).scene;scene.add(model);
const components=new Map();model.children.forEach(o=>{if(o.userData.id)components.set(o.userData.id,o);});
function meshPanel(parent,x,z,L,angle){const pts=[],H=1.9,bottom=.06,pitch=.11;for(const slope of [1,-1])for(let start=-H;start<L+H;start+=pitch){const candidates=[];for(const y of [0,H]){const xx=start+slope*y;if(xx>=0&&xx<=L)candidates.push([xx,y]);}for(const xx of [0,L]){const y=(xx-start)/slope;if(y>0&&y<H)candidates.push([xx,y]);}if(candidates.length>=2)for(const [xx,y]of candidates.slice(0,2))pts.push(xx,y+bottom,0);}
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const lines=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0x889596,transparent:true,opacity:.35}));lines.position.set(x,0,z);lines.rotation.y=-angle;parent.add(lines);}
const fence=components.get('fence');for(const [a,b]of [[[0,0],[0,-3.85]],[[0,-3.85],[2.5,-3.85]],[[2.5,-3.85],[2.5,-2.65]],[[2.5,-2.65],[2.93,-2.65]],[[2.93,-2.65],[2.93,0]]]){const dx=b[0]-a[0],dz=b[1]-a[1];meshPanel(fence,a[0],a[1],Math.hypot(dx,dz),Math.atan2(dz,dx));}meshPanel(components.get('gate'),.215,0,2.5,0);
// Distinct front marking based on the photographed column.
const cv=document.createElement('canvas');cv.width=256;cv.height=1024;const ctx=cv.getContext('2d');ctx.fillStyle='#343b40';ctx.fillRect(0,0,256,1024);ctx.fillStyle='#c3c7c8';ctx.font='bold 65px sans-serif';ctx.textAlign='center';[...'SERRALGODÃO'].forEach((c,i)=>ctx.fillText(c,128,85+i*85));const tex=new THREE.CanvasTexture(cv),logo=new THREE.Mesh(new THREE.PlaneGeometry(.16,1.32),new THREE.MeshBasicMaterial({map:tex}));logo.position.set(1.465,1.56,-3.078);components.get('tower').add(logo);
const originals=new Map();model.traverse(o=>{if(o.isMesh){originals.set(o,o.material);o.material=o.material.clone();}});
dims=createDimensions(meta);scene.add(dims);
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects([...components.values()].filter(o=>o.visible),true).find(h=>h.object.isMesh);let obj=hit?.object;while(obj&&!obj.userData.id)obj=obj.parent;if(obj)onSelect(obj.userData.id);});
function select(id){selected=id;dims.userData.select(id);for(const [key,g]of components)g.traverse(o=>{if(o.isMesh&&o.material.emissive)o.material.emissive.setHex(key===id?0x695020:0);});invalidate();}
const views={iso:[6.8,4.7,5.4],front:[1.465,2.4,6.5],back:[1.465,2.4,-10],left:[-7,2.4,-1.925],right:[10,2.4,-1.925],top:[1.465,10,-1.924]};
function view(name,animate=true){currentView=name;controls.minDistance=.5;const to=new THREE.Vector3(...views[name]).sub(target).multiplyScalar(Math.max(1,.85/camera.aspect)).add(target);if(animate)transition={from:camera.position.clone(),to,start:performance.now(),targetFrom:controls.target.clone()};else{camera.position.copy(to);controls.target.copy(target);}invalidate();}
view('iso',false);const loadMs=Math.round(performance.now()-started);let dark=true;
return{meta,components,select,view,loadMs,setVisible(id,v){components.get(id).visible=v;invalidate();},toggleDimensions(v){dims.visible=v;invalidate();},toggleWireframe(v){wire=v;model.traverse(o=>{if(o.isMesh)o.material.wireframe=v;});invalidate();},zoom(f){const offset=camera.position.clone().sub(controls.target);offset.multiplyScalar(f);offset.setLength(THREE.MathUtils.clamp(offset.length(),controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);invalidate();},theme(light){dark=!light;scene.background=new THREE.Color(light?0xe8eef2:0x111a23);ground.material.color.setHex(light?0xe8eef2:0x18222c);grid.material.opacity=light?.22:1;grid.material.transparent=true;invalidate();},export(){renderer.render(scene,camera);const a=document.createElement('a');a.download='stretchadeira-vista-aproximada.png';a.href=renderer.domElement.toDataURL('image/png');a.click();},cameraState(){return {position:camera.position.toArray(),target:controls.target.toArray()};},stats(){return{...renderer.info.render,geometries:renderer.info.memory.geometries,loadMs,components:components.size};},dispose(){observer.disconnect();controls.dispose();model.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();labels.domElement.remove();renderer.domElement.remove();}};
}



