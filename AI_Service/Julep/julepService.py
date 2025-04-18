from julep import Julep
import os
from dotenv import load_dotenv
import requests

load_dotenv()

client = Julep(
    api_key=os.getenv('JULEP_API_KEY'),
    environment=os.getenv('JULEP_ENVIRONMENT', 'production')
)

# agent = client.agents.create(
#     name='Medical Intent Detector',
#     about='Return corresponding endpoint information based on prompt',
#     model="gpt-4o-mini",
#     instructions=["You are a medical intent detector. ", "Your job is to detect intent of a query and return the name of the endpoint which should be called.", '''Following are the endpoints available 
#       query_llm -> if user has specified symptoms and wishes to know the description of the disease, 
#       book_appointment -> if user has specified a particular department in which he wants a doctor, 
#       check_availability -> if user has specified a doctor name and appointment booking date, 
#       customer_support -> if user needs help with some platform based services. 
#       Return only the name of the endpoint and nothing else''']
# )

agent = client.agents.get(agent_id=os.getenv('AGENT_ID'))

#print(agent.id)

class SessionControl:
    def createSession(self, user_id):
        self.session = client.sessions.create(agent=agent.id, user=user_id, context_overflow='adaptive')
        print(self.session.id)
    
    def getHistory(self):
        print(client.sessions.history(session_id=self.session.id))
    
    def sendMessage(self, message_info):
        response = client.sessions.chat(
            session_id=self.session.id,
            messages=[
                {
                    "role": "user",
                    "content": message_info
                }
            ]
        )
        return response.choices[0].message.content
