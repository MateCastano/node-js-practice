import userModel from "#Schemas/user.schema.js";
import { hash } from "bcrypt";

const userRegisterController = async (req, res) =>{
    const {_id, name, surname, email, password} = req.body;

     const existingUserById = await userModel.findById(_id).exec();
     if(existingUserById) return res.status(409).send({errors: ['Ya existe un usuuario con ese mail registrado.']});

     const existingUserByEmail = await userModel.findOne({email}).exec();
     if(existingUserByEmail) return res.status(409).send({errors: ['Ya existe un usuuario con ese mail registrado.']});

     const hashedPassword = await hash(password, 12);
     const user = new userModel({
        _id, name, surname, email, password: hashedPassword
     })

     await user.save();

     return res.status(201).send('Usuario registrado con exito.')
}

export default userRegisterController;