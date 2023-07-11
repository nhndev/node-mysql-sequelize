const customerService = require('../services/customer')

const customerController = {
    findAll: async (req, res, next) => {
        try {
            const { page = 1, limit = 3, orderBy = 'email', sortBy = 'asc', keyword } = req.query

            const data = await customerService.findAll({
                page: +page ? +page : 1,
                limit: +limit ? +limit : 3,
                orderBy,
                sortBy,
                keyword
            })
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await customerService.findById(id)
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const { fullName, email, phoneNumber, addressList = [] } = req.body
            const data = await customerService.create({fullName, email, phoneNumber, addressList})
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    },
    addNewAddress: async (req, res, next) => {
        try {
            const { city, state, street, zipcode } = req.body
            const { id } = req.params
            const data = await customerService.addNewAddress(id, {city, state, street, zipcode})
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    },
    updateById: async (req, res, next) => {
        try {
            const { id } = req.params
            const { fullName, phoneNumber } = req.body
            const data = await customerService.updateById(id, {fullName, phoneNumber})
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    },
    deleteById: async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await customerService.deleteById(id)
            return res.json({success: true, data})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = customerController