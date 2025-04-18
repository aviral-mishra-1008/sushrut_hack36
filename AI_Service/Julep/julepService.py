from julep import Julep
import os
from dotenv import load_dotenv
import requests

load_dotenv()

client = Julep(
    api_key=os.getenv('JULEP_API_KEY'),
    environment=os.getenv('JULEP_ENVIRONMENT', 'production')
)

class APICaller:

    def __init__(self, prompt):
        self.prompt = prompt
    
    def sendMessage(self):
        session = client.sessions.get(session_id=os.getenv('SESSION_ID'))

        response = None

        while (response is None):
            print("Waiting for response...")
            response = client.sessions.chat(
                session_id=session.id,
                messages=[
                    {
                        "role": "user",
                        "content": self.prompt
                    }
                ]
            )

        return response.choices[0].message.content
    
    def callAPI(self):
        endpoint = self.sendMessage()
        url = "http://127.0.0.1:8000/api/" + endpoint
        if endpoint == 'query_llm':
            data = {
                'prompt': self.prompt
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'book_appointment':
            data = {
                'prompt': self.prompt
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'check_availability':
            data = {
                'prompt': self.prompt
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'customer_support':
            return requests.get(url=url)
    
prompt = 'I am feeling severe headache, 5 mosquitoes have bit me recently. What should I do?'
call = APICaller(prompt=prompt)
print(call.callAPI())
