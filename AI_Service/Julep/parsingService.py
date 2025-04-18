from julep import Julep
import os
from dotenv import load_dotenv
import yaml
import time
import ast

load_dotenv()

client = Julep(
    api_key=os.getenv('JULEP_API_KEY'),
    environment=os.getenv('JULEP_ENVIRONMENT', 'production')
)

# Test connection
agent = client.agents.get(agent_id=os.getenv('AGENT_ID'))
print(f"Successfully created agent: {agent.id}")

script_dir = os.path.dirname(os.path.abspath(__file__))
yaml_path = os.path.join(script_dir, 'task.yaml')

with open(yaml_path, 'r') as file:
    task_definition = yaml.safe_load(file)

task = client.tasks.create(
    agent_id=agent.id,
    **task_definition # Unpack the task definition
)

def parseNameDateTime(topic):
    execution = client.executions.create(
        task_id=task.id,
        input={"topic": topic}
    )

    # Wait for the execution to complete
    while (result := client.executions.get(execution.id)).status not in ['succeeded', 'failed']:
        print(result.status)
        time.sleep(1)

    if result.status == "succeeded":
        return ast.literal_eval(result.output['choices'][0]['message']['content'])
    else:
        print(f"Error: {result}")

prompt = "Dr. Bhavarth Singh at 6:00 pm. Check if available"
parseNameDateTime(prompt)