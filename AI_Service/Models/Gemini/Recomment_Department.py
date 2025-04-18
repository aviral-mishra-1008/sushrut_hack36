import os
import google.generativeai as genai
import json


class Gemini():
    def __init__(self,model_name:str = 'gemini-2.0-flash'):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_name)

        '''
            This needs to be sent from backend or fetched from backend, basically:
            SELECT UNIQUE department FROM doctors;

            UNCOMMENT FOR TESTING PURPOSE ONLY
        '''
        # if departments is None:
        #             departments = [
        #                             "Cardiology",
        #                             "Dermatology",
        #                             "Neurology",
        #                             "Orthopedics",
        #                             "Gastroenterology",
        #                             "Ophthalmology",
        #                             "ENT",
        #                             "Pulmonology",
        #                             "Endocrinology",
        #                             "General Medicine"
        #                         ]
        # self.departments = departments


    def predict_department(self,symptoms: str,departments:list) -> dict:
        prompt = f"""Given these patient symptoms and available departments, determine the most appropriate department.    
                     Available Departments:
                     {', '.join(departments)}
                     Patient Symptoms:
                        {symptoms}
                    
                    Respond with ONLY a valid JSON object and nothing else. The response must be in this exact format:
                    {{
                        "recommended_department": "department_name",
                        "confidence_score": 0.XX
                    }}
        
                    The confidence_score must be a number between 0 and 1.
                    Do not include any additional text, explanations, or formatting - just the JSON object."""
        
        response = self.model.generate_content(prompt)
        
        response_text = response.text.strip()
        if not response_text.startswith('{'):
            start_idx = response_text.find('{')
            if start_idx != -1:
                response_text = response_text[start_idx:]        
        end_idx = response_text.rfind('}')
        if end_idx != -1:
            response_text = response_text[:end_idx+1]
        
        result = json.loads(response_text)        
        if 'recommended_department' not in result or 'confidence_score' not in result:
            raise ValueError("Invalid response format from model")
        
        confidence = float(result['confidence_score'])
        if confidence > 0.75:
            result['message'] = f"Please consult the {result['recommended_department']} department"
        else:
            result['recommended_department'] = "General Medicine"
            result['message'] = "Please consult a General Physician"
        
        return result

