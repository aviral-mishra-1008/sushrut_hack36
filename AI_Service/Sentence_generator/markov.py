import re
import random
import json
from collections import defaultdict

class MarkovChain:
    def __init__(self, order=3):  
        self.order = order
        self.model = defaultdict(list)
        
    def clean_text(self, text):
        text = re.sub(r'[^\w\s.,!?]', ' ', text.lower())
        text = re.sub(r'\d+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        words = text.split()
        return words

    def train(self, text):
        words = self.clean_text(text)
        if len(words) <= self.order:
            return
    
        for i in range(len(words) - self.order):
            state = tuple(words[i:i + self.order])
            next_word = words[i + self.order]
            self.model[state].append(next_word)
    
    def generate_text(self, seed_word, length=50):
        valid_states = [state for state in self.model.keys() if seed_word.lower() in state]
        if not valid_states:
            return f"Could not find seed word '{seed_word}' in the model."
        
        current_state = random.choice(valid_states)
        result = list(current_state)
        
        for _ in range(length - self.order):
            if current_state not in self.model:
                break
            
            next_word = random.choice(self.model[current_state])
            result.append(next_word)
            current_state = tuple(result[-self.order:])
        
        return ' '.join(result)
    
    def save_model(self, filename):
        model_dict = {','.join(key): value for key, value in self.model.items()}
        with open(filename, 'w') as f:
            json.dump({'order': self.order, 'model': model_dict}, f)
    
    @classmethod
    def load_model(cls, filename):
        with open(filename, 'r') as f:
            data = json.load(f)
        
        model = cls(order=data['order'])
        model.model = defaultdict(list, {
            tuple(key.split(',')): value 
            for key, value in data['model'].items()
        })
        return model