from fastapi import FastAPI
from pydantic import BaseModel,Field
from datetime import datetime
from starlette import status
from typing import Optional
import boto3
import uuid
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

dynamodb = boto3.resource('dynamodb',aws_access_key_id= os.getenv('access_key'),
                          aws_secret_access_key = os.getenv('secret_access_key'),
                          region_name = 'eu-central-1')

# CORS-HEADERS
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL FOR USER REGITER
class UserRegistration(BaseModel):
    id : Optional[int] = None
    first_name : str = Field(min_length=2)
    last_name : str = Field(min_length=2)
    email : str =Field(min_length=3)
    # user_created : Optional[str] = Field(default= datetime.now().strftime("%y-%m-%d %H:%M"))
    user_created : Optional[str] = None

class InputString(BaseModel):
    input_string: str

def generate_int_id():
    uuid_value = uuid.uuid4()
    int_id = uuid_value.int
    new_id = int_id % 10**10  # 10-digit integer
    
    return new_id
 
@app.post("/add-user", status_code=status.HTTP_201_CREATED)
def registration(data : UserRegistration):
    table = dynamodb.Table('users')

    # Generate unique-ID
    next_id = generate_int_id()
    items = {
        'id': next_id,
        'first_name': data.first_name,
        'last_name': data.last_name,
        'email': data.email,
        'user_created': datetime.now().strftime("%y-%m-%d %H:%M")
    }

    table.put_item(Item = items)
    return {"message": "User registered successfully", "id": next_id}

@app.get('/fetch-all-users',status_code=status.HTTP_200_OK)
def fetch_all_users():
    table = dynamodb.Table('users')
    item = table.scan()

    return item

@app.delete('/delete-user/{user_id}', status_code=status.HTTP_200_OK)
def delete_user(user_id : int):
    table = dynamodb.Table('users')

    response = table.delete_item(
        Key={ 'id': user_id}
    )
    return response


# REVERSE STRING

def isalpha(c):   #CHECK A VALUE IS APPHABET OR NOT
    return(ord("a") <= ord(c) <= ord("z") or 
           ord("A") <= ord(c) <= ord("Z"))


def solution(input):
    list_data = list(input)

    # TWO-POINTER METHOD
    left = 0
    right = len(input)-1

    while left < right:
        if not isalpha(list_data[left]): #left = Not alphabet , keep it there
            left+= 1
        elif not isalpha(list_data[right]): #right = Not alphabet , keep it there
            right-= 1
        else:
            list_data[left],list_data[right] = list_data[right],list_data[left]

            left+= 1
            right-= 1

    return ''.join(list_data) 

   
@app.post("/reverse-alphabets/")
async def reverse_alphabets(input_data: InputString):
    result = solution(input_data.input_string)
    return {"result": result}
