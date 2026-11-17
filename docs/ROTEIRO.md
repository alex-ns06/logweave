# Roteiro do vídeo final

Projeto **logweave** | Trabalho final de Design Patterns

O limite do professor é de **10 minutos**. O grupo mira em até **8 minutos** para ter margem.

## Divisão entre os quatro

| Quem | O que fala | Palavras | Tempo estimado |
|---|---|---|---|
| **Alex** | Visão geral, Builder e Singleton | 238 | 1:42 |
| **Felipe** | Uso prático (caso padrão), Strategy e Decorator | 221 | 1:35 |
| **Logan** | Uso prático (caso estendido), Observer e Template Method | 224 | 1:36 |
| **Rogério** | Chain of Responsibility, Factory + Registry e fechamento | 225 | 1:36 |
| **Total** | | **908** | **6:29** |

Os tempos consideram uma fala de 140 palavras por minuto, um ritmo calmo. Quem fala mais devagar (130 palavras por minuto) leva cerca de 6:59 no total, abaixo da meta de 8 minutos e do limite de 10. As demonstrações rodando na tela podem acrescentar alguns segundos, por isso há folga.

## O que o enunciado pede e onde está no roteiro

| Exigência do professor | Onde está |
|---|---|
| Visão geral: objetivo e problema que a lib resolve | Alex, primeira fala |
| Uso prático: importar, instanciar e usar (caso padrão) | Felipe |
| Uso prático: caso em que o cliente estende a lib | Logan |
| Defesa: cada aluno apresenta 2 padrões diferentes (8 no total) | Alex, Felipe, Logan e Rogério, dois cada |
| Para cada padrão: qual é, onde está (código na tela), problema resolvido e por que foi adequado | As quatro linhas de cada padrão (Padrão e onde, Problema, Como funciona, Por que adequado) |
| Máximo de 10 minutos (meta do grupo: até 8) | Total estimado: 6:29 |

## Como gravar

- Cada um grava a própria parte, em tela cheia no editor (fonte grande, zoom de 150% ou mais), e depois juntam os trechos na ordem. Outra opção é gravar uma chamada com tela compartilhada, passando a vez de um para o outro.
- Em cada padrão, mostre o **arquivo e o trecho de código** indicados em "Na tela" enquanto fala. É o que o professor avalia.
- Leiam em voz alta pelo menos uma vez, cronometrando. As falas já têm a passagem de vez para o próximo.
- Falem só o primeiro nome, como no roteiro. Os nomes completos ficam no README.
- Se o total passar da meta de 8 minutos, ainda está dentro do limite de 10. Se chegar perto de 10, corte primeiro as linhas "Como funciona", depois encurte as demonstrações. Mantenha sempre "Padrão e onde", "Problema" e "Por que adequado".

---

## Alex: Visão geral, Builder e Singleton

*238 palavras, cerca de 1:42*

### Visão geral

*74 palavras, cerca de 0:32*

> Olá! Somos o Alex, o Felipe, o Logan e o Rogério, e esta é a logweave, uma biblioteca de logging para Node.js. Todo programa precisa registrar o que acontece, mas cada projeto reescreve os mesmos destinos, formatos e filtros, e qualquer mudança mexe em vários lugares. A logweave separa isso em peças independentes, já traz implementações prontas e deixa o desenvolvedor criar as suas sem alterar a biblioteca. Agora, o Felipe mostra como usar.

**Na tela:** Abertura com o README aberto (título e descrição) ou o editor com a pasta src/ expandida, mostrando as pastas core, appenders, formatters, interceptors e factory.

### Padrão 1: Builder

*89 palavras, cerca de 0:38*

> **Padrão e onde:** O primeiro padrão é o Builder, implementado em LoggerBuilder.ts.
>
> **Problema:** Um logger tem nível, vários destinos e filtros que precisam ser ligados em cadeia, e quase tudo é opcional. Com um construtor comum, o cliente decoraria parâmetros e ligaria a corrente na mão.
>
> **Como funciona:** Aqui, cada método só anota uma escolha, e o build monta tudo: liga os filtros na ordem, inscreve os destinos e, se nenhum foi escolhido, usa o console.
>
> **Por que adequado:** Foi adequado porque a API fluente pede só o que o cliente quer mudar e esconde o trabalho interno.

**Na tela:** LoggerBuilder.ts, método build() (e, se der tempo, linkChain()).

### Padrão 2: Singleton

*75 palavras, cerca de 0:32*

