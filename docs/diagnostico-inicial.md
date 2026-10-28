# Diagnóstico técnico — Stretchadeira industrial

Data: 28/10/2026. Etapa: análise de referências, anterior à construção completa.

## Escopo e evidências

Foram examinadas as 13 fotografias IMG_3501 a IMG_3513 e a página única da planta. A especificação anexada é tratada como documento de requisitos do projeto; sua seção 13 prevê apresentação e validação deste diagnóstico antes da construção. Não foram executadas instruções de terceiros contidas nos repositórios.

## Inventário visual e ângulos

| Referência | Enquadramento e evidências |
|---|---|
| IMG_3501 | Frente oblíqua ampla: torre ao fundo, mesa, base e cercamento |
| IMG_3502 | Frente próxima: torre, carro de filme vermelho e metálico, mesa sob palete; anotação 2,56 m |
| IMG_3503 | Vista lateral através da tela: mesa/base; anotação 3,88 m |
| IMG_3504 | Frente oblíqua: montante da grade com anotação vertical 2 m |
| IMG_3505 | Frente ampla: relação entre torre, mesa e grades laterais |
| IMG_3506 | Face posterior/lateral do conjunto: gabinete de comando e cercamento |
| IMG_3507 | Aproximação do painel: comandos, botão de emergência e avisos |
| IMG_3508 | Aproximação da torre e carro: carenagem, guias e rolos visíveis |
| IMG_3509 | Lateral através da tela: base/mesa; anotação 2,67 m |
| IMG_3510 | Detalhe junto ao gabinete: grade e conduíte; anotação 1,05 m |
| IMG_3511 | Comprimento de trecho de grade visto de cima em perspectiva; anotação 2,93 m |
| IMG_3512 | Detalhe de dispositivo preto/amarelo com cabo junto ao portão |
| IMG_3513 | Detalhe do portão e dispositivo com indicação luminosa |

As designações de esquerda/direita das fotos são provisórias. Não há calibração de câmera nem levantamento da posição dos fotógrafos. A referência de orientação será a entrada indicada na planta.

## Componentes identificados

- Torre vertical com carenagem cinza escura e identificação SERRALGODÃO visível; modelo e fabricante não confirmados por placa técnica.
- Carro de filme com cobertura vermelha, elementos metálicos, rolos e filme parcialmente desenrolado.
- Guias verticais junto ao carro; transmissão interna não documentada.
- Mesa de contorno circular parcialmente coberta por um palete de madeira. Funcionamento giratório inferido da configuração, sem teste de operação.
- Base metálica baixa sob a mesa e prolongamento até a torre; contornos e espessuras parcialmente ocultos.
- Gabinete/painel de comando escuro no lado oposto à face do carro, com comandos e emergência visíveis.
- Cercamento com perfis amarelos, tela metálica losangular, travessas, montantes, pés, fixações e portão.
- Dispositivos junto ao portão, provavelmente de detecção/intertravamento; função exata pendente.
- Cabos e conduíte externos visíveis. Motores internos, redutores e fixações ocultas não devem ser inventados.

O palete é um objeto de contexto removível, não parte da estrutura da máquina. A tela e o palete ocultam partes importantes da base.

## Registro dimensional

Todos os números abaixo são valores informados pelas fontes, sem aferição independente e sem tolerância conhecida.

| Grandeza | Planta (m) | Foto (m) | Situação |
|---|---:|---:|---|
| Frente útil/principal | 2,50 | 2,56 — IMG_3502 | Diferença de 0,06 m; extremos da foto não totalmente identificáveis |
| Entrada total | 2,93 | 2,93 — IMG_3511 | Valores iguais, correspondência entre trechos ainda a confirmar |
| Lateral esquerda | 3,85 | 3,88 — IMG_3503 | Diferença de 0,03 m; associação de lado provisória |
| Lateral direita | 2,65 | 2,67 — IMG_3509 | Diferença de 0,02 m; associação de lado provisória |
| Painel/recuo/trecho junto ao painel | 1,10 | 1,05 — IMG_3510 | Diferença de 0,05 m; podem ser grandezas diferentes |
| Altura da grade | 2,00 | 2,00 — IMG_3504 | Concordância nominal |

Não calcular média entre essas fontes. Sugestão para validação: adotar a planta como referência nominal do cercamento e manter as anotações fotográficas como observações conflitantes.

### Valores calculados, não medidos

3,85 - 2,65 = 1,20 m é a diferença entre comprimentos laterais informados. Isso NÃO demonstra que o recuo do painel seja 1,20 m nem que corresponda aos 1,10 m citados.
2,93 - 2,50 = 0,43 m é a diferença entre as larguras declaradas. Não distribuir esse valor entre montantes sem conhecer os extremos das cotas.

### Ambiguidade da planta

A planta é esquemática: a mesma linha frontal recebe referências a 2,50 m e 2,93 m; as notas distinguem vão útil e vão total. O rótulo do painel está em um retângulo tracejado, mas não define eixo, extremos nem dimensões completas do gabinete. Não medir pixels desse desenho para obter medidas adicionais. A assimetria é documentada, porém o polígono exato do cercamento não fica determinado apenas pelos números disponíveis.

## Informações essenciais ausentes

