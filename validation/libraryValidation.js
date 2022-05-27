const Joi = require('joi');

const categoryValidation = (data) => {
    const schema = Joi.object({
        categoryId: Joi.number()
            .min(1)
            .required()
            .label("Category ID"),
        categoryName: Joi.string()
            .min(3)
            .required()
            .label("Category Name")
    });
    return schema.validate(data);
};

const publicationValidation = (data) => {
    const schema = Joi.object({
        publicationId: Joi.number()
            .min(1)
            .required()
            .label("Publication ID"),
        publicationName: Joi.string()
            .min(3)
            .required()
            .label("Publication Name")
    });
    return schema.validate(data);
}

const bookValidation = (data) => {
    const schema = Joi.object({
        ISBN: Joi.number()
            .min(5)
            .max(100000000000000)
            .required()
            .label("ISBN"),
        bookTitle: Joi.string()
            .min(5)
            .max(100)
            .required()
            .label("Book Title"),
        publicationYear: Joi.number()
            .min(1947)
            .max(2023)
            .required()
            .label("Publication Year"),
        language: Joi.string()
            .min(5)
            .max(20)
            .required()
            .label("Language"),
        author: Joi.string()
            .required()
            .min(3)
            .max(30)
            .label("Author"),
        categoryId: Joi.required()
            .label("Category"),
        publicationId: Joi.required()
            .label("Publication"),
        noCopies: Joi.number()
            .min(0)
            .max(10)
            .required()
            .label("Number of copies"),
        currentCopies: Joi.number()
            .min(0)
            .max(10)
            .required()
            .label("Current copies"),
        bookInfo: Joi.string()
            .min(20)
            .max(2050)
            .required()
            .label("Book Info"),
        bookImage: Joi.string()
            .label("Book Image")
    });
    return schema.validate(data);
}

module.exports.categoryValidation = categoryValidation;
module.exports.publicationValidation = publicationValidation;
module.exports.bookValidation = bookValidation;