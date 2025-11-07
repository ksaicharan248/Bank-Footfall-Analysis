from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
import base64
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bedrock Chatbot API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

def get_bedrock_response(user_message: str) -> str:
    token = "bedrock-api-key-YmVkcm9jay5hbWF6b25hd3MuY29tLz9BY3Rpb249Q2FsbFdpdGhCZWFyZXJUb2tlbiZYLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFTSUFTNVZPTFZMTkhURVNaMzJGJTJGMjAyNTA5MDklMkZ1cy1lYXN0LTElMkZiZWRyb2NrJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MDlUMDcyOTMzWiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFR2dhQ1hWekxXVmhjM1F0TVNKSE1FVENJUUNGRW9xTHcyUFpadUIwbWtVSm5xRWFRdlI2UVBTZHQzOVlYJTJGTjlxb3MlMkYxZ0lnT20lMkJ3UUcwSldLZFU2azNpbEdFWEZVUHN2cEdIZmpSNWZxZ29PUFp5ZEVRcWlBUUkwZiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRkFSQUFHZ3d5TURFeE5UVXpPVEF4TnpBaURFenNLZ215VzdBM1VVbEJiU3JjQXhSSzlQakp4RDNqUjZHNTBjNFFJR2s1dkt4Smg4ejM3SUgwcjVHOFl3WXBBWWhMOE9tbzE4eEolMkZ2MVhZNmxoWEJ6ciUyQnFWamFyYlN5c2JDNnJ2VGpMc3ZSVjF1Ym1HWlUyTk5rTDh1NWFzWHdDajJTY3hqUUs0QzglMkZUU3FURGoyZEVaOTZTcWF6dmpWY0g4SlpmVGdwMjNDOU9PTCUyQkdWbkE3eiUyRjhIcDFLdWNhb20zWHNwVk8lMkZKS0I1dlhHeFdTNEhWQ3ltR1NxRDlwNW1pd05UTDUlMkI1d2l5Snplc3ZxZTBQJTJCcjNsZSUyQnJkJTJCclB3cVRyYUJwUmQ1d1BlSDhEcXljcUw4RXZ4cVJQRGFUV05IZ1ZIRiUyRkdXSTJyTGk4VHcwd090dDlMT2hJUDVQUzJVbWdad1JNZGFaSnVzUm9VdVdMdDA3QWR5Qkw3b1hqUU9jJTJGejlBN1piRnZSSUd2MjhScUNsOGZYZkUzaHhvM1NVUHFXOUJYRlM5c0hFYmw5eXBSR29reDA1NFVIdjF2ZWVUY3F3ZmdqdW5iTzR5aktUclVnSVV3bXAzdThZYXVtOTFnN0liZXlvekQ1U3FvNGRLN2RNZ0prbiUyRjFGejIzaXlzcE9KZjNBSVhJdW9EZW9XOTNjOGdla0k0MU9iS3NuYWFaV0xFZFJXcEgxWSUyRmtVeU9VWFRHb09iJTJGWjVxT3RFaHJsY0hGblU0bnFCMmRVeVcwb3pva3I4bXdLZFg3NHNCQlB3UkRUWmxXTnA4R1B2d2N6cVoyUDNyTXNheTFpOGhiblVVT2FsNmJFWlVTeTQlMkJIcEFiQWNhNWdhdFoxSXRnc01zaXFJOEpGZHhIc0JNTENNJTJGOFVHT3IwQ1lTSmQ0N2kzbGZuWWpNR0xMME9GcXVhVUVHakFMYnpodyUyQmc2U3A1WlI0M0QxOWQlMkJTZzE5enRGTVdQUXEzVVdkVlpwempuS2F1eGdsd0ljMlZqVTZlWjVHN1VjTFZpekFIUm83JTJGdzUlMkZzNGttQyUyQjBySW4yMXRJck5nWUFZM21hZHdNd0xvZFVPNFVuNWpiQkdibHZ6ZHQ0bGJrcW5WUUZ2WktEUUh5RDU0cXNpRXpLZiUyQklNdCUyQkxHalFPeFV2RSUyQkZhVzJrVEdEazdmWTNKOGZ6WjQzT0xneFRnOVB6WjVzQjllcDhYV2FBbUJnJTJCMnplMEdRclRqTmRyd1c0d3NFaHV6RGtnMmV0TW8lMkZIVFZsV0NFVjMlMkZ0Sm9GakJmbVRENmRzM2o5QjVYeHM0cWolMkI2S3VES2NxUGllcWpVZ1M4OHlrbXdYZVBZQ3VGRnk0aDltTWU5MGZJYXpua2VFbFBMVGNPYmVpaDZyZDhiak1TQXBQUUpaM0JucmNFWWtwUlhJSmNoOWRpNGh1bUxBVEp2TnVybjlXdXRYTUg4JTJCMG5vMEJ0S01pVUVVJTNEJlgtQW16LVNpZ25hdHVyZT02NzAxMzExNWNkMTAxYWJkZWJjODhjZGYyNTQ1MTZlMjFhNzBlYzE1M2RkNDBjNTFlMWMxY2Q5Zjk0MzkxYzgxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZWZXJzaW9uPTE="
    url = "https://" + base64.b64decode(token.replace("bedrock-api-key-", "")).decode('utf-8')
    
    payload = {
        "messages": [{
            "role": "user",
            "content": [{
                "text": user_message
            }]
        }],
        "inferenceConfig": {
            "maxTokens": 500,
            "temperature": 0.5
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    result = response.json()
    return result["output"]["message"]["content"][0]["text"]

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response_text = get_bedrock_response(request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Bedrock Chatbot API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)