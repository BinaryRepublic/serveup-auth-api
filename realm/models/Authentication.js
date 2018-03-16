const AuthenticationSchema = {
    name: 'Authentication',
    primaryKey: 'id',
    properties: {
        id: 'string',
        accountId: 'string',
        grant: 'string?',
        accessToken: 'string?',
        refreshToken: 'string?',
        expire: 'date?'
    }
};
module.exports = AuthenticationSchema;
