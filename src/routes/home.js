const router = require('koa-router')()
const { parseResult, jsonParse } = require('../services/markdown')
const usersService = require('../services/users')

router.get('/', async (ctx, next) => {
    let body = await parseResult()
    let user = await usersService.getUserByName('admin01')
    console.log(user)
    await ctx.render('index', {
        title: '首页',
        body,
        jsonParse
    })
})

module.exports = router
