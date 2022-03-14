# Feature Request on swagger-jsdoc

Feature Request: [https://github.com/Surnet/swagger-jsdoc/issues/311](https://github.com/Surnet/swagger-jsdoc/issues/311)

## Issue Comment

**Is your feature request related to a problem? Please describe.**
Problem: Need to write JOI validation Object and annotation again for doc.

we are writing annotations for my APIs, But for Components we have [Joi](https://www.npmjs.com/package/joi) validation object. With [joi-to-swagger](https://www.npmjs.com/package/joi-to-swagger) we can transform Joi schema objects into Swagger OAS 3.0 schema definitions.

**Describe the solution you'd like**
What if we can pass the schemas to swaggerJsdoc. We can pass the schema from joi-to-swagger.

```js
const options = {
	definition: {},
	apis: [], // include routes,
	schemas: [userCreateSchema] // list of schema from joi-to-swagger
};
```

Will this be possible. Or is there any solution already?
If possible I would love to contribute as well.

## Use Case

I have created this repo, as requested by [daniloab](https://github.com/daniloab) on [https://github.com/Surnet/swagger-jsdoc/issues/311#issuecomment-1066716271](https://github.com/Surnet/swagger-jsdoc/issues/311#issuecomment-1066716271)

```

hi @InfoDevkota, thanks for the issue.

Can you share a real use case from this?

Can be a tiny repo or prints, whatever you can do to help us.

```

Please look into index.js
