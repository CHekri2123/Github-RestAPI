

import Route from '@ioc:Adonis/Core/Route'



Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/login','RestApisController.loginGithub')
Route.group(()=>{
  Route.post('/users', 'RestApisController.userBasicInfo').middleware('token')
  Route.post('/repo','RestApisController.listUserPublicRepoData').middleware('token')
  Route.post('/branches','RestApisController.listUserRepositoryBranches').middleware('token')
  Route.post('/listPullRequests','RestApisController.listPullRequest').middleware('token')
  Route.post('/listCommits','RestApisController.listCommits').middleware('token')
}).prefix('github')
