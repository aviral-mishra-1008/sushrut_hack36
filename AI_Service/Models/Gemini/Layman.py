import google.generativeai as genai

class Layman:
    def __init__(self, api_key: str):
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-2.0')

    def explain(self, medical_text: str) -> str:
        """
        Send medical text to Gemini and get a layman-friendly explanation
        """
        prompt = f"""
        Please explain the following medical/pathology report in simple terms that a person with no medical background can understand. 
        Make it conversational and easy to understand, avoiding technical terms where possible.
        If there are any concerning values or important points, highlight them clearly.

        Here's the report:
        {medical_text}
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error getting explanation: {str(e)}"