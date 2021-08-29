# Api Rest Cashback
App para adquirir benefícios de acordo com o meu volume de vendas. 


## Architecture:
Linguagem: NodeJs com framework ExpressJs

Banco de Dados: MongoDB

## Como usar localmente:
1. Clone este repositório e execute o comando: ```npm install```.
2. Execute o comando: ```npm run dev```.
3. Você precisa de uma conexão com o MongoDB
4. Você pode alterar a conexão de acesso do MongoDB no arquivo ```.env```.

*O arquivo ```.env``` foi enviado para facilitar a vida da pessoa que irá testar, em um ambiente real isso é removido do repositório.

*Por padrão o projeto irá rodar na porta: 8080( [http://localhost:8080](http://localhost:8080) ), isso também é uma variável no ```.env```.

## Use o docker ;)
Caso você tenha o docker e docker-compose instalados, siga os comandos:
1. ```docker-compose build```
2. ```docker-compose up```, isso pode demorar um pouco dependendo do seu PC.
Aguarde as mensaegens: 
 * ```nodejs-api    | app listening on port 8080``` 
 * ```nodejs-api    | MongoDB connected``` 

*Se quiser alterar as portas de conexão utilizando docker, faça isso no arquivo ```docker-compose.yml```

## Como usar remoto:
 Acesse a documentação do swagger e divirta-se ;)
 - [https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0](https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0) 

## Estrutura de pastas:
O projeto segue a seguinte estrutura.

```js
src/
  - controllers   # Contém os controladores de rotas
  - models        # Contém os modelos do Banco de Dados
  - __tests__     # Contém os testes unitário e de integração
```

## REST API Documentação:
A documentação completa está: 
 - Localmente, acessando o arquivo ```./openapi.yml```.

## Como rodar os testes:
Para rodar os testes utilize o camando abaixo:

Isso irá rodar todos os testes
```npm run test -- --verbose```

Também será gerado um relatório de cobertura de código na pasta ```./coverage```.
Você pode visualizar no navegador acessessando ```./coverage/lcov-report/index.html```
