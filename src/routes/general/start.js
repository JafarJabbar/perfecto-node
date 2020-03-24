import express from 'express';
import config from '../../env';
import configs from '../../../models/models/configs'
import jwt from 'jsonwebtoken';
import {where} from "sequelize";
let  api_key=jwt.sign({rand:Math.random()},config.jwtSecret);

const route=()=>{
    const router=new express.Router();
    setInterval(()=>{
         api_key=jwt.sign({rand:Math.random()},config.jwtSecret)
    },24*60*60*1000);
    router.route('/app/start').post((req, res) => {
        configs().update({app_key:api_key,lang:'az'},
            {
                where:{
                    id:1
                }
            }
              )
            .then(
                (res1)=>{
                    res.send({
                        status:true,
                        code: 200,
                        type:'success',
                        api_key:api_key,
                    });
                },
                (err)=>{
                    res.send({
                        status:false,
                        code: 400,
                        type:'undefined error',
                        message:err.message,
                    });

                }

            )
    });

    return router;
};

export default {
    route,
    routePrefix: `/${config.version}`
}
