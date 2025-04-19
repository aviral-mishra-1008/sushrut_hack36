from    LLM_Models.LLM.Styles import *

'''
    Prompt will be ehnaced over time to include other components as 
    we enable option to extract tables from lab reports and other medical documents
    along with medical history data and diagonostic history
'''

class PromptBuilder:
    def __init__(self, style: Style = Style.SIMPLE):
        self.style = style

    def build_prompt(self, symptoms: str) -> str:
        symptoms = symptoms.strip()
        
        if self.style == Style.SIMPLE:
            return f"Given the following symptoms: {symptoms} please provide a medical feedback."
        
        elif self.style == Style.FOCUSED:
            return f"""You are a medical assistant. Based on the symptoms provided,give a description of what the patient is experiencing, be comforting in nature.
                        Do not provide a definitive diagnosis, only a description.\n\n
                        Symptoms: {symptoms}\nPossible reasons:"""
            
        elif self.style == Style.ADVANCED:
            return f"""You are a medical assistant, be comforting in nature and 
                       please provide a detailed medical analysis of these symptoms:
                            {symptoms}

                        Please include:
                        - Possible conditions
                        - Level of concern (emergency/non-emergency)
                        - When to seek medical attention
                        - Common causes"""

    def change_style(self, new_style: Style):
        self.style = new_style