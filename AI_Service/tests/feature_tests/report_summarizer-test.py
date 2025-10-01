from LLM_Models.Pathology_Report_Models.utils.reportTables2Text import *
from LLM_Models.Pathology_Report_Models.utils.pdf2Text import *
from LLM_Models.Pathology_Report_Models.utils.text2table import *
from LLM_Models.Radiology_Report_Models.Summarization_model.summary_model import *
from LLM_Models.Gemini.Layman import *
import os


# Initializing the models
radio_summary_model = PDFSummarizer()
table_extractor = pathology_reports()
pdf_to_text = PDFTextExtractor()
explainer = Layman(os.getenv('GEMINI_API_KEY'))

def main():
    report_type = 0
    pdf_path = "./AI_Service/Models/Temp/test.pdf"

    if report_type == 0:
        print("Detected Radiology Report")
        outcome = radio_summary_model.summarize_pdf(pdf_path)
        print("Summary: ", outcome)
        explained = explainer.explain(outcome)
        print("Explained Summary: ", explained)
    
    elif report_type ==1:
        print("Detected Pathology Report")
        tables = table_extractor.get_valid_tables(pdf_path)
        
        if tables is not None:
            outcome = table_extractor.to_natural_language(tables)
        
        else:
            text = pdf_to_text.process_pdf(pdf_path)
            table = pdf_to_text.process_medical_report(text)
            if table is not None:
                outcome = table_extractor.to_natural_language(table)
            else:
                print("No valid tables found in the PDF.")

        explained = explainer.explain(outcome)
        print("Explained Summary: ", explained)
        print("Outcome: ", outcome)
    
    else:
        print("Invalid report type. Please choose 0 for Radiology or 1 for Pathology.")

if __name__ == "__main__":
    main()

            






