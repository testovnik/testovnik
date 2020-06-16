const Test = require('../models/Test');

const findTests = async query => {
    const regexQuery = `.*${query}.*`;
    return Test.find(
        {$or: [
            { name: { $regex: regexQuery } },
            { 'authors.username': { $regex: regexQuery } },
            { description: { $regex: regexQuery } },
            { category: { $regex: regexQuery } },
            { tags: { $regex: regexQuery } }
        ]}
    );
};

module.exports = findTests;
