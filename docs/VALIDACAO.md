# Relatório de validação — 28/10/2026

## Resultado

Visualizador funcional com oito conjuntos independentes: base, mesa, torre/guias, carro de filme, painel, grades, portão/sensores e palete. Foram implementados navegação orbital, deslocamento, zoom, seis vistas, restauração, seleção com destaque, visibilidade individual, aramado, cotas, temas, recolhimento da lateral, layout responsivo e exportação PNG.

A versão de desenvolvimento foi executada e verificada em Chrome. A distribuição estática compilada também foi carregada por HTTP sem erros. Evidências: `browser-results.json`, `production-check.json`, `model-validation.json` e capturas PNG nesta pasta.

## Verificação dimensional

Os parâmetros nominais reproduzem a planta: entrada 2,93 m, referência útil 2,50 m, laterais 3,85 e 2,65 m, altura das grades 2,00 m. São valores informados, não aferidos. As cotas da cena distinguem medidas nominais de aproximações. O recuo de 1,10 m está registrado como referência ambígua e não é apresentado como cota resolvida.

Os perfis foram posicionados em linhas de referência nominais e possuem espessura estimada. Por isso o envelope externo da malha não equivale exatamente às linhas nominais do cercamento. A caixa total do GLB mede aproximadamente 2,99 m × 3,93 m no piso e 2,365 m em altura; isso inclui os perfis. Não se trata de levantamento físico nem de um gabarito de implantação.

A torre possui altura aproximada de 2,30 m sobre apoio de 65 mm. Mesa: diâmetro aproximado de 1,65 m; base: aproximadamente 1,80 × 2,70 m. Todas são hipóteses visuais autorizadas para desenvolvimento. A verificação automática confirma a conversão mm/m, a altura geométrica da torre, valores finitos e igualdade exata das caixas envolventes antes/depois da otimização. Não há validação metrológica contra medidas físicas da máquina.

## Comparação visual

As referências foram examinadas por meio das duas pranchas de contato e de aproximações das seis fotografias com anotações dimensionais. A composição conserva a identidade observável: torre escura posterior, carro com cobertura vermelha, mesa circular sobre base baixa, palete de madeira, painel na face oposta e cercamento amarelo com tela losangular. A carenagem da torre recebeu chanfros nas arestas verticais para aproximar sua silhueta.

IMG_3505 orientou a relação frontal torre/mesa/grade; IMG_3506 e IMG_3507 orientaram a face do painel; IMG_3508 orientou guias, carro e acabamento da torre. As capturas finais foram inspecionadas visualmente nos temas claro/escuro e no tamanho de celular. O enquadramento foi adaptado à proporção da tela para evitar o corte do modelo no celular.

Não houve reconstrução fotogramétrica nem calibração de lentes. O fechamento posterior direito, quantidade e posição dos módulos da grade, perfis, dimensões da máquina, rolos, botões e palete são aproximações. As comparações são qualitativas. Desgaste, etiquetas pequenas, conduítes, fixações miúdas e mecanismos ocultos não foram reproduzidos. A tela é desenhada com segmentos leves no visualizador e não integra o GLB CAD; a identificação da torre também é aplicada na visualização. O GLB contém os sólidos principais e os identificadores dos conjuntos.

## Testes funcionais

O teste automatizado abriu a aplicação em Chrome com WebGL por software e verificou carregamento das oito partes, vistas, presença das cotas, seleção pela lista, ocultação/restauração, aramado, alternância de temas, zoom, enquadramento, exportação e redimensionamento. Rotação e pan por mouse alteraram a câmera e seu alvo, respectivamente. A pausa da renderização quando a cena está estática foi confirmada pelo contador de quadros.

As capturas registram a interface em 1440 × 1000 e 390 × 844. Não foi realizado teste em aparelho móvel físico nem em Safari/Firefox. A seleção por clique na geometria está implementada com raycasting; o teste automatizado principal usa a lista de componentes.

## Desempenho observado

- 74 peças CAD geradas, 24 malhas únicas reutilizadas.
- GLB bruto: 89.948 bytes. GLB otimizado: 68.176 bytes. Redução: 24,2%.
- Cena inicial no navegador: 3.108 triângulos, 83 chamadas de desenho e 32 geometrias, incluindo chão, malha da grade e marcação.
- A aplicação registrou aproximadamente 0,6–0,9 segundo desde a criação do visualizador até o carregamento do modelo nos testes de desenvolvimento. O registro final exato está no JSON.
- Limite de resolução: pixel ratio máximo 1,75. Renderização sob demanda; operações CAD não executam no navegador final.
- Código principal compilado: aproximadamente 646 KB, cerca de 164 KB comprimido com gzip. O aviso de tamanho do Vite corresponde principalmente ao motor Three.js. Não foi adicionado outro framework de interface.

Esses resultados foram obtidos em navegador automatizado com renderização por software. Não representam um benchmark de FPS em GPU física. Para este modelo pequeno, a deduplicação foi suficiente; não se introduziu Draco/Meshopt nem seus decodificadores adicionais.

## Limitações e atualização

O modelo serve à apresentação e inspeção visual. As fontes não permitem precisão dimensional da máquina nem comprovação de funcionamento de mecanismos, curso, sensores ou segurança. Para refinar, priorizar altura e seção da torre, diâmetro da mesa, distância mesa/torre, contorno da base e coordenadas dos cantos da grade. A hipótese de fechamento posterior deve ser substituída quando o recuo do painel for esclarecido.

A edição de parâmetros e a regeneração estão documentadas no README. Posições secundárias ainda exigem ajuste conjunto nos módulos de geração e visualização. A geometria permanece organizada para receber animações, novos modelos e detalhes posteriores.
