import createHttpError from "http-errors";

export function validateBody(schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err) {
            next(
                createHttpError(
                    400,
                    JSON.stringify(err.details.map((err) => err.message))
                )
            );
        }
    };
}
