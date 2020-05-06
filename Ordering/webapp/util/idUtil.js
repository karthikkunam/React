const uuidv4 = require('uuidv4').default;

/**
 * Helper class to generate an unique identifier
 */
class IDGenerator {
    static v4() {
        return uuidv4();
    }
}

module.exports.IDGenerator = IDGenerator;


