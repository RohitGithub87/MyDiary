const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//express-handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));

//static folder middleware
app.use(express.static(path.join(__dirname, 'public')));

//connect-flash middleware
app.use(flash());

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//passport middleware( after express-session only)
app.use(passport.initialize());
app.use(passport.session());

//passport config 
require('./config/passport')(passport);
//db config
const db = require('./config/database');

//load routes
const stories = require('./routes/stories');
const users = require('./routes/users');

//connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//home page
app.get('/', (req, res) => {
  res.render('index');
});

//about page
app.get('/about', (req, res) => {
  res.render('about');
});

//use routes
app.use('/stories', stories);
app.use('/users', users);

//server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});