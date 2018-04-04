const AuthenticationSchema = {
    name: 'Authentication',
    primaryKey: 'id',
    properties: {
        id: 'string',
        clientId: 'string',
        grant: 'string?',
        accessToken: 'string?',
        refreshToken: 'string?',
        expire: 'date?'
    }
};
module.exports = AuthenticationSchema;
