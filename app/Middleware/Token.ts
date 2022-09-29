import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import RestApisController from 'App/Controllers/Http/RestApisController'
let jwt = require('jsonwebtoken');

export default class Token {
  public async handle({request, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    // const controller = new RestApisController();
    // const token = controller.jwtTokenGeneration()
    // console.log('token')
    // console.log(token)
    const headerData = request.headers()
    const tokenProvided = headerData.token
    
    
    // try {
    //   jwt.verify(tokenProvided,process.env.APP_KEY)

    //   await next()

    // } catch (error) {

    //   return response.json({error})

    // }

    await jwt.verify(tokenProvided,process.env.APP_KEY, async (error) => {
      if(error){
        return response.json({error})
      }
      else{
        // console.log("I am in")
        return await next()
      }
    })
    
  }
}