> **Padrão e onde:** O segundo é o Singleton, no LogManager.ts.
>
> **Problema:** Vários módulos da aplicação precisam do mesmo logger. Sem um registro único, cada um criaria o seu, com configurações duplicadas que podem divergir.
>
> **Como funciona:** O construtor é privado, e o getInstance cria a instância na primeira chamada e reaproveita nas seguintes, guardando os loggers por nome.
>
> **Por que adequado:** Foi adequado porque o logger é naturalmente compartilhado no processo, e o uso é opcional: o Builder funciona sozinho. Passo para o Felipe.

**Na tela:** LogManager.ts: construtor privado e getInstance().

---

## Felipe: Uso prático (caso padrão), Strategy e Decorator

*221 palavras, cerca de 1:35*

### Uso prático: caso padrão

*81 palavras, cerca de 0:35*

> No caso padrão, importo o LoggerBuilder e crio um logger só com o nome: ele já escreve no console, sem configurar nada. Depois configuro dois destinos, console e memória, com formatos diferentes, e peço para esconder dados sensíveis. Ao registrar um login com senha, a saída mostra a senha como três asteriscos e já traz a data. Repare que o desenvolvedor só importou a biblioteca e escolheu peças prontas: não precisou criar nenhuma classe. Agora o Logan mostra o caso estendido.

**Na tela:** Abrir examples/basic.ts e mostrar o import, o logger mínimo e o logger configurado. Rodar `npm run example:basic` e apontar a senha com ***. Dica: rode uma vez antes de gravar, para o tsc não atrasar a demonstração.

### Padrão 3: Strategy

*74 palavras, cerca de 0:32*

> **Padrão e onde:** Eu apresento o Strategy, na interface Formatter.ts.
>
> **Problema:** O mesmo evento precisa sair como texto legível no console e como JSON em um arquivo. Se o formato ficasse dentro do destino, cada formato novo exigiria condicionais e alterar essa classe.
>
> **Como funciona:** A interface tem um único método, o format, e cada destino recebe um Formatter: trocar o formato é passar outro objeto.
>
> **Por que adequado:** Foi adequado porque o cliente cria o CsvFormatter, como mostramos, sem tocar na biblioteca.

**Na tela:** Formatter.ts (a interface) ao lado de TextFormatter.ts e JsonFormatter.ts.

### Padrão 4: Decorator

*66 palavras, cerca de 0:28*

> **Padrão e onde:** O segundo é o Decorator, em FormatterDecorator.ts.
>
> **Problema:** Queremos, opcionalmente, acrescentar a data e esconder senhas, em qualquer combinação. Uma subclasse para cada combinação faria o número de classes explodir.
>
> **Como funciona:** Cada decorator envolve outro Formatter e tem a mesma interface, então eles se empilham, como nesta linha.
>
> **Por que adequado:** A diferença para o Strategy: ele troca o formato, e o Decorator acrescenta algo ao formato escolhido. Agora o Logan.

**Na tela:** FormatterDecorator.ts e a linha que empilha TimestampDecorator, RedactDecorator e TextFormatter.

---

## Logan: Uso prático (caso estendido), Observer e Template Method

*224 palavras, cerca de 1:36*

### Uso prático: caso estendido

*77 palavras, cerca de 0:33*

> No caso estendido, o cliente cria três classes novas: um destino que envia para um webhook, um formato CSV e um interceptor que acrescenta o ambiente. Ele cadastra o novo destino na fábrica e usa tudo junto. A mesma mensagem sai em CSV no webhook e em texto no console, já com o ambiente. E nenhum arquivo da pasta src foi alterado: isso é o princípio aberto e fechado. Agora, a defesa dos padrões, começando pelo Alex.

**Na tela:** Abrir examples/custom.ts: mostrar as três classes novas e a linha AppenderFactory.register. Rodar `npm run example:custom` e mostrar as duas saídas. Mostrar que a pasta src não foi alterada (por exemplo, git status sem mudanças em src).

### Padrão 5: Observer

*69 palavras, cerca de 0:30*

> **Padrão e onde:** Eu apresento o Observer, no Logger.ts.
>
> **Problema:** Uma mensagem deve ir ao console, a um arquivo e à memória ao mesmo tempo, e novos destinos devem entrar sem alterar o Logger.
>
> **Como funciona:** Os destinos se inscrevem com subscribe, e o Logger notifica todos a cada evento, conhecendo só a interface Appender. Se um falhar, o try/catch isola o erro e os outros continuam.
>
> **Por que adequado:** Foi adequado porque desacopla o Logger dos destinos.

