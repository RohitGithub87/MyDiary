const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

//load Story model
require('../models/Story');
const Story = mongoose.model('stories');


//edit story route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      if (story.user != req.user.id) {
        req.flash('error_msg', 'Not Authorised');
        res.redirect('/stories');
      } else {
        res.render('stories/edit', {
          story: story
        });
      }
    });
});

//stories index route
router.get('/', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});


//add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//add story process form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'please add some details' });
  }

  if (errors.length > 0) {
    res.render('stories/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user : req.user.id
    }
    new Story(newUser)
      .save()
      .then(story => {
        req.flash('success_msg', 'Your MyStory has been added')
        res.redirect('/stories');
      });
  }
});

//edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      //new values

      story.title = req.body.title;
      story.details = req.body.details;

      story.save()
        .then(story => {
          req.flash('success_msg', 'Your MyStory has been updated');
          res.redirect('/stories');
        });
    });
});

//delete story process
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Your MyStory has been successfully removed');
      res.redirect('/stories');
    });
});


module.exports = router;