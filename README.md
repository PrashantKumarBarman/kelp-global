## Tech stack
- Below technologies have been used
- Mysql
- NodeJS
- ExpressJS
- Sequelize ORM

## How to run
- Run `npm install`
- Copy `.env.local` file to file named `.env`
- Edit the values accrodingy in `.env` file
- `app.js` at the root is the entry point of the application, is this script needs to be executed to start the application/web server
- Run either `npm run start` or `nodemon` or `node app.js`
- Open postman collection present at the root of the project(filename - `Kelp-Global.postman_collection.json`)
- Use the csv-to-json api endpoint

## Environment Variables
| Name           | Default value | Description |
| -------------- | ------------- | ----------- |
| PORT           | 3000          | Port of the web server |
| MYSQL_HOST     | localhost     | Hostname for Mysql |
| MYSQL_PORT     | 3306          | Port for Mysql |
| MYSQL_USER     |               | Username for Mysql |
| MYSQL_PASSWORD |               | Password for Mysql user |
| MYSQL_DATABASE |               | Datbase name for Mysql |

