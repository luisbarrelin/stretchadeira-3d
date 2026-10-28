import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {createServer}=await import('vite'); const server=await createServer({server:{host:'127.0.0.1',port:5174}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto('http://127.0.0.1:5174/');await page.waitForFunction(()=>window.viewer?.components.size===8,{timeout:60000});await page.waitForTimeout(1200);await page.screenshot({path:'docs/view-desktop.png'});
console.log(await page.evaluate(()=>window.viewer.stats()));assert.equal(await page.locator('[data-component]').count(),8);
await page.getByRole('button',{name:'Cotas',exact:true}).click();await page.waitForTimeout(200);assert.equal(await page.locator('.dimension:visible').count(),5);await page.screenshot({path:'docs/view-dimensions.png'});
for(const view of ['front','back','left','right','top','iso']){await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(650);}
await page.locator('[data-component="tower"]').click();console.log('selected',await page.locator('#details').innerText());await page.locator('[data-visibility="fence"]').uncheck();assert.ok(await page.evaluate(()=>!window.viewer.components.get('fence').visible));await page.getByRole('button',{name:'Mostrar todos',exact:true}).click();
await page.getByRole('button',{name:'Aramado',exact:true}).click();await page.getByRole('button',{name:'Aramado',exact:true}).click();await page.getByRole('button',{name:'Tema claro',exact:true}).click();await page.screenshot({path:'docs/view-light.png'});await page.getByRole('button',{name:'Tema escuro',exact:true}).click();
await page.getByRole('button',{name:'Aproximar',exact:true}).click();await page.getByRole('button',{name:'Afastar',exact:true}).click();await page.getByRole('button',{name:'Enquadrar',exact:true}).click();
await page.waitForTimeout(900);const cameraBefore=await page.evaluate(()=>window.viewer.cameraState());const canvas=page.locator('#canvas canvas');const rect=await canvas.boundingBox();await page.mouse.move(rect.x+rect.width*.6,rect.y+rect.height*.55);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.6+80,rect.y+rect.height*.55+30,{steps:8});await page.mouse.up();await page.waitForTimeout(600);assert.notDeepEqual(await page.evaluate(()=>window.viewer.cameraState()),cameraBefore,'Rotação não alterou a câmera');const beforePan=await page.evaluate(()=>window.viewer.cameraState().target);await page.mouse.down({button:'right'});await page.mouse.move(rect.x+rect.width*.6+120,rect.y+rect.height*.55+45,{steps:6});await page.mouse.up({button:'right'});await page.waitForTimeout(600);assert.notDeepEqual(await page.evaluate(()=>window.viewer.cameraState().target),beforePan,'Pan não alterou o alvo');await page.getByRole('button',{name:'Enquadrar',exact:true}).click();await page.waitForTimeout(1400);const idleStart=await page.evaluate(()=>window.viewer.stats().frame);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>window.viewer.stats().frame),idleStart,'Renderização continuou em cena estática');
const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Salvar imagem',exact:true}).click();await (await downloadPromise).saveAs('docs/export-test.png');
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Componentes',exact:true}).click();await page.waitForTimeout(500);await page.screenshot({path:'docs/view-mobile.png'});
console.log('errors',errors);await fs.writeFile('docs/browser-results.json',JSON.stringify({errors,stats:await page.evaluate(()=>window.viewer.stats()),tested:['load','views','dimensions','selection','visibility','wireframe','theme','zoom','fit','export','resize','mouse-orbit','mouse-pan','idle-render']},null,2));await browser.close();await server.close();if(errors.length)process.exitCode=1;





