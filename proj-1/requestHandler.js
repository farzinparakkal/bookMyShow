import movieSchema from './models/r_movie.model.js'
import userSchema from './models/user.model.js'
import bcrypt from 'bcrypt'

import pkg from 'jsonwebtoken'
const {sign} =pkg

export async function addMovie(req,res) {

    console.log(req.body);

    const{...datas}=req.body

    await movieSchema.create({...datas}).then(()=>{
        res.status(201).send({msg:"Successfull"})
    }).catch((error)=>{
        res.status(404).send({error:error})
    })  
    
}

export async function getMovies(req, res) {
    console.log("=================");
    console.log(req.user)

    const usr=await userSchema.findOne({_id:req.user.UserID})
    console.log(usr)

    console.log("get Movies")
    const data = await movieSchema.find();
    console.log(data);
    res.status(200).send({data,user:usr.name}); 
}

export async function getMovie(req,res) {
    console.log(req.params);
    const {id}=req.params;
    const data=await movieSchema.findOne({_id:id})
    console.log(data);

    res.status(200).send(data)
    
    
}

export async function update(req,res) {
    console.log(req.params);
    console.log(req.body);
    const {...data}=req.body
    await movieSchema.updateOne({_id:req.params.id},{$set:{...data}}).then(()=>{
        res.status(201).send({msg:"updated"})
    }).catch((error)=>{
        res.status(500).send({error:error})
        
    })
    
    
    
}

export async function deleteemp(req, res) {
    console.log(req.params); 
    const { id } = req.params;  
    const data = await movieSchema.deleteOne({ _id: id })
        .then(() => {
            res.status(201).send({ msg: "Deleted" });
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
}

export async function adduser(req,res) {
    console.log(req.body);
    const {name,email,pass,cpass}=req.body
    if(!(name&&email&&pass&&cpass))
        return res.status(500).send({msg:"empty input"})
    else if(pass!=cpass)
        return res.status(500).send({msg:"password missmatch"})

    bcrypt.hash(pass,10).then((hpwd)=>{
        console.log(hpwd)
        console.log("data added");
        userSchema.create({name,email,pass:hpwd}).then(()=>{
            res.status(201).send({msg:"Successfull"})
        }).catch((error)=>{
            res.status(404).send({error:error})
        }) 
        
    }).catch((error)=>{
        console.log(error)
        
    }) 
}

export async function login(req,res) {
    console.log(req.body)
    const {email,pass}=req.body

    if(!(email&&pass))
        return res.status(500).send({msg:"empty input"})

    const user= await userSchema.findOne({email})

    if(!user)
        return res.status(500).send({msg:"not exist"})
    const success=await bcrypt.compare(pass,user.pass)
    console.log(success)

    if(success!=true)
        return res.status(500).send({msg:"not exist"})
    const token=await sign({UserID:user._id},process.env.jwt_key,{expiresIn:"24h"})
    console.log(token);
    
    res.status(200).send({token})
}

export async function home(req,res) {
    console.log("end point")
    console.log(req.user.UserID)
    const user=userSchema.findOne({_id:req.user.UserID})
    res.status(200).send({user:user.username})
    
    
}


