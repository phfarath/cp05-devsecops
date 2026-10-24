# CP05 - Pipeline DevSecOps completo

Projeto preparado a partir dos quatro slides da AULA 19 (CP05). O site é estático e não exige AWS. Esta pasta contém código e instruções; não contém evidências de execução no GitHub.

## O que cada arquivo faz

- `site/`: HTML, CSS e JavaScript do site.
- `Dockerfile`: serve o site com Nginx sem privilégios de root na porta 8080.
- `.github/workflows/security.yml`: três jobs independentes em push, pull request e execução manual.
- `.gitleaks.toml`: mantém as regras padrão e acrescenta um marcador fictício específico da atividade.
- `.semgrep.yml`: regra de análise de JavaScript que reprova chamadas a `eval`.
- `ROTEIRO.md`: publicação e provas de sabotagem.
- `RELATORIO.html`: modelo editável, com explicações e espaços para prints reais; depois pode ser impresso em PDF.

O terceiro job, Trivy, cobre a exigência do cenário de barrar imagem com CVE crítico. O slide 3 diz “3 jobs”, mas só nomeia Gitleaks e Semgrep. Essa interpretação deve ser confirmada com o professor caso ele forneça outro requisito.

## Executar o site

Abra `site/index.html` no navegador. Para testar o contêiner, com Docker Desktop em execução:

```sh
docker build --pull -t cp05-site .
docker run --rm -p 8080:8080 cp05-site
```

Acesse http://localhost:8080. Para encerrar, pressione Ctrl+C.

## Como as barreiras reprovam

Gitleaks examina os commits alcançáveis por HEAD e retorna código 1 quando encontra um segredo. A opção `--redact` oculta o valor no log. Apagar um segredo em um commit posterior não elimina seu registro histórico.

Semgrep analisa `site/` com a regra local `cp05-no-eval`. `--error` reprova o job se houver achados, e `--strict` trata erros de análise como falhas. A regra tem escopo didático: não equivale a uma auditoria completa de todas as vulnerabilidades de JavaScript.

Trivy analisa a imagem construída do Dockerfile, consulta sua base de vulnerabilidades e retorna código 1 quando encontra severidade CRITICAL, inclusive sem correção disponível. Uma falha de download, configuração ou construção não é prova de detecção de CVE.

As Actions executam depois do push: não impedem o commit local nem desfazem seu envio. Para impedir integração de código reprovado, é necessário configurar os checks como obrigatórios na proteção da branch principal. Não há deploy automático neste projeto.

## Versões e resultado limpo

A imagem do site usa a tag de manutenção `stable-alpine`. Semgrep e Trivy usam versões atuais. Tags e bases de CVEs podem mudar, então um resultado limpo deve ser comprovado na execução real. Se Trivy encontrar um CRITICAL, atualize a imagem base para uma versão corrigida e rode novamente; não remova a barreira nem ignore a vulnerabilidade apenas para obter verde.

## Referências oficiais

- https://github.com/gitleaks/gitleaks
- https://docs.semgrep.dev/cli-reference
- https://github.com/aquasecurity/trivy-action
- https://github.com/nginx/docker-nginx-unprivileged
