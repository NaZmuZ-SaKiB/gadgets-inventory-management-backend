# Gadgets Inventory Management Backend Server

This is a **Node JS** backend server build using **Express Js**. Here I have used **Mongoose** as ODM Library. All the codes are written in **TypeScript**. I have utilized **Eslint** for better linting and **Prettier** for better code formating to make code readable.

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).
- MongoDB Compass (optional: if you want to use mongodb localy).

### Installation

1. Clone this repo:
   - `git clone https://github.com/Porgramming-Hero-web-course/l2b2-full-stack-a5-server-side-NaZmuZ-SaKiB.git`
2. Install all necessary dependencies:
   - `cd l2b2-full-stack-a5-server-side-NaZmuZ-SaKiB`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

- `NODE_ENV` = development
- `PORT` = (any port number)
- `DATABASE_URL` = (your database url for connection)
- `BCRYPT_SALT_ROUNDS` = 12
- `FRONT_END_URL` = front end url
- `JWT_ACCESS_SECRET` = secret for jwt
- `JWT_ACCESS_EXPIRES_IN` = jwt expire time

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:
   - `npm run start` or `yarn start`

### Endpoints

- **POST /api/users/sign-in** : usre login.
- **POST /api/users/sign-up** : Create a new user.
- **GET /api/users/status** : Check is user logged in.
- **POST /api/categories/** : Create new category.
- **GET /api/categories/** : Get all category.
- **POST /api/brands/** : Create new brand.
- **GET /api/brands/** : Get all brand.
- **POST /api/sales/** : Create new sale.
- **GET /api/sales/** : Get all sale.
- **POST /api/products/** : Create new product.
- **GET /api/products/** : Get all products.
- **GET /api/products/stock-count** : Get in stock product count.
- **GET /api/products/:id** : Get product by id.
- **PATCH /api/products/:id** : Update product by id.
- **DELETE /api/products/** : Delete Products.

### Deployment

1. Build the project.
2. Install Vercel CLI:
   - `npm i -g vercel` or `yarn global add vercel`
3. Log in to vercel:
   - `vercel login`
4. For first time deploy run `vercel`
5. For next deploys:
   - Build the project each time.
   - Run: `vercel --prod`
