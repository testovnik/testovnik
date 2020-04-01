# Testovnik backend

This is backend for Testovnik app.

## .ENV file
To run the server correctly, `.env` file should be created in the root of the `api` folder.

### Required variables
* `SERVER_PORT`
* `DB_CONNECT` - uri to connect to database (string)
* `TOKEN_SECRET` - secret phrase for jwt tokens (string) do not need to be random, but why not
* `TOKEN_EXPIRY_TIME` - time of jwt token expiration (string || number) use string tho

### Exemplary .env file
```
SERVER_PORT = 4000
DB_CONNECT = mongodb://localhost:27017/test
TOKEN_SECRET = askjfhlaks
# 15 min
TOKEN_EXPIRY_TIME = 15m
```