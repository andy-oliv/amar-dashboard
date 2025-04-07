# <img src="./src/assets/images/favicon.ico" style="width: 50px"> Amar API

RESTful API built with [NestJS](https://nestjs.com/) for Amar Infâncias' dashboard.

## 🚀 Technologies

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Swagger](https://swagger.io/)

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
