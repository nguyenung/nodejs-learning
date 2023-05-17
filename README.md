# Nodejs learning

> We learn nothing by being right.

Build a awesome online shop web application using Express Framework from scratch.

The source code in this project is referenced from the course `NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)` by Maximilian Schwarzmüller via Udemy.

## Installation

Instructions on how to install this project.

1. Clone the repository:

   ```bash
   git clone git@github.com:nguyenung/nodejs-learning.git
   ```

2. Install dependencies:
   - _Using npm:_

   ```bash
   npm install
   ```

   - _Using make:_

   ```bash
   make install
   ```

3. Create .env file from .env.example and fill database credential

   ```bash
   cp .env.example .env
   ```

4. Run database migrate

   ```bash
   npx sequelize db:migrate                                            
   ```

## Usage

Instructions on how to use this project.

1. Start the server:
   - _Using npm:_ `npm run watch` or `npm start`
   - _Using make:_ `make watch` or `make start`

2. Open `http://localhost:3000` in your browser
