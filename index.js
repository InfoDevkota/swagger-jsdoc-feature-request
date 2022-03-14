const express = require('express');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Joi = require('joi');
const j2s = require('joi-to-swagger');

const app = express();

app.use(express.json());

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Sample API',
			description: 'Sample Project for feature request.',
			version: '1.0.0'
		}
	},
	apis: ['*.js']
};

const openapiSpecification = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// we are creating a user
// we have some validation, with JOI
// we have Swagger Documentation, We want the Swagger Document contains the validations information
// Now we are defaining annotaction for Swagger Documentation
// and different validation model with JOI
// Featuren Request is to use JOI model as Schema for Swagger Document

// annotations for UserCreateModel

/**
 * @openapi
 * components:
 *  schemas:
 *      UserCreateModel:
 *          type: object
 *          required:
 *          - fullName
 *          - gender
 *          - phoneNumber
 *          - password
 *          properties:
 *              fullName:
 *                  type: string
 *                  minimum: 7
 *                  maximum: 30
 *              phoneNumber:
 *                  type: string
 *                  minimum: 10
 *                  maximum: 10
 *                  message: "should contains numbers only"
 *              emergencyPhoneNumber:
 *                  type: string
 *                  minimum: 10
 *                  maximum: 10
 *              gender:
 *                  type: string
 *                  enum:
 *                  - MALE
 *                  - FEMALE
 *                  - OTHER
 *              password:
 *                  type: string
 *                  minimum: 7
 *                  maximum: 50
 *              email:
 *                  type: string
 *                  format: email
 */

// JOI validation object for UserCreateModel
const UserCreateModel = Joi.object({
	fullName: Joi.string().min(7).max(30).required(),
	phoneNumber: Joi.string().length(10).regex(/^\d+$/).required().messages({
		'string.pattern.base': `"phoneNumber" should contains numbers only`
	}),
	gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
	emergencyPhoneNumber: Joi.string().length(10).regex(/^\d+$/).messages({
		'string.pattern.base': `"phoneNumber" should contains numbers only`
	}),
	email: Joi.string().email(),
	password: Joi.string().min(7).max(50).required()
});

// We are refrencing the UserCreateModel (the annotation one )

/**
 * @openapi
 * /user:
 *  post:
 *      tags:
 *      - "User"
 *      description: Create a user
 *      requestBody:
 *          content:
 *              'application/json':
 *                  schema:
 *                      $ref: "#/components/schemas/UserCreateModel"
 *      responses:
 *          200:
 *              description: Returns a user object.
 */
app.post('/user', (req, res, next) => {
	value = UserCreateModel.validate(req.body, {
		abortEarly: false
	});

	if (value.error) {
		return res.status(422).json({
			message: 'validation Error',
			error: value.error
		});
	}

	//create the user here
	res.status(200).json({
		value
	});
});

app.listen(3000, () => {
	console.log('\nFeature Request server on', 3000);
});

// now let's use joi-to-swagger

const j2sSchema = j2s(UserCreateModel);

// Now with the help of joi-to-swagger we have this Schema,
const UserCreateModel2 = j2sSchema.swagger;
// UserCreateModel2 is similar(nearly similar) to the annotation one.

console.log(UserCreateModel2);
// {
//     type: 'object',
//     properties: {
//       fullName: { type: 'string', minLength: 7, maxLength: 30 },
//       phoneNumber: { type: 'string', pattern: '^\\d+$', minLength: 10, maxLength: 10 },
//       gender: { type: 'string', enum: [Array] },
//       emergencyPhoneNumber: { type: 'string', pattern: '^\\d+$', minLength: 10, maxLength: 10 },
//       email: { type: 'string', format: 'email' },
//       password: { type: 'string', minLength: 7, maxLength: 50 }
//     },
//     required: [ 'fullName', 'phoneNumber', 'gender', 'password' ],
//     additionalProperties: false
// }

// If we can use this UserCreateModel2, and refrence it on requestBody  ($ref: #/components/schemas/UserCreateModel)

// I still want to use the anotation for API information

// still use
// * @openapi
// * /user:
// *  post:
// ........

// But want to pass this Schema
// ie. Schema on JSON format

// can we do something like
const options2 = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Sample API',
			description: 'Sample Project for feature request.',
			version: '1.0.0'
		}
	},
	apis: ['*.js'],
	schemas: [
		{
			name: 'UserCreateModel2',
			schema: UserCreateModel2
		}
	] // or any other way.
};

const openapiSpecification2 = swaggerJsdoc(options);

// and use this Schema on request Body $ref

/**
 * @openapi
 * /user:
 *  post:
 *      tags:
 *      - "User"
 *      description: Create a user
 *      requestBody:
 *          content:
 *              'application/json':
 *                  schema:
 *                      $ref: "#/components/schemas/UserCreateModel2"
 *      responses:
 *          200:
 *              description: Returns a user object.
 */
app.post('/user', (req, res, next) => {});

// I think, if we can do so, we no longer need to write the model twice. (annotation and JOI)
