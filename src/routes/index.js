const router = require('koa-router')()
const fs = require('fs')
const drafter = require('drafter')
const normalizeNewline = require('normalize-newline')

router.get('/', async (ctx, next) => {
    let dir = `${__dirname}/../../upload/`
    let fileNameList = await new Promise((resolve, reject) => {
        fs.readdir(dir, (err, content) => {
            if (err) {
                return reject(err)
            }
            resolve(content)
        })
    })

    let result = await (async () => {
        let arr = []
        let count = 0
        await new Promise((resolve, reject) => {
            fileNameList.forEach(async (fileName, index) => {
                let result = await new Promise((resolve, reject) => {
                    fs.readFile(`${dir}/${fileName}`, 'utf-8', (err, content) => {
                        if (err) {
                            return reject(err)
                        }
                        resolve(content)
                    })
                })
                if (result) {
                    let str = await drafter.parse(normalizeNewline(result), { type: 'ast' }, (err, result) => {
                        if (err) return err
                        return result
                    })
                    arr.push(str)
                }
                count++
                if (count === fileNameList.length) resolve(arr)
            })
        })
        return arr
    })()
    console.log(result)
    let arr = []
    result.forEach(item => {
        arr.push(item.ast)
        // console.log(1, item.ast.resourceGroups[0].resources[0], 1212)
    })

    await ctx.render('index', {
        title: 'Hello Koa 2!',
        body: arr
    })
})

module.exports = router
