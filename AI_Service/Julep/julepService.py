from julep import Julep
import os
from dotenv import load_dotenv
import requests
from parsingService import parseNameDateTime

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
            info = parseNameDateTime(self.prompt)
            #print(info)
            data = {
                'name': info['name'],
                'date': info['date'],
                'time': info['time']
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'check_availability':
            info = parseNameDateTime(self.prompt)
            #print(info)
            data = {
                'name': info['name'],
                'date': info['date'],
                'time': info['time']
            }
            data = {
                'prompt': self.prompt
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'customer_support':
            return requests.get(url=url)
    
prompt = 'Please book an appointment with Dr. Sudhir tomorrow on 11:50 am.'
call = APICaller(prompt=prompt)
print(call.callAPI())
