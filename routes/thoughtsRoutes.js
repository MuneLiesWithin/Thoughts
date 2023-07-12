const { Router } = require('express')
const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')
const checkAuth = require('../helpers/auth').checkAuth

router.post('/add', checkAuth, ThoughtsController.createThoughtSave)
router.get('/add', checkAuth, ThoughtsController.createThought)
router.get('/edit/:id', checkAuth, ThoughtsController.editThought)
router.post('/edit', checkAuth, ThoughtsController.editThoughtSave)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)
router.post('/remove', checkAuth, ThoughtsController.removeThought)
router.get('/', ThoughtsController.showThoughts)

module.exports = router