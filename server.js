const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
//for path.join
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express.static is middleware function that can take all of the contents of a folder and serve them as static assets.
app.use(express.static(path.join(__dirname, 'public')));

//for handlebars template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
// when force: is true, it drops and re-creates all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
