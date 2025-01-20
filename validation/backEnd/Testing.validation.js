const Joi = require('joi');

// Schema for questions
const questionSchema = Joi.object({
    text: Joi.string()
        .required()
        .label('Question Text')
        .messages({
            'string.empty': '"Question Text" cannot be empty.',
            'any.required': '"Question Text" is required.'
        }),
    degree: Joi.number()
        .required()
        .label('Degree')
        .messages({
            'number.base': '"Degree" must be a valid number.',
            'any.required': '"Degree" is required.'
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
            .custom((value, helpers) => {
                const { choices } = helpers.state.ancestors[0];
                if (!choices || !choices.includes(value)) {
                    return helpers.error('any.custom', { message: '"Correct Answer" must be one of the choices.' });
                }
                return value;
            })
            .label('Correct Answer')
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
        otherwise: Joi.forbidden()
    })
});

// Schema for blocks containing questions
const blockSchema = Joi.object({
    description: Joi.string()
        .required()
        .label('Block Description')
        .messages({
            'string.empty': '"Block Description" cannot be empty.',
            'any.required': '"Block Description" is required.'
        }),
    questions: Joi.array()
        .items(questionSchema)
        .min(1)
        .label('Questions')
        .messages({
            'array.base': '"Questions" must be an array.',
            'array.min': 'Each block must have at least one question.'
        })
});

// Schema for sections containing blocks
const sectionSchema = Joi.object({
    blocks: Joi.array()
        .items(blockSchema)
        .min(1)
        .label('Blocks')
        .messages({
            'array.base': '"Blocks" must be an array.',
            'array.min': 'Each section must have at least one block.'
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
    sections: Joi.object()
        .pattern(
            Joi.string(), // Section IDs as keys
            sectionSchema
        )
        .min(4) // At least 4 sections
        .label('Sections')
        .messages({
            'object.base': '"Sections" must be an object with section IDs as keys.',
            'object.min': '"Exam" must have at least four sections.'
        })
});

module.exports = examSchema;
