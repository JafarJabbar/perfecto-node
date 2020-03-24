import express from 'express';
import config from '../../env';
import {con} from '../../classes/mysqlConn';
import configs from '../../../models/models/configs'
import restaurants from '../../../models/models/restourants'
import crypto from 'crypto';
import jwt from 'jsonwebtoken';


import {Validator} from 'node-input-validator';

con
    .authenticate()
    .then(() => {
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const route=()=>{
    const router=new express.Router();
    router.route('/auth/signup').post((req, res, next) => {
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
                let {name,email,phone,password,repass,address,voen,card}=req.body;
                const v = new Validator(req.body, {
                    email: 'required|email',
                    password: 'required|string',
                    repass: 'required|string|same:password',
                    name: 'required|string',
                    address: 'required|string',
                    phone: 'required|string',
                    voen: 'required|string',
                    card: 'string',
                });
                v.check().then((matched) => {
                    if (!matched) {
                        return res.send({
                            status:false,
                            code:422,
                            type:'Validation error message',
                            message:v.errors
                        });
                    }
                }).catch((error)=>{
                    console.log(error)
                });

                restaurants().findAll({
                    where:{
                        email:email
                    }
                })
                    .then((res3)=>{
                        if (res3.length){
                            return res.send({
                                status:false,
                                code:422,
                                type:'Unique error',
                                message:"Bu email ilə artıq restoran mövcuddur."
                            });

                        }
                    }).catch((err)=>{
                    return res.send({
                        status:false,
                        code:400,
                        type:'Undefined error',
                        message:err.message
                    });
                });
                restaurants().findAll({
                    where:{
                        phone:phone
                    }
                })
                    .then((res3)=>{

                        if (res3.length>0){
                            return res.send({
                                status:false,
                                code:422,
                                type:'Unique error',
                                message:"Bu telefon nömrəsi ilə artıq restoran mövcuddur."
                            });
                        }
                    }).catch((err)=>{
                    return res.send({
                        status:false,
                        code:400,
                        type:'Undefined error',
                        message:err.message
                    });
                });
                restaurants().findAll({
                    where:{
                        voen:voen
                    }
                })
                    .then((res3)=>{

                        if (res3.length>0){
                            return res.send({
                                status:false,
                                code:422,
                                type:'Unique error',
                                message:"Bu VÖEN ilə artıq restoran mövcuddur."
                            });
                        }
                    }).catch((err)=>{
                    return res.send({
                        status:false,
                        code:400,
                        type:'Undefined error',
                        message:err.message
                    });
                });

                restaurants().create({name:name,login_id:login,email:email,phone:phone,voen:voen,address:address,token:token,card:card,password:crypto.createHmac('sha256', config.passSecret)
                        .update(password)
                        .digest('hex')})
                    .then(
                        (res2)=>{
                            return res.send({
                                status:true,
                                code:200,
                                type:'success',
                                data:res2
                            })
                        }
                    ).catch(
                        (err)=>{
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
