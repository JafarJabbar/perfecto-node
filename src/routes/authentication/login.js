import express from 'express';
import config from '../../env';
import {con} from '../../classes/mysqlConn';
import jwt from 'jsonwebtoken';
import configs from "../../../models/models/configs";
import {Validator} from "node-input-validator";
import restaurants from "../../../models/models/restourants";
import crypto from "crypto";
import * as Op from "sequelize";


con
    .authenticate()
    .then(() => {
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const route=()=>{
    const router=new express.Router();
    router.route('/auth/login').post((req, res, next) => {
        const token=jwt.sign({rand:Math.random()}, config.jwtSecret);
        const login=Math.floor(Math.random()*100000000);
        configs().findAll({
            limit:1,
            where:{
                id:1
            },
        }).then((configure)=>{
            if (req.headers.appkey!=configure[0].app_key){
                return res.send({
                    status:false,
                    code:401,
                    type:'Unauthorized error',
                    message:"Belə istfadəçi tapılmadı!"
                })
            }else{
                let {password,login}=req.body;
                const v = new Validator(req.body, {
                    login: 'required|string',
                    password: 'required|string'
                });
                v.check().then((matched) => {
                    if (!matched) {
                        return res.send({
                            status:false,
                            code:422,
                            type:'Validation error',
                            message:v.errors
                        });
                    }
                }).catch((error)=>{
                    console.log(error)
                });
                restaurants().findAll({
                    where:{
                        password:crypto.createHmac('sha256', config.passSecret).update(password).digest('hex'),
                        email:login
                },
                }).then((res4)=>{
                    if (res4.length>0){
                        restaurants().update({token:token},{
                            where:{
                                id:res4[0].id
                            }
                        }).then((res5)=>{
                            return res.send({
                                status:true,
                                code:200,
                                type:'success',
                                token:token
                            })

                        }).catch((err)=>{
                            return res.send({
                                status:false,
                                code:400,
                                type:'Undefined error',
                                message:err.message
                            });
                        })
                    }else {
                    return res.send({
                            status:false,
                            code:401,
                            type:'Unauthorized error',
                            message:"Belə istfadəçi tapılmadı!"
                        })
                    }
                }).catch(  (err)=>{
                    return res.send({
                        status:false,
                        code:400,
                        type:'Undefined error',
                        message:err.message
                    });
                })
            }
        }).catch(   (err)=>{
            return res.send({
                status:false,
                code:400,
                type:'Undefined error',
                message:err.message
            });
        });
    });
    return router;
};


export default {
    route,
    routePrefix: `/${config.version}`
}
