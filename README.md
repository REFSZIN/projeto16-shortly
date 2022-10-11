<h1 align="center">
  Shortly
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/Postgres-316192?style=for-the-badge&logo=Postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/JavaScript-FFFF00?style=for-the-badge&logo=javaScript&logoColor=black" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" height="30px"/>
  
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>
<h2>Librariess<h2>

- [express](https://www.npmjs.com/package/express)
- [cors](https://www.npmjs.com/package/cors)
- [jwt-simple](https://www.npmjs.com/package/jwt-simple)
- [chalk](https://www.npmjs.com/package/chalk)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [dayjs](https://www.npmjs.com/package/dayjs)
- [postgresql](https://www.npmjs.com/package/postgres)
- [joi](https://www.npmjs.com/package/joi)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [uuid](https://www.npmjs.com/package/uuid)
- [nodemon](https://www.npmjs.com/package/nodemon)

<br/>

# Description

Shortly is a back-end application, an REST API FULL.

</br>

## Features

-   User sign-up and sign-in
-   Create cart.
-   Order Checkout by Cart User id.
-   View products.

</br>

## API Reference

### User Sign Up

```
https:/projeto16-shortly.vercel.app/
POST /auth/sign-up
```

#### Request:

| Body            | Type     | Description                     |
| :-------------- | :------- | :------------------------------ |
| `name`          | `string` | **Required**. user name         |
| `email`         | `string` | **Required**. user email        |
| `password`      | `string` | **Required**. user password     |
| `confirmPass`   | `string` | **Required**. user confirmpass  |

#### Response:

```json
{
  "message": "User successfully registered!"
}
```
`confirmPass must match password`

#

### User Sign In

```
https://projeto14-smartcell-store-front.vercel.app/
POST /auth/sign-ip
```

#### Request:

| Body            | Type     | Description                     |
| :-------------- | :------- | :------------------------------ |
| `email`         | `string` | **Required**. user email        |
| `password`      | `string` | **Required**. user password     |

#### Response:

```json
{
  "token": "bcript authorization token"
}
```

#
### User Sign In

```
https://projeto14-smartcell-store-front.vercel.app/
POST /products
```

#### Request:

| Body            | Type     | Description                     |
| :-------------- | :------- | :------------------------------ |

#### Response:

```json
{
  [...Products]
}
```

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`
`PORT = number #recommended:5000` 
</br>

## Run Locally
Clone the project
```bash
  git clone 
```
Go to the project directory
```bash
  cd projet
```
Install dependencies
```bash
  npm install
```
Start the server
```bash
  npm run dev
```
Run tests
```bash
  npm test
```

## Acknowledgements
-   [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)
</br>

<!-- 
// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests 

DEV OPS
Planejamento: Planejar o produto em sí, PI, iterações/sprints que será necessaria para entregar o produto para o cliente.

Código: Começar a implementação técnica do produto.

Build: Preparar seu produto para rodar.

Teste: Testes automatizados, testes integrados e Testes em outros ambientes.

Release: Lançamento oficial do produto.

Deploy: Subir o codigo para os ambientes. (Devs/Teste Integrado/Homologação/Produção)

Operação/Monitoramento: Operação trabalha junto com monitoramento, é garantir que caso ocorra algum problema,
ele seja corrigido, voltando para a parte do planejamento para que não ocorra novamente.

-->
