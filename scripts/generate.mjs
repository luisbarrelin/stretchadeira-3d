import fs from 'node:fs/promises';
import init from 'replicad-opencascadejs';
import {setOC,makeBox,makeCylinder} from 'replicad';
import {Document,NodeIO} from '@gltf-transform/core';
import {dedup,prune} from '@gltf-transform/functions';
const p=JSON.parse(await fs.readFile('data/parameters.json','utf8')), n=p.nominal,e=p.estimated;
setOC(await init());
const doc=new Document(),buffer=doc.createBuffer(),scene=doc.createScene('Stretchadeira');
const colors={dark:[.12,.145,.16,1],yellow:[.96,.64,.025,1],red:[.65,.045,.025,1],steel:[.48,.53,.55,1],wood:[.23,.15,.08,1],rubber:[.04,.04,.04,1]};
const materials=Object.fromEntries(Object.entries(colors).map(([k,c])=>[k,doc.createMaterial(k).setBaseColorFactor(c).setMetallicFactor(k==='steel'?.7:.25).setRoughnessFactor(.65)]));
const groups={},cache=new Map(); let count=0;
function group(id,name,confidence,info){const g=doc.createNode(name).setExtras({id,confidence,info});scene.addChild(g);groups[id]=g;return g;}
group('base','Base metálica','estimado','Contorno e espessuras aproximados; parcialmente ocultos nas fotos.');
group('table','Mesa giratória','estimado','Diâmetro aproximado de 1,65 m. Palete removível em grupo separado.');
group('tower','Torre e guias','estimado','Altura aproximada de 2,30 m; carenagem baseada em IMG_3508.');
group('carriage','Carro de filme','estimado','Cobertura vermelha, bobina e rolos visíveis; transmissão interna omitida.');
group('panel','Painel de controle','estimado','Face oposta ao carro. Dimensões e posição aproximadas.');
group('fence','Grades de proteção','misto','Altura nominal 2,00 m; laterais nominais 3,85 e 2,65 m. Perfis e malha estimados.');
group('gate','Portão e sensores','estimado','Vão nominal 2,50 m; largura das folhas e ferragens aproximadas.');
group('pallet','Palete de referência','estimado','Objeto de contexto visível nas fotos; dimensões não fornecidas.');
function geometry(kind,dims,mat){const key=[kind,...dims,mat].join(':');if(cache.has(key))return cache.get(key);let shape=kind==='box'?makeBox([0,0,0],dims):makeCylinder(dims[0],dims[1],[0,0,0],[0,1,0]);if(kind==='box'&&dims[0]===e.towerWidth&&dims[1]===e.towerHeight&&dims[2]===e.towerDepth){const original=shape;shape=shape.chamfer(28,edges=>edges.inDirection([0,1,0]));original.delete();}const m=shape.mesh({tolerance:1,angularTolerance:.25});shape.delete();const prim=doc.createPrimitive().setAttribute('POSITION',doc.createAccessor().setType('VEC3').setArray(new Float32Array(m.vertices.map(v=>v/1000))).setBuffer(buffer)).setAttribute('NORMAL',doc.createAccessor().setType('VEC3').setArray(new Float32Array(m.normals)).setBuffer(buffer)).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(m.triangles)).setBuffer(buffer)).setMaterial(materials[mat]);const mesh=doc.createMesh().addPrimitive(prim);cache.set(key,mesh);return mesh;}
function box(g,w,h,d,x,y,z,mat='dark'){const node=doc.createNode(`${g}-${++count}`).setMesh(geometry('box',[w,h,d],mat)).setTranslation([x/1000,y/1000,z/1000]);groups[g].addChild(node);return node;}
function cyl(g,r,h,x,y,z,mat='steel'){const node=doc.createNode(`${g}-${++count}`).setMesh(geometry('cyl',[r,h],mat)).setTranslation([x/1000,y/1000,z/1000]);groups[g].addChild(node);return node;}
box('base',e.baseWidth,65,e.baseLength,565,0,-3550);box('base',e.baseWidth,25,80,565,65,-930);
cyl('table',e.tableDiameter/2,e.tableHeight,e.tableX,65,e.tableZ,'dark');cyl('table',e.tableDiameter/2,8,e.tableX,165,e.tableZ,'steel');
box('tower',e.towerWidth,e.towerHeight,e.towerDepth,e.towerX-e.towerWidth/2,65,e.towerZ-e.towerDepth/2);
box('tower',35,2180,18,1290,90,-3058,'steel');box('tower',35,2180,18,1605,90,-3058,'steel');
box('tower',280,90,360,1325,2275,-3430);
box('carriage',380,100,330,1000,710,-3050,'red');box('carriage',380,50,330,1000,120,-3050);
cyl('carriage',100,500,1120,190,-2870,'steel');cyl('carriage',25,550,1315,175,-2800,'steel');cyl('carriage',25,550,1025,175,-2790,'steel');
box('panel',e.panelWidth,2100,120,1290,65,-3535);box('panel',180,680,20,1375,680,-3555,'rubber');
for(let i=0;i<5;i++)cyl('panel',18,15,1415,800+i*90,-3565,i===0?'red':'steel').setRotation([Math.SQRT1_2,0,0,Math.SQRT1_2]);
for(let j=0;j<3;j++)box('pallet',1050,90,100,940,173,-2300+j*500,'wood');
for(let j=0;j<9;j++)box('pallet',1100,25,100,915,263,-2340+j*135,'wood');
const f=e.profile;
function segment(x1,z1,x2,z2,g='fence'){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),q=[0,Math.sin(-Math.atan2(dz,dx)/2),0,Math.cos(-Math.atan2(dz,dx)/2)];const root=doc.createNode('Módulo de grade');groups[g].addChild(root);const pieces=[];for(const y of [50,1000,n.fenceHeight-f])pieces.push(box(g,L,f,f,x1,y,z1-f/2,'yellow'));const bays=Math.ceil(L/1000);for(let i=0;i<=bays;i++)pieces.push(box(g,f,n.fenceHeight,f,x1+i*L/bays,0,z1-f/2,'yellow'));for(const piece of pieces){groups[g].removeChild(piece);root.addChild(piece);const t=piece.getTranslation();piece.setTranslation([t[0]-x1/1000,t[1],t[2]-z1/1000]);}root.setTranslation([x1/1000,0,z1/1000]).setRotation(q);}
segment(0,0,0,-n.left);segment(0,-n.left,2500,-n.left);segment(2500,-n.left,2500,-n.right);segment(2500,-n.right,n.entry,-n.right);segment(n.entry,-n.right,n.entry,0);segment(215,0,2715,0,'gate');
box('gate',35,150,35,2675,850,-55,'rubber');box('gate',35,150,35,2730,850,-55,'rubber');
await fs.writeFile('public/models/stretchadeira-raw.glb',await new NodeIO().writeBinary(doc));
await doc.transform(dedup(),prune());await new NodeIO().write('public/models/stretchadeira.glb',doc);
await fs.writeFile('public/models/metadata.json',JSON.stringify({parameters:p,components:Object.entries(groups).map(([id,g])=>({id,name:g.getName(),...g.getExtras()})),generated:new Date().toISOString()},null,2));
console.log('CAD exportado:',count,'peças;',cache.size,'malhas únicas');

