# Gadgets Inventory Management Backend Server

This is a Gadgets inventory management backend project. The goal of this project is to implement an electric gadgets management backend. User can login and add products, sale the products, track their sales and view the products with a robust filterring system.

### [Live Site Link](https://gadgets-inventory-management-backend.vercel.app)

## Technology

1.  NodeJS
2.  ExpressJS
3.  Mongoose
4.  TypeScript
5.  Jsonwebtoken

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).
- MongoDB Compass (optional: if you want to use mongodb localy).

### Installation

1. Clone this repo:
   - `git clone https://github.com/Porgramming-Hero-web-course/l2-b2-assignment-6-backend-NaZmuZ-SaKiB.git`
2. Install all necessary dependencies:
   - `cd l2-b2-assignment-6-backend-NaZmuZ-SaKiB`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

   - `NODE_ENV` = development/ production
   - `PORT` = (any port number)
   - `DATABASE_URL` = (your database url for connection)
   - `BCRYPT_SALT_ROUNDS` = 12
   - `FRONT_END_URL` = front end url
   - `JWT_ACCESS_SECRET` = secret for jwt
   - `JWT_ACCESS_EXPIRES_IN` = jwt expire time
   - Go to `./src/app/modules/user/user.controller.ts` file and find signin function.
     Comment the line `sameSite: none` if you are using it in development mode.

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:
   - `npm run start` or `yarn start`

### Endpoints

- **POST /api/users/sign-in** : User login.
- **POST /api/users/sign-out** : User logout.
- **POST /api/users/sign-up** `Role: admin, manager` : Create a new user.
- **GET /api/users/** `Role: admin` : Get all Users with role `user`, `manager`.
- **GET /api/users/status** : Check is user logged in.
- **PATCH /api/users/assign-manager** `Role: admin` : Toggle User's role between `user` and `manager`.
- **POST /api/categories/** : Create new category.
- **GET /api/categories/** : Get all category.
- **POST /api/brands/** : Create new brand.
- **GET /api/brands/** : Get all brand.
- **POST /api/sales/** : Create new sale.
- **GET /api/sales/** : Get all sale.
- **GET /api/sales/count** : Returns all sales count if user role is `admin` or `manager`. Othere wise only sales of the requested user.
- **POST /api/products/** : Create new product.
- **GET /api/products/** : Get all products.
- **GET /api/products/stock-count** : Returns all sotck count if user role is `admin` or `manager`. Othere wise only stock of the requested user.
- **GET /api/products/purchase-count** : Returns count of all product purchased in last 30 days if user role is `admin` or `manager`. Othere wise only products of the requested user.
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