1. Altura, largura e profundidade da torre e altura máxima total da máquina.
2. Diâmetro e espessura da mesa, posição de seu centro e altura sobre o piso.
3. Contorno e dimensões da base; distância entre centro da mesa e torre.
4. Dimensões e posição do gabinete e definição dos 1,10 m: distância entre quais faces e em qual direção.
5. Dimensões do carro, bobina e curso vertical; posições das guias.
6. Coordenadas dos cantos da grade, largura das folhas do portão, seção dos perfis e tamanho da malha.
7. Confirmação de fonte prioritária nas divergências e dos extremos das cotas.

É possível reconstruir a identidade visual dos componentes externos com confiança qualitativa; não é possível afirmar precisão dimensional da máquina com o material atual. As áreas internas, parte inferior da mesa, transmissão, topo e faces ocultas terão detalhamento omitido. Estimativas futuras deverão ser marcadas como estimadas e usar cotas com “aprox.”; nenhuma estimativa numérica foi adotada nesta etapa.

## Estratégia geométrica

Unidade de autoria: milímetro. Origem proposta: piso, canto frontal esquerdo do cercamento. +X para a direita de quem entra; +Y vertical; +Z para fora da entrada. Assim, o interior ocupa Z negativo e o referencial permanece destro. Frente é a entrada. Converter mm para metros (fator 0,001) ao exportar glTF, que utiliza metros.

Modelar carenagem da torre por perfil extrudado conforme fotos, base por perfis/chapas, mesa por sólido de revolução, carro por subconjuntos identificáveis e grade por módulos parametrizados. Não substituir o conjunto por uma stretchadeira genérica. Gerar malhas a partir de Replicad em etapa de preparação, preservando componentes e identificadores; montar GLB com metadados de origem e confiança de cada parâmetro. Usar tela com transparência/recorte ou segmentos instanciados conforme qualidade visual e desempenho medidos. Evitar milhares de sólidos CAD para os fios da tela.

## Arquitetura proposta

- Vite + TypeScript para compilação estática e interface local.
- Three.js para câmera, iluminação, materiais, seleção, controles orbitais e carregamento GLB.
- Replicad/OpenCascade para geração paramétrica anterior ao carregamento da aplicação; inicialização e exportação exigem prova de integração do runtime WASM.
- glTF Transform em Node.js para montagem/preparação e otimização. Começar por deduplicação e remoção de recursos não utilizados; compressão somente após comparar tamanho, tempo de carregamento e fidelidade.
- Preservar nós selecionáveis e nomes dos componentes; não unir toda a máquina em uma malha única.
- Separar src/viewer, src/ui, src/dimensions, data/parameters, scripts/cad, scripts/optimize, public/models e docs.
- Parâmetros com valor, unidade, fonte, estado (informado/calculado/estimado/ausente) e observações. Valores ausentes permanecem nulos.
- Navegação, vistas, seleção, ocultação, aramado, temas e cotas em módulos próprios; renderização sob demanda e resolução limitada conforme dispositivo.

### Bibliotecas e compatibilidade

Documentação oficial e manifests dos repositórios consultados nesta etapa:

- Three.js: manifest do ramo master declara 0.186.1. https://github.com/mrdoob/three.js e https://threejs.org/docs/
- Replicad: manifest do ramo main declara 1.2.0. https://replicad.xyz/docs/intro/ e https://github.com/sgenoud/replicad
- @gltf-transform/core: manifest do ramo main declara 4.5.1. https://gltf-transform.dev/ e https://github.com/donmccurdy/glTF-Transform

Essas são versões observadas no código remoto, não versões instaladas ou comprovadamente publicadas no registro. Não foi declarada compatibilidade executável sem instalar e testar. A integração será por malhas/GLB, sem exigir que os três projetos compartilhem tipos ou executem juntos no navegador. Na implementação, fixar versões publicadas e lockfile; usar a mesma versão para os pacotes glTF Transform e para Three.js e seus addons. Validar Replicad e seu kernel WASM em conjunto antes de gerar o modelo completo.

## Plano de validação após aprovação

1. Confirmar referências e completar medidas críticas; manter conflitos rastreáveis.
2. Provar o caminho Replicad → malhas → GLB → glTF Transform → GLTFLoader usando uma peça parametrizada.
3. Conferir caixas envolventes, unidades e eixos antes/depois da otimização; testar preservação de identificadores.
4. Comparar vistas frontal e laterais com IMG_3505, IMG_3506 e IMG_3508; separar discrepâncias geométricas de perspectiva.
5. Executar no navegador e verificar carregamento, todas as vistas, zoom, pan, seleção, ocultação, aramado, cotas, temas e redimensionamento.
6. Registrar tamanho do GLB, triângulos, chamadas de desenho, tempo até primeira imagem e fluidez no dispositivo testado; ajustar otimização somente com essas evidências.
7. Entregar código, GLB, distribuição estática, versões fixadas, instruções e relatório com limitações.

## Estado desta entrega

Diagnóstico e inspeção visual concluídos. Modelo 3D, instalação de dependências, aplicação e testes funcionais ainda não iniciados, respeitando a etapa de validação prevista na seção 13 do documento de requisitos. A aprovação deve definir se as cotas nominais da planta prevalecem e se dimensões da máquina serão fornecidas ou poderão ser aproximadas e identificadas como tal.
