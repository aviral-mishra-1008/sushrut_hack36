import PyPDF2
import re
from transformers import pipeline

class PDFSummarizer:
    def __init__(self,base_model="facebook/bart-large-cnn",chunk_size=1024):
        self.base_model = pipeline("summarization", model=base_model)
        self.max_chunk_length = chunk_size
    
    def extract_text(self,pdf_file):
        '''
            This function takes in path to a pdf then uses the PyPDF2 library to
            extract the text from the pdf file and return the same
        '''

        pdf_reader = PyPDF2.PdfReader(pdf_file)    
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        return text
    
    def clean_text(self,text):
        '''
            Now, most pdf in our use case will have patient name, some medical record number 
            age and other personal details, now as a good practice we wish to remove or hide these details 
            for this purpose we are using regular expression matching for this purpose later we plan to use 
            some better approach 
        '''
        patterns = {
            'patient': r'(?:PATIENT|NAME)\s*:?\s*([A-Z][A-Za-z-]+\s+[A-Z][A-Za-z-]+)', 
            'mrn': r'\b(MRN|Medical Record Number)\s*:?\s*\d+\b',  
            'date': r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b',  
            'age': r'\b(age|aged|years old)\s*:?\s*\d+\b',  
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  
            'email': r'\S+@\S+\.\S+',
        }
        
        cleaned_text = text
        for _, pattern in patterns.items():
            cleaned_text = re.sub(pattern, "", cleaned_text, flags=re.MULTILINE)
        
        return cleaned_text
    
    def summarize_text(self,text):
        '''
            Takes in the cleaned text and then summarizes that using the Facebook's base model by default
            We tried multiple models including the Facebook Bart Large CNN, FalconsAI Medical Summarizer
            and many others and the Bart Large CNN works the best
        '''
        chunks = [text[i:i + self.max_chunk_length] for i in range(0, len(text), self.max_chunk_length)]
        
        summaries = []
        for chunk in chunks:
            summary = self.base_model(chunk, max_length=150, min_length=30, do_sample=False)
            summaries.append(summary[0]['summary_text'])

        return " ".join(summaries)
    
    def summarize_pdf(self,path):
        '''
             Basically a single input output function combining all others
        '''
        text = self.extract_text(path)
        clean_text = self.clean_text(text)
        summarized_text = self.summarize_text(clean_text)
        return summarized_text