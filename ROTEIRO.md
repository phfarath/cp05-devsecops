# Roteiro de execução e entrega

## 1. Criar o repositório

1. Entre no GitHub e crie um repositório vazio chamado `cp05-devsecops`.
2. Extraia o ZIP. A raiz do repositório deve conter o Dockerfile e a pasta `.github`, sem uma pasta `cp05-devsecops` extra envolvendo tudo.
3. Abra essa pasta no VS Code e use seu terminal. Os comandos abaixo pressupõem Git instalado. Troque SEU-USUARIO pelo seu usuário do GitHub.

```sh
git init -b cp05-implementacao
git add .
git commit -m "Implementa site e pipeline da CP05"
git remote add origin https://github.com/SEU-USUARIO/cp05-devsecops.git
git push -u origin cp05-implementacao
```

A primeira branch do repositório vazio será `cp05-implementacao`. No GitHub, crie uma branch chamada `main` a partir dela e configure `main` como branch padrão em Settings. Assim, todos os commits foram feitos numa branch de trabalho. As próximas mudanças entram por branch e pull request.

Se o Git solicitar nome e email, configure sua identidade antes de repetir o commit. Se pedir autenticação, faça login pelo fluxo oficial do GitHub, sem colocar tokens nos arquivos.

4. Abra Actions > Security Pipeline. Espere os três jobs terminarem.
5. Guarde o link da execução e um print mostrando os três resultados. Só descreva como aprovado se todos estiverem verdes.

## 2. Prova do Gitleaks

No GitHub, selecione a branch `main`, abra o seletor de branches e crie `teste/gitleaks`. Nessa branch, use Add file > Create new file para criar `segredo-falso.txt` contendo UMA linha com o prefixo abaixo imediatamente seguido de 24 letras A, sem espaço ou quebra de linha:

Prefixo: `CP05_TEST_SECRET_`

Sufixo: `AAAAAAAAAAAAAAAAAAAAAAAA`

Junte as duas partes no arquivo. Esse marcador é fictício e não autentica em nenhum serviço. O modelo não mantém o valor completo nos arquivos originais para evitar que a versão limpa seja reprovada.

Faça commit apenas em `teste/gitleaks`. Abra Actions e selecione a execução dessa branch. O job Gitleaks deve reprovar, identificando `cp05-segredo-ficticio` e o arquivo. Registre print e link da execução.

Não faça merge dessa branch. Como o scanner lê o histórico, remover o arquivo em outro commit dessa mesma branch não deixa o histórico limpo.

## 3. Prova do Semgrep

Volte ao seletor de branches, escolha `main` novamente e crie `teste/semgrep` A PARTIR DE MAIN, sem herdar o teste anterior.

Crie `site/sabotagem.js` com:

```javascript
function executarEntrada(entrada) {
  return eval(entrada);
}
```

O arquivo não precisa ser referenciado no HTML nem executado: a análise é estática. Faça commit apenas nessa branch. Abra a execução correspondente em Actions. O job Semgrep deve reprovar com a regra `cp05-no-eval`, apontando o arquivo e a linha.

Registre print e link. Não faça merge dessa branch. Para mostrar uma correção, substitua o conteúdo do arquivo por uma operação explícita adequada ao seu objetivo e faça novo commit na mesma branch; por exemplo, uma função que converta texto em número usando `Number(entrada)`, quando essa for a função desejada.

## 4. Trivy

Na execução da branch limpa, abra o job Trivy e registre a tabela de vulnerabilidades e seu resultado. A ausência de CVE crítico naquela execução prova que a imagem foi verificada, mas não demonstra sozinha o bloqueio de uma imagem vulnerável.

Os slides pedem explicitamente duas provas (segredo e eval). Se o professor também pedir sabotagem da imagem, crie uma terceira branch a partir de main e substitua temporariamente a base por uma versão antiga que tenha CVE CRITICAL comprovado pelo scanner. O teste precisa mostrar um CVE crítico real e falha da etapa de análise. Não publique nem execute a imagem vulnerável. Não faça merge dessa branch.

## 5. Montar o PDF

1. Edite `RELATORIO.html` no VS Code, preenchendo nome, RM, turma, repositório e links das execuções.
2. Guarde os prints na pasta `evidencias/` ao lado do relatório com os nomes indicados no HTML.
3. Abra o HTML no navegador. Verifique se os prints aparecem e se o texto corresponde aos resultados reais.
4. Use Ctrl+P > Salvar como PDF. Confira o PDF antes da entrega.
5. Entregue o link do repositório e o PDF, seguindo o canal indicado pelo professor.

Se um job falhar por configuração, download ou autenticação, resolva isso antes de usar o print como prova. A falha tem que apontar o segredo fictício ou a chamada eval.
