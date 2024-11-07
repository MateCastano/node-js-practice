import { emailDTOSchema, passwordDTOSchema } from '#Lib/dto-types.js'; 
import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

const LoginDTOSchema = Type.Object({
    email: emailDTOSchema,
    password: passwordDTOSchema,
}, {
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "El formato del objeto no es válido"
    }
});

const ajv = new Ajv({ allErrors: true });
ajv.addFormat("password", /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/);

addFormats(ajv, ['email']).addKeyword('kind').addKeyword('modifier');
addErrors(ajv);

const validateSchema = ajv.compile(LoginDTOSchema); // Aquí compilamos LoginDTOSchema

const userLoginDTO = (req, res, next) => {
    const isDTOValid = validateSchema(req.body);

    if (!isDTOValid) return res.status(400).send({ errors: validateSchema.errors.map(error => error.message) });
    
    next();
}

export default userLoginDTO;
