# Stretchadeira industrial — visualizador 3D

[**Abrir visualizador online**](https://luisbarrelin.github.io/stretchadeira-3d/)

Publicação pelo GitHub Pages a partir de main /docs. Após alterar o código, execute pnpm build e copie o conteúdo de dist para docs antes de enviar a atualização.

Aplicação local e estática baseada nas 13 fotografias e na planta fornecidas. O uso das cotas da planta e de aproximações visuais foi aprovado em 28/10/2026. O modelo é um estudo visual: as dimensões não fornecidas estão identificadas como aproximadas.

## Abrir agora

Com as dependências já instaladas, execute `INICIAR.cmd` e abra http://127.0.0.1:5180/ no navegador. Mantenha a janela do servidor aberta durante o uso. Esse iniciador utiliza Node.js instalado no computador ou o runtime já disponível no Codex deste usuário.

## Instalar em outro computador

Requisitos: Node.js 22.12+ ou 24 LTS, navegador moderno com WebGL e pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra o endereço informado. O projeto contém o GLB já gerado; iniciar a aplicação não exige recalcular o CAD.

## Gerar modelo, verificar e compilar

```sh
pnpm model
pnpm verify
pnpm build
pnpm preview
```

`model` inicializa o OpenCascade/WASM em Node.js, constrói os sólidos com Replicad, converte as malhas de mm para metros e escreve o GLB via glTF Transform. `dedup` e `prune` reduzem recursos repetidos sem unir os componentes. O navegador carrega apenas o GLB com Three.js; o kernel CAD não faz parte do código do visualizador.

`verify` confirma dimensões antes/depois da otimização, valores finitos, identificadores, escala e redução do arquivo. O teste da altura da torre usa o valor padrão de 2,30 m mais 65 mm de apoio: ajuste essa expectativa ao alterar a dimensão de referência.

Para repetir os testes funcionais, instale Google Chrome e execute:

```sh
node scripts/browser-check.mjs
```

O teste inicia um servidor temporário em 5174, usa Chrome sem janela e grava capturas e resultados em `docs`. O teste utiliza renderização por software para consistência; o desempenho não representa a GPU do usuário. Para outro navegador Chromium instalado pelo Playwright, remova `channel: 'chrome'` e execute `pnpm exec playwright install chromium`.

## Operação

- Arrastar: girar. Botão direito: deslocar. Roda/gesto: aproximar e afastar.
- Botões inferiores: vistas, enquadramento inicial, zoom, cotas e aramado.
- Clique no modelo ou no nome de um componente para selecionar e destacar.
- Caixas na lista controlam visibilidade. Mostrar todos restaura as oito partes.
- Cotas mostram referências nominais do cercamento; selecionar torre, mesa, base, carro ou painel acrescenta suas cotas aproximadas.
- O painel informa a origem e as limitações de cada geometria.
- Salvar imagem exporta o desenho 3D em PNG. Rótulos HTML, botões e painel não são incorporados ao PNG.
- Componentes recolhe a barra lateral; Tema claro/escuro altera a aparência.

## Atualizar medidas

Edite `data/parameters.json`, sempre em milímetros. `nominal` contém as medidas informadas na planta; `estimated` contém aproximações. Mantenha `notes` e a documentação atualizados quando uma medida for aferida. Execute `pnpm model`, `pnpm verify` e `pnpm build` após as alterações.

Os parâmetros de diâmetro/altura da mesa, dimensões da torre, dimensões gerais da base e comprimentos principais da grade controlam os sólidos correspondentes. Posições de rolos, chapa de apoio, comandos, travessas e módulos, assim como o fechamento posterior e parte das cotas auxiliares, são definidos em `scripts/generate.mjs`, `src/viewer.js` e `src/dimensions.js`: devem ser ajustados em conjunto se a disposição mudar. O arquivo não é um configurador automático de qualquer máquina.

`opening=2500` e `entry=2930` são referências distintas. O fechamento posterior direito é uma hipótese de disposição e não uma interpretação aferida dos 1,10 m da planta. Não converter `panelReference` em largura de gabinete. A medida de 1,10 m permanece registrada e não aparece como uma cota resolvida.

## Publicar

Envie o conteúdo de `dist/` para uma hospedagem estática. `base: './'` permite publicar em subpastas. Não abra `dist/index.html` diretamente por `file://`: o carregamento de módulos e GLB exige um servidor HTTP. A distribuição não depende de CDN nem faz chamadas para serviços externos.

## Estrutura

- `src/main.js`: interface e estado dos controles.
- `src/viewer.js`: cena, interação, materiais, câmera e detalhes leves de tela/identificação.
- `src/dimensions.js`: cotas nominais e aproximadas.
- `data/parameters.json`: parâmetros e classificação das medidas.
- `scripts/generate.mjs`: sólidos Replicad e preparação GLB.
- `scripts/verify.mjs`: verificação geométrica do arquivo.
- `public/models/`: arquivos tridimensionais e metadados.
- `dist/`: aplicação compilada para publicação.
- `docs/`: diagnóstico, relatório, referências e evidências dos testes.

Foi usado JavaScript com módulos ES para manter pequena a aplicação sem framework de interface. O código separa interface, visualização, cotas, parâmetros e preparação do modelo. As oito partes permanecem como nós independentes, permitindo futuras animações e novas versões do GLB.

## Versões fixadas e licenças

- Three.js 0.186.1 — MIT — https://github.com/mrdoob/three.js
- Replicad 1.2.0 — MIT — https://github.com/sgenoud/replicad
- replicad-opencascadejs 1.1.0 — LGPL-2.1-only — dependência de autoria CAD, não distribuída no visualizador estático.
- @gltf-transform/core e @gltf-transform/functions 4.5.1 — MIT — https://github.com/donmccurdy/glTF-Transform
- Vite 8.3.5 — MIT.
- Playwright 1.64.1 — Apache-2.0, dependência de testes.

`pnpm-lock.yaml` fixa a instalação. Preserve os avisos de licença das dependências ao redistribuir seus pacotes. A distribuição compilada inclui apenas os módulos necessários de Three.js e o código do visualizador.

