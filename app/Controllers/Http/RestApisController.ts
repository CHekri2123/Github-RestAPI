// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import RestApiValidator from "App/Validators/RestApiValidator";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

let jwt = require('jsonwebtoken');



export default class RestApisController {
  

    public async loginGithub({ request }: HttpContext) {

        const payLoad = await request.validate(RestApiValidator);

        const userName = payLoad['user_name'];

        const password = process.env.GITHUB_TOKEN;

        const config: AxiosRequestConfig = {

            method: 'get',
            url: `https://api.github.com/user`,
            auth: {
                username: userName,
                password: password!
            },
            responseType: "json"

        }

        const responseData: AxiosResponse = await axios(config);

        if (responseData.status == 200) {

            const generateTokenPayLoad = {

                'id': responseData.data.id,
                'node_id': responseData.data.node_id,
                'name': responseData.data.name,
                'email': responseData.data.email,

            }

            const token = jwt.sign(generateTokenPayLoad, process.env.APP_KEY)

            console.log(token)

            return {

                "token": token,
                "loginData": generateTokenPayLoad

            }

        }
    }

    public async userBasicInfo({ request }: HttpContext) {

        const payLoad = await request.validate(RestApiValidator);

        const userName = payLoad['user_name'];

        const userInfo = await axios({

            baseURL: 'https://api.github.com',
            method: 'get',
            url: `/users/${userName}`,


        }).then(

            response => {

                return response.data

            })

        return userInfo
    }

    public async listUserPublicRepoData({ request }: HttpContext) {

        const token = process.env.GITHUB_TOKEN

        const validater = await request.validate(RestApiValidator);

        const userName = validater['user_name'];

        const repoResult = await axios({

            baseURL: `https://api.github.com`,
            method: 'get',
            url: `/users/${userName}/repos`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            auth: {
                username: 'CHekri2123',
                password: 'ghp_ns80WbIPSWURKfDAM0vtYlEEzUXDCw43LPN'
            },

        }).then(
            response => {

                return response.data

            })

        const arrData: string[] = []

        repoResult.forEach(element => {

            arrData.push(element.name)

        });

        return arrData
    }

    public async listUserRepositoryBranches({ request }: HttpContext) {

        const validater = await request.validate(RestApiValidator);

        const ownerName = validater['owner_name']

        const repoName = validater['repo_name']

        const branchResult = await axios(`https://api.github.com/repos/${ownerName}/${repoName}/branches`).then(

            response => {

                return response.data

            }
        )

        const arrData: string[] = []

        branchResult.forEach(element => {

            console.log(element.name)
            arrData.push(element.name)

        });

        return arrData
    }

    public async listPullRequest({ request }) {

        const validater = await request.validate(RestApiValidator);

        const ownerName = validater['owner_name']

        const repoName = validater['repo_name']

        const pullList = await axios(`https://api.github.com/repos/${ownerName}/${repoName}/pulls`).then(
            response => {

                return response.data

            }
        )

        const pullRequestArray: string[] = [];

        pullList.forEach(element => {

            pullRequestArray.push(element.title)

        });
        const pullRequestsCount = pullRequestArray.length

        return {

            pullRequestArray,
            pullRequestsCount

        }

    }

    public async listCommits({ request }: HttpContext) {

        const validater = await request.validate(RestApiValidator);

        const ownerName = validater['owner_name']

        const repoName = validater['repo_name']

        const commitList = await axios(`https://api.github.com/repos/${ownerName}/${repoName}/commits`).then(
            response => {

                return response.data

            })

        const commitsArray: string[] = [];

        commitList.forEach(element => {

            commitsArray.push(element.commit.message)
            
        });

        return commitsArray
    }
}




