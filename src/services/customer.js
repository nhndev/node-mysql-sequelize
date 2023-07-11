const { Op } = require('sequelize')

const { Customer, Address } = require('../models/index')

const NotFoundException = require('../exception/NotFoundException')
const BadRequestException = require('../exception/BadRequestException')

const customerService = {
    findAll: ({page, limit, orderBy, sortBy, keyword}) => new Promise(async (resolve, reject) => {
        try {

            const query = {}

            if (keyword) {
                query.email = {[Op.substring]: keyword}
            }

            const queries = {
                offset: (page - 1) * limit,
                limit
            }       

            if (orderBy) {
                queries.order = [[orderBy, sortBy]]
            }

            
            const data = await Customer.findAndCountAll({
                where: query,
                ...queries
            })

            const res = {
                totalPages: Math.ceil(data?.count / limit),
                totalItems: data?.count,
                data: data?.rows
            }

            resolve(res)

        } catch (error) {
            reject(error)
        }
    }),
    findById: (id) => new Promise(async (resolve, reject) => {
        try {
            
            const data = await Customer.findByPk(id, {
                include: [
                    { model: Address, as: 'addresses' }
                ]
            })
            if (!data) throw new NotFoundException('Not found customer!')
           
            resolve(data)

        } catch (error) {
            reject(error)
        }
    }),
    create: ({fullName, email, phoneNumber, addressList}) => new Promise(async (resolve, reject) => {
        try {
            
            const customer = await Customer.findOne({where: { email }})
            if (customer) throw new BadRequestException(`Email ${email} already exists`)

            const data = await Customer.create({
                fullName, email, phoneNumber,
                addresses: addressList
            }, {
                include: [ { model: Address, as: 'addresses' } ]
            })

            resolve(data)

        } catch (error) {
            reject(error)
        }
    }),
    addNewAddress: (customerId, {city, state, street, zipcode}) => new Promise(async (resolve, reject) => {
        try {
            
            const customer = await Customer.findByPk(customerId)
            if (!customer) throw new NotFoundException('Not found customer!')

            const data = await Address.create({
                city, state, street, zipcode,
                customerId
            })

            resolve(data)

        } catch (error) {
            reject(error)
        }
    }),
    updateById: (id, {fullName, phoneNumber}) => new Promise(async (resolve, reject) => {
        try {
            
            const customer = await Customer.findByPk(id)
            if (!customer) throw new NotFoundException('Not found customer!')

            const data = await Customer.update({ fullName, phoneNumber }, {
                where: {
                  id
                }
            });

            resolve(data)

        } catch (error) {
            reject(error)
        }
    }),
    deleteById: (id) => new Promise(async (resolve, reject) => {
        try {
            
            const customer = await Customer.findByPk(id)
            if (!customer) throw new NotFoundException('Not found customer!')

            const data = await Customer.destroy({
                where: {
                    id
                }
              });
           
            resolve(data)

        } catch (error) {
            reject(error)
        }
    }),
}

module.exports = customerService