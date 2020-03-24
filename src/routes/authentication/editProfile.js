import express from 'express';
import config from '../../env';
import {con} from '../../classes/mysqlConn';
import configs from '../../../models/models/configs'
import restaurants from '../../../models/models/restourants'


import {Validator} from 'node-input-validator';
import {Op} from "sequelize";

con
    .authenticate()
    .then(()=>{

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const route=()=>{
    const router=new express.Router();
    router.route('/auth/edit').post((req, res) => {
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
                let {name,id,address,voen,card,feedback}=req.body;
                const v = new Validator(req.body, {
                    name: 'required|string',
                    address: 'required|string',
                    voen: 'required|string',
                    feedback: 'string',
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
                        voen:voen,
                        id:{[Op.ne]:id}
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
                restaurants().findAll({
                    where:{
                        token:req.headers.token
                    }
                })
                    .then((res3)=>{
                        if (res3.length>0){
                        restaurants().update({name:name,voen:voen,address:address,card:card,feedback: feedback},
                            {
                                where:{
                                    id:id
                                }
                            })
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
                        }else {
                            return res.send({
                                status:false,
                                code:401,
                                type:'Unauthorized error',
                                message:"Belə istfadəçi tapılmadı!"
                            })
                        }

                    }).catch((err)=>{
                    return res.send({
                        status:false,
                        code:400,
                        type:'Undefined error',
                        message:err.message
                    });
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
    });
    return router;
};

export default {
    route,
    routePrefix: `/${config.version}`
}