**Na tela:** Logger.ts: subscribe() e o laço do notify() com try/catch.

### Padrão 6: Template Method

*78 palavras, cerca de 0:33*

> **Padrão e onde:** O segundo é o Template Method, no BaseAppender.ts.
>
> **Problema:** Todo destino repete o mesmo fluxo: checar o nível, formatar, escrever e tratar o erro. Copiar isso em cada appender geraria repetição e bugs.
>
> **Como funciona:** O método append fixa esse fluxo, e a subclasse só implementa o write, o único passo que muda. O destino do nosso exemplo estendido precisou de um método só.
>
> **Por que adequado:** Foi adequado porque garante o fluxo correto e deixa o cliente escrever muito pouco. Agora o Rogério.

**Na tela:** BaseAppender.ts: o método append() com o write() abstrato; depois o WebhookAppender do custom.ts.

---

## Rogério: Chain of Responsibility, Factory + Registry e fechamento

*225 palavras, cerca de 1:36*

### Padrão 7: Chain of Responsibility

*76 palavras, cerca de 0:33*

> **Padrão e onde:** Eu apresento a Chain of Responsibility, em Interceptor.ts.
>
> **Problema:** Antes de chegar aos destinos, o evento pode passar por regras como filtrar por nível, amostrar ou bloquear textos, e cada aplicação combina de um jeito. A alternativa seria um método gigante de condicionais.
>
> **Como funciona:** Cada regra é um elo: o handle repassa ao próximo, e devolver null interrompe a corrente.
>
> **Por que adequado:** Foi adequado porque o cliente cria um elo novo, como o interceptor de ambiente, sem alterar a biblioteca.

**Na tela:** Interceptor.ts: handle() e process(); mostrar as três implementações na pasta interceptors.

### Padrão 8: Factory + Registry

*79 palavras, cerca de 0:34*

> **Padrão e onde:** O segundo é o Factory com Registry, no AppenderFactory.ts.
>
> **Problema:** Queremos criar destinos pelo nome, como file ou console, e deixar o cliente adicionar tipos novos. Um switch dentro da biblioteca teria que ser alterado a cada tipo, o que fere o princípio aberto e fechado.
>
> **Como funciona:** A fábrica guarda um mapa de nomes para criadores. Console, memory e file já vêm cadastrados, e o cliente chama register para incluir o webhook.
>
> **Por que adequado:** Foi adequado porque estender não exige mexer na biblioteca.

**Na tela:** AppenderFactory.ts: o mapa de criadores e os métodos register() e create(); depois a linha register("webhook") do custom.ts.

### Fechamento

*70 palavras, cerca de 0:30*

> Para fechar: a logweave é uma biblioteca, e não um serviço, com implementações prontas e oito padrões que trabalham juntos. O Builder monta o logger, o Observer notifica os destinos, a corrente filtra, e Strategy, Decorator e Template Method dão forma e fluxo à saída. Tudo é extensível sem alterar o código da biblioteca. O código, a documentação e os nomes completos da equipe estão no README do repositório. Obrigado!

**Na tela:** Voltar ao README no GitHub, mostrando a tabela dos 8 padrões, os nomes da equipe e a documentação de uso.

---

## Antes e depois de gravar

### Checklist para os comandos que serão mostrados

- [ ] Na pasta do projeto: `npm install` e `npm test` (11 testes passando).
- [ ] `npm run example:basic` e `npm run example:custom` rodam sem erro.
- [ ] Editor com as abas abertas na ordem em que serão mostradas: README, basic.ts, custom.ts e os 8 arquivos dos padrões.

### Depois que o vídeo estiver pronto

- [ ] Confirmar que a duração final é **menor ou igual a 10:00**.
- [ ] Publicar no YouTube. Pode ficar como **Não listado**.
- [ ] Abrir o `README.md`, trocar o texto "a ser adicionado" na seção "Vídeo de apresentação" pelo link e salvar.
- [ ] Enviar a mudança: `git add README.md`, `git commit -m "docs: adiciona link do vídeo"` e `git push`.
- [ ] Abrir o link do repositório em uma **aba anônima** e conferir: nomes completos dos 4 alunos, link do vídeo funcionando e documentação de uso.
- [ ] Entregar **somente o link do repositório**, até o prazo final de 18/11.