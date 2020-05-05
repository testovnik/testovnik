const jwt = require('jsonwebtoken');

const verifyTestToken = (token) => {
    if (!token) return null;

    try {
        const { test_id } = jwt.verify(token, process.env.TEST_TOKEN_SECRET, {
            algorithms: ['HS256'],
        });
        return test_id;
    } catch (err) {
        return null;
    }
};

const createTestToken = (testId) =>
    jwt.sign({ test_id: testId }, process.env.TEST_TOKEN_SECRET, {
        expiresIn: process.env.TEST_TOKEN_EXPIRY_TIME,
        algorithm: 'HS256',
    });

module.exports.verifyTestToken = verifyTestToken;
module.exports.createTestToken = createTestToken;
