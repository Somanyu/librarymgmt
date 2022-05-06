const Joi = require('joi');

const categoryValidation = (data) => {
    const schema = Joi.object({
        categoryId: Joi.number()
            .min(1)
            .required()
            .label("Category ID"),
        categoryName: Joi.string()
            .min(5)
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
        isbn: Joi.number()
            .min(10)
            .max(15)
            .required()
            .label("ISBN"),
        bookTitle: Joi.string()
            .min(12)
            .max(40)
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
            .max(150)
            .required()
            .label("Book Info"),
        bookImage: Joi.string()
            .required()
            .label("Book Image")
    })
}

module.exports.categoryValidation = categoryValidation;
module.exports.publicationValidation = publicationValidation;
module.exports.bookValidation = bookValidation;