const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => {
                const fieldName = err.context.label || err.path[err.path.length - 1]; // استخراج اسم الحقل
                return `${fieldName}: ${err.message.replace(/"/g, '')}`; // تخصيص الرسالة
            });

            return res.status(400).json({
                success: false,
                errors
            });
        }
        next();
    };
};

module.exports = validateRequest;
