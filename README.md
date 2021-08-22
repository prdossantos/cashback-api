# Api Rest Cashback
Desafio – “Eu revendedor ‘O Boticário’ quero ter benefícios de acordo com o meu volume de vendas”. 


## Architecture:
Linguagem: NodeJs com framework ExpressJs

Banco de Dados: MongoDB

Demo: [https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0](https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0)

## Como usar localmente:
1. Clone este repositório e execute o comando: ```npm install && npm run dev```.
2. Você precisa de uma conexão com o MongoDB
3. Você pode alterar a conexão de acesso do MongoDB no arquivo ```.env```.

*Por padrão o projeto irá rodar na porta: 8080( [http://localhost:8080](http://localhost:8080) ), isso também é uma variável no ```.env```.

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
 - Swagger [https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0](https://app.swaggerhub.com/apis/Test8685/cashback-api/1.0.0)
 - Localmente, acessando o arquivo ```./openapi.yml```.

## Como rodar os testes:
Para rodar os testes utilize o camando abaixo:

Isso irá rodar todos os testes
```npm run test -- --verbose```

Também será gerado um relatório de cobertura de código na pasta ```./coverage```.
Você pode visualizar no navegador acessessando ```./coverage/lcov-report/index.html```