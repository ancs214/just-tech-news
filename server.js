const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
//for path.join
const path = require('path');
//HANDLEBARS
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
//EXPRESS-SESSION AND CONNECT-SESSION-SEQUELIZE (sets up an express.js session and connects the session to our sequelize database)
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super duper secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express.static is middleware function that can take all of the contents of a folder and serve them as static assets.
app.use(express.static(path.join(__dirname, 'public')));

//for handlebars template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//express-session and sequelize store
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
// when force: is true, it drops and re-creates all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
