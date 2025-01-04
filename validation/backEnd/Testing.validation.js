const Joi = require('joi');


const questionSchema = Joi.object({
    questionText: Joi.string()
        .required()
        .label('Question Text')
        .messages({
            'string.empty': '"Question Text" cannot be empty.',
            'any.required': '"Question Text" is required.'
        }),
    degree: Joi.number()
        .required()
        .label('degree')
        .messages({
            'number.base': '"degree" must be a valid number .',
            'any.required': '"degree" is required.'
        }),
    type: Joi.string()
        .valid('multipleChoice', 'trueFalse', 'fillInTheBlank', 'file', 'audio')
        .required()
        .label('Question Type')
        .messages({
            'any.only': '"Question Type" must be one of: multipleChoice, trueFalse, fillInTheBlank, file, audio.',
            'any.required': '"Question Type" is required.'
        }),
    choices: Joi.when('type', {
        is: 'multipleChoice',
        then: Joi.array()
            .items(Joi.string().required().label('Choice'))
            .min(2)
            .unique()
            .label('Choices')
            .messages({
                'array.min': '"Choices" must contain at least two options.',
                'array.unique': '"Choices" must not have duplicates.'
            }),
        otherwise: Joi.forbidden()
    }),
    correctAnswer: Joi.when('type', {
        is: 'multipleChoice',
        then: Joi.string()
            .required()
            .label('Correct Answer')
            .custom((value, helpers) => {
                const { choices } = helpers.state.ancestors[0];
                if (!choices || !choices.includes(value)) {
                    return helpers.error('any.custom', { message: '"Correct Answer" must be one of the choices.' });
                }
                return value;
            })
            .messages({
                'any.custom': '"Correct Answer" must be one of the choices.',
                'any.required': '"Correct Answer" is required for multiple-choice questions.'
            }),
        otherwise: Joi.when('type', {
            is: 'trueFalse',
            then: Joi.string()
                .valid('true', 'false')
                .required()
                .label('Correct Answer')
                .messages({
                    'any.only': '"Correct Answer" must be either "true" or "false".',
                    'any.required': '"Correct Answer" is required for true/false questions.'
                }),
            otherwise: Joi.when('type', {
                is: 'fillInTheBlank',
                then: Joi.string()
                    .required()
                    .label('Correct Answer')
                    .messages({
                        'any.required': '"Correct Answer" is required for fill-in-the-blank questions.'
                    }),
                otherwise: Joi.when('type', {
                    is: Joi.valid('file', 'audio'),
                    then: Joi.string()
                        .required()
                        .label('Correct Answer')
                        .messages({
                            'any.required': '"Correct Answer" is required for file or audio questions.'
                        }),
                    otherwise: Joi.forbidden()
                })
            })
        })
    }),
    file: Joi.when('type', {
        is: Joi.valid('file', 'audio'),
        then: Joi.string()
            .required()
            .label('File')
            .messages({
                'string.empty': '"File" cannot be empty.',
                'any.required': '"File" is required for file or audio questions.'
            }),
        otherwise: Joi.forbidden() // يمنع وجود الحقل إذا لم يكن النوع 'file' أو 'audio'
    })
});

// Schema for sections containing questions
const sectionSchema = Joi.object({
    sectionId: Joi.string().required().messages({
        'any.required': 'Section ID is required.'
    }),
    questions: Joi.array().items(questionSchema).required().messages({
        'array.base': 'Questions must be an array.',
        'any.required': 'Questions are required for each section.'
    })
});

// Schema for the exam
const examSchema = Joi.object({
    examName: Joi.string()
        .required()
        .label('Exam Name')
        .messages({
            'string.empty': '"Exam Name" cannot be empty.',
            'any.required': '"Exam Name" is required.'
        }),
    shuffle: Joi.boolean()
        .required()
        .label('Shuffle')
        .messages({
            'boolean.base': '"Shuffle" must be a valid boolean (true or false).',
            'any.required': '"Shuffle" is required.'
        }),


    examType: Joi.string()
        .valid('academic', 'general training')
        .required()
        .label('Exam Type')
        .messages({
            'any.only': '"Exam Type" must be either "academic" or "general training".',
            'any.required': '"Exam Type" is required.'
        }),
    questions: Joi.object()
        .pattern(
            Joi.string(), // مفتاح القسم عبارة عن نص ديناميكي
            Joi.array()
                .items(questionSchema)
                .min(1)
                .label('Section Questions')
                .messages({
                    'array.base': '"Section Questions" must be an array.',
                    'array.min': 'Each section must have at least one question.'
                })
        )
        .min(4) // على الأقل أربعة أقسام
        .required()
        .label('Questions')
        .messages({
            'object.base': '"Questions" must be an object with sections.',
            'object.min': '"Exam" must have at least four sections.',
            'any.required': '"Questions" are required.'
        })
});



module.exports = examSchema;
