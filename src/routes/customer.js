const express = require('express')
const router = express.Router()

const customerController = require('../controllers/customer')

router.get('/', customerController.findAll)
router.get('/:id', customerController.findById)
router.post('/:id/address', customerController.addNewAddress)
router.post('/', customerController.create)
router.put('/:id', customerController.updateById)
router.delete('/:id', customerController.deleteById)

module.exports = router