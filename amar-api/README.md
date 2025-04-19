# <img src="./src/assets/images/favicon.ico" style="width: 50px"> Amar API

RESTful API built with [NestJS](https://nestjs.com/) for Amar Infâncias' dashboard.

## 🚀 Technologies

![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=flat&logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=flat&logo=swagger&logoColor=white)

## 📚 API Docs

The API documentation is available via Swagger:

```Bash
http://localhost:3000/api
```

## 🛠️ How to set up locally

### Clone repo and access the backend folder:

```bash
cd amar-api
```

### Install dependencies:

```Bash
npm install
```

### Configure .env with your variables (based on .env.example):

```Bash
DATABASE_URL="mysql://usuario:senha@localhost:3306/amar"
JWT_SECRET="sua_chave_secreta"
```

### Run migrations and start server:

```Bash
npx prisma migrate dev
npm run dev
```
