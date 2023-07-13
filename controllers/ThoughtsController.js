const Thought = require('../models/Thought')
const User = require('../models/User')
const {Op} = require('sequelize')

module.exports = class ThoughtsController{
    static async showThoughts(req, res) {
        let search = ''

        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%`}
            },
            order: [['CreatedAt', order]]
        })
        const thoughts = thoughtsData.map((result) => result.get({plain: true}))
        let count = thoughts.length
        if(count === 0){
            count = false
        }
        res.render('thoughts/home', {thoughts, search, count})
    }

    static async dashboard(req, res) {
        const UserId = req.session.userid

        if(typeof(UserId) === 'undefined'){
            return
        }

        const user = await User.findOne({
            where: {id: UserId},
            include: Thought,
            plain: true
        })

        const thoughts = user.Thoughts.map((result) => result.dataValues)
        let emptyThoughts = false

        if(thoughts.length === 0){
            emptyThoughts = true
        }

        res.render('thoughts/dashboard', {thoughts, emptyThoughts})
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thought.create(thought)
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }
        
        
    }

    static async removeThought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid
        
        try {
            await Thought.destroy({where: {id: id, UserId: UserId}})
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async editThought(req, res) {
        const id = req.params.id
        const thought = await Thought.findOne({where: {id: id}, raw: true})
        res.render('thoughts/edit', {thought})
    }
    
    static async editThoughtSave(req, res) {
        const id = req.body.id
        const thought = {
            title: req.body.title
        }

        try {
            await Thought.update(thought, {where: {id: id}})
            req.flash('message', 'Pensamento editado com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }
    }
}