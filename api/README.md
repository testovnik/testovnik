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

## TODO
- delete the tests created by the user, if there are no other authors

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
       "date": "..."
    }
    ```
    or:
    * status 401 when JWT token is bad
    * status 400 on error
    
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
       "date": "..."
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
    
    
### Questions
* GET `/api/test/:test_id/questions`
    since, right now, the only use case for this endpoint is in test modification, I decided to narrow it down to
    registered test authors only - it will return the whole questions (with correct answers)
    - requirements: registered user, test author
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
    or:
    - status 401 when JWT token is bad
    - status 400 on error
  
* GET `/api/test/:test_id/questions/:question_id`
    this endpoint will not return correct answers, this way, no user can check the correct answer of the question in the body of the return.
    (Or, since the questions will most likely be in randomized order, we can return the correct answers, and check user answers on the frontend,
    this will probably simplify the requests, and slightly increase user experience)
    - no body
    - return
    ```json
    {
       "_id":"question id",
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
    or:
    - status 401 when JWT token is bad
    - status 400 on error
    
* GET `/api/test/:test_id/questions/:question_id/check`
    this endpoint will provide a way to check the if the answers given by the user are correct (as said above in GET `test/:test_id/question/:question_id), 
    if we decide, that we send the correct answers to the frontend while taking the test, then this endpoint will be redundant)
    - body:
    ```json
    {
      "answers": [1, 2]
    }
    ```
    - returns status 200 or:
        - status 409 with `{ "correctAnswers: [2, 3] }`
        - status 400 on error
 
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
    or:
    - status 401 when JWT token is bad
    - status 400 on error

* PUT `/api/test/authors/add`
    - requirements: registered user
    - no body
    - query: `token: JWT token with test information`
    - result `"success"` message :D or:
        - status 404
        - status 401 if problem with token
    
### User
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
  - return `success` message or 400 status with error or:
        - status 401 when JWT token is bad
        - status 400 on error
  
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
    or:
    - status 401 when JWT token is bad
    - status 400 on error
    
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
    - retruns list of favourite tests ids `{ favouriteTests: [...] }` or:
        - status 400 when test does not exist
        - status 401 when JWT token is bad

* DEL `/api/user/myself/favourite_tests/:test_id`
    - requirements: registered user
    - no body
    - returns `success` message or
        - 401 message when JWT token is bad
    
### Session
* GET `/api/session`
    - requirements: registered user
    - no body
    - returns list of tests the user has session with
    ```json
    [
      {
        "name":"some test name",
        "authors":[
          "some author",
          ...
        ],
        "description":"some description",
        "category":"some category",
        "completion":"percentage of questions tat has been answered, like 23 (type Number)"
      }
    ]
    ```
    or:
    - status 401 when JWT token is bad
    - status 400 on error
        
* GET `/api/session/:test_id`  
    each session is bound to user and some test, therefore, it requires being logged in
    - requirements: registered user
    - no body
    - returns session:
    ```json
    {
      "penalty":"number of repeats added to question after wrong answer",
      "answers":"number of answers",
      "correctAnswers":"number of correct answers",
      "questions":[
        {
          "id":"question id",
          "repeats":"repeats left"
        },
        {
          "id":"next question id",
          "repeats":"repeats left"
        }
      ]
    }
    ```
    or:
    - status 401 when JWT token is bad
    - status 400 on error

* POST `/api/session/:test_id`  
    each session is bound to user and some test, therefore, it requires being logged in
    - requirements: registered user
    - body:
    ```json
    {
      "penalty":"number of repeats added to question after wrong answer",
      "questions":[
        {
          "id":"question id",
          "repeats":"repeats left"
        },
        {
          "id":"next question id",
          "repeats":"repeats left"
        }
      ]
    }
    ```
    - returns status 200 or:
        - status 401 when JWT token is bad
        - status 400 on error
        
* PUT `/api/session/:test_id`  
    updates the questions
    - requirements: registered user,
    - body:
    ```json
    {
      "questions":[
        {
          "id":"question id",
          "repeats":"repeats left"
        },
        {
          "id":"next question id",
          "repeats":"repeats left"
        }
      ]
    }
    ```
    - returns status 202 or:
        - status 401 when JWT token is bad
        - status 400 on error

* DEL `/api/session/:test_id`  
    removes the session
    - requirements: registered user
    - no body
    - returns status 202 or:
        - status 401 when JWT token is bad
        - status 400 on error
        
