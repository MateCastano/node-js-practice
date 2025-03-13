import userModel from "#Schemas/user.schema.js";
import { hash } from "bcrypt";
import nodemailer from "nodemailer";

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

   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD
      }
   })
   const sendEmail = async () => {
      try {
         const info = await transporter.sendMail({
              from: `"Tu Nombre" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: "Asunto del correo",
              text: "Llego el email.",
              html: "<b>Este es el contenido en HTML</b>",
          });
  
          console.log("Email enviado: " + info.messageId);
      } catch (error) {
          console.error("Error enviando el email:", error);
      }
   };
  
   sendEmail();
     
   await user.save();

   return res.status(201).send('Usuario registrado con exito.')
}

export default userRegisterController;