import { Hono } from 'hono'

import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/assets/*', serveStatic({ root: './' }))
app.get('/', serveStatic({ path: './index.html' }))
app.get('/favicon.ico', serveStatic({path: './favicon.ico'}))

app.get('/api/todos', async (c) => {
  const { results} = await c.env.DB.prepare(`select * from todos`).all()
  return c.json(results)
})

app.post('/api/todo', async (c) => {
  const body = await c.req.json()
  const { success } = await c.env.DB.prepare(`insert into todos (TaskName, TaskStatus) values (?, ?)`)
    .bind(body.name, body.status)
    .run()

  if (success) {
    c.status(200)
    return c.json({
      code: 0
    })
  } else {
    c.status(500)
    return c.json({
      code: -1,
      message: 'something wrong'
    })
  }
})


export default app
