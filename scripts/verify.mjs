import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {NodeIO} from '@gltf-transform/core';
import {getBounds} from '@gltf-transform/functions';
const io=new NodeIO(),raw=await io.read('public/models/stretchadeira-raw.glb'),optimized=await io.read('public/models/stretchadeira.glb');
const rawBounds=getBounds(raw.getRoot().listScenes()[0]),bounds=getBounds(optimized.getRoot().listScenes()[0]);assert.deepEqual(bounds,rawBounds,'A otimização alterou os limites do modelo');
const groups=optimized.getRoot().listScenes()[0].listChildren();assert.equal(groups.length,8);assert.equal(new Set(groups.map(g=>g.getExtras().id)).size,8);
for(const a of optimized.getRoot().listAccessors()){for(const v of a.getArray())assert.ok(Number.isFinite(v),'Coordenada inválida');}
const metadata=JSON.parse(await fs.readFile('public/models/metadata.json','utf8'));assert.equal(metadata.parameters.nominal.fenceHeight,2000);assert.equal(metadata.components.length,8);
const tower=groups.find(g=>g.getExtras().id==='tower'),tb=getBounds(tower);assert.ok(Math.abs(tb.max[1]-2.365)<.001,'Conversão mm/m ou altura da torre incorreta');
const rawBytes=(await fs.stat('public/models/stretchadeira-raw.glb')).size,bytes=(await fs.stat('public/models/stretchadeira.glb')).size;assert.ok(bytes<rawBytes);
const result={bounds,towerBounds:tb,rawBytes,optimizedBytes:bytes,reductionPercent:Math.round((1-bytes/rawBytes)*1000)/10,componentIds:groups.map(g=>g.getExtras().id),checks:'Bounds preservados; valores finitos; IDs preservados; conversão mm/m; redução de tamanho'};await fs.writeFile('docs/model-validation.json',JSON.stringify(result,null,2));console.log(result);
