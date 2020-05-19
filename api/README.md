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
# 6 hours
TOKEN_EXPIRY_TIME = 6h
TEST_TOKEN_SECRET = sdkjfhalskjdf
# 30 min
TEST_TOKEN_EXPIRY_TIME = 30m
```

## Session
My proposal is that the frontend will take care of feeding the user with questions - it will keep track
of what questions have been asked for and how many repeats each questions will have. This will allow everyone
to take the tests the same way. Additionally, for each registered user, the session will be saved, so he can
go back to the test in pretty much the same state as he left it.

The frontend will receive the questions ids or questions without proper answers, so noone will be able to check the proper
answers of the question through the requests. The frontend will send the given by the person answers to backend
and it will return whether the answers were correct or return proper answers.

## API
Information about the endpoints,
### Authentication
* POST `/api/user/register`
    - body: 
    ```json
    {
       "username":"newUser",
       "email":"user@new.com",
       "password":"strong pass"
    }
    ```
    - returns (id of the user in db):
    ```json
    {
       "user":"some id"
    }
    ```
    or status 400 with error
    
* POST `/api/user/login`
    - body:
    ```json
    {
       "email":"user@new.com",
       "password":"strong pass"
    }
    ```
    - returns (JWT session token)
    ```json
    {
      "token": "some token",
      "username": "user name"
    }
    ```
    or status 400 with error
    
    
### Tests
* GET `/api/test`
    - body
    ```json
    {
      "query": "query to search"
    }
    ```
    now, it cannot search by Id of the test
    - returns array of tests:
    ```json 
    {
      [
        {
          ... test here
        },
        ...
      ]
    }
    ```
    or status 400 with error
    
* POST `/api/test`  
    creates a new empty test (without questions)
    - requirements: registered user
    - requires being registered user
    - body:
    ```json
    {
       "name:":"some test name",
       "description":"test description",
       "tags":[
          "tag",
          "..."
       ],
       "category":"some category"
    }
    ```
  - returns the created test:
    ```json
    {
       "_id": "test id",
       "authors": ["author id", ...],
       "tags": ["tag1", ...],
       "description": "...",
       "questions": [],                           
       "name": "...",
       "category": "...",
       "version": "1.0",
       "date": "...",
    }
    ```
    or status 400 with error
    or status 401 when JWT token is bad
    
* GET `/api/test/:test_id`  
    - no body
    - returns the test with `_id` = `test_id`
    ```json
    {
       "_id": "test id",
       "authors": ["author id", ...],
       "tags": ["tag1", ...],
       "description": "...",
       "questions": [
         "question 1 id",
         "question 2 id",
         ...   
       ],                           
       "name": "...",
       "category": "...",
       "version": "1.0",
       "date": "...",
    }
    ```
    or status 400 with error
    
* PUT `/api/test/:test_id`
    - requirements: registered user, test author
    updates test values, cannot modify questions array and authors array
    - body (any element can be skipped):
    ```json
    {
       "name:": "new name",
       "description": "new description",
       "tags": ["tag", "new tag", ...],
       "category": "new category",
    }
    ```
    - returns updated test (see return of GET `/:test_id`) or status 400 with error
    or status 401 when JWT token is bad
    
* DEL `/api/test/:test_id`
    - requirements: registered user, test author
    deletes the test with `_id` = `test_id` and all questions associated with it
    - no body
    - returns removed test (see return of GET `/:test_id`) or status 400 with error
    or status 401 when JWT token is bad
    
* GET `/api/test/:test_id/questions`
    - no body
    - returns questions from the test with `_id` = `test_id`:
    ```json
    [
       {
          "_id":"question id",
          "correctAnswers":[
             id1,
             id2
          ],
          "text":"the question itself",
          "answers":[
             {
                "_id":"some _id",
                "id":"answer local id",
                "text":"answer text"
             },
             "..."
          ],
          "test":"test id"
       },
       "..."
    ]
    ```
  
* GET `/api/test/:test_id/questions/:question_id`
    - no body
    - return
    ```json
    {
       "_id":"question id",
       "correctAnswers":[
          id1,
          id2
       ],
       "text":"the question itself",
       "answers":[
          {
             "_id":"some _id",
             "id":"answer local id",
             "text":"answer text"
          },
          "..."
       ],
       "test":"test id"
    },
    ```
    or status 400 with error
    
* POST `/api/test/:test_id/questions`
    - requirements: registered user, test author
    - body:
    ```json
    {
       "text":"question",
       "correctAnswers":[
          id1,
          "..."
       ],
       "answers":[
          {
             "id": id1,
             "text":"answer1"
          },
          {
             "id": id2,
             "text":"answer2"
          },
          "..."
       ]
    }
    ```
    - returns created question:
    ```json
    {
       "_id":"question id",
       "correctAnswers":[
          id1,
          id2
       ],
       "text":"the question itself",
       "answers":[
          {
             "_id":"some id",
             "id":id1,
             "text":"answer1"
          },
          {
             "_id":"some id",
             "id":id2,
             "text":"answer2"
          },
          "..."
       ],
       "test":"test id"
    }
    ```
    or status 400 with error
    or status 401 when JWT token is bad
 
* PUT `/api/test/:test_id/questions/:question_id`
    - requirements: registered user, test author
    - body (see POST `/:test_id/questions` body) all elements are optional
    - return updated question (see POST `/:test_id/questions` return) or status 400 with error
    or status 401 when JWT token is bad
    
* DEL `/api/test/:test_id/questions`
    - requirements: registered user, test author
    - no body
    - returns number of deleted question or status 400 with error
    or status 401 when JWT token is bad

* DEL `/api/test/:test_id/questions/:question_id`
    - requirements: registered user, test author
    - no body
    - returns removed question (see POST `/:test_id/questions` return) or status 400 with error
    or status 401 when JWT token is bad
    
* GET `/api/test/:test_id/authors`
    - no body
    - returns array of authors:
    ```json
    [
       {
          "id":"author id",
          "name":"author name"
       }
    ]
    ```

* GET `/api/test/:test_id/authors/add`
    - requirements: registered user, test author
    - no body
    - returns token with which other users can assign themselves to be authors of the test with `_id` = `test_id`:
    ```json
    {
      "token": "some JWT token with test information and short expiry time"
    }
    ```
    or status 400
    or status 401 when JWT token is bad

* PUT `/api/test/authors/add`
    - requirements: registered user
    - no body
    - query: `token: JWT token with test information`
    - result `"success"` message :D or:
        - status 404
        - status 401 if problem with token
    
### User
should this one be restricted to registered users?
* GET `/api/user`
    - body (optional):
    ```json
    {
       "query": "search query"
    }
    ```
    - return array of users
    ```json
    [
       {
          "id":"some id",
          "username":"some name",
          "userTests":[
             {
                "id":"test_id",
                "name":"test name",
                "date":"test creation date"
             }
          ]
       }
    ]
    ```
  
should this one be restricted to registered users?
* GET `/api/user/:user_id`
    - no body
    - return
    ```json
    {
       "id":"some id",
       "username":"some name",
       "userTests":[
          {
             "id":"test_id",
             "name":"test name",
             "date":"test creation date"
          },
          ...
       ]
    }
    ```
  
* GET `/api/user/:user_id/user_tests`
    - no body
    - returns array of tests, whose author is user:
    ```json
    [
       {
          "_id":"test id",
          "name":"test name",
          "category":"category",
          "tags":[
             tag1,
             tag2
          ]
       }
    ]
    ```

* GET `/api/user/myself/user_tests`
    - requirements: registered user
    - no body
    - returns array of tests, whose author is user:
    ```json
    [
       {
          "_id":"test id",
          "name":"test name",
          "category":"category",
          "tags":[
             tag1,
             tag2
          ],
          "date":"creation date"
       }
    ]
    ```
    or status 401 when JWT token is bad

* GET `/api/user/myself`
    - requirements: registered user
    - no body
    - return: detailed user:
    ```json
    {
       "_id":"some id",
       "username":"some name",
       "userTests":[
          {
             "_id":"test_id",
             "name":"test name",
             "date":"test creation date"
          }
       ],
       "favouriteTests":[
          {
             "_id":"test_id",
             "name":"test name",
             "date":"test creation date"
          }
       ],
       "date":"registration date",
       "email":"user email"
    }
    ```
    or status 401 when JWT token is bad
  
* PUT `/api/user/myself/password`  
    updates user password
    - requirements: registered user
    - body:
    ```json
    {
       "oldPassword":"old password",
       "newPassword":"new password"
    }
    ```
  - return `success` message or 400 status with error
    or status 401 when JWT token is bad
  
* PUT `/api/user/myself/email`
    - requirements: registered user
    - body:
    ```json
    {
       "oldEmail":"old@email.com",
       "newEmail":"new@mail.com"
    }
    ```
    - return:
    ```json
    {
       "email": "new@mail.com"
    }
    ```
    or status 400 with error
    or status 401 when JWT token is bad
    
should we delete the tests created by the user, if there are no other authors?
* DEL `/api/user/myself`  
    deletes the user from database
    - requirements: registered user
    - no body
    - returns `success` message
    or status 401 when JWT token is bad

* GET `/api/user/myself/favourite_tests`
    - requirements: registered user
    - no body
    - returns array of favourite tests:
    ```json
    [
       {
          "_id":"some id",
          "name":"some test name",
          "category":"category",
          "tags":[
             tag1,
             tag2
          ]
       },
       "..."
    ]
    ```
    or status 401 when JWT token is bad

* PUT `/api/user/myself/favourite_tests/:test_id`
    - requirements: registered user
    - no body
    - retruns list of favourite tests ids `{ favouriteTests: [...] }`
        - status 400 when test does not exist
        - status 401 when JWT token is bad

* DEL `/api/user/myself/favourite_tests/:test_id`
    - requirements: registered user
    - no body
    - returns `success` message or
        - 401 message when JWT token is bad
    