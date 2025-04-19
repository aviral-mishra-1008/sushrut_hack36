from Summarization_model.summary_model import *
import os


#Added Path
path_pdf = os.path.join("src","test","assets","radiology-report-template-sample.pdf")

#Imported model pipeline
summarizer = PDFSummarizer()

#Passed path to get the text
summary = PDFSummarizer.summarize_pdf(path_pdf)

#Print results
print(summary)


'''
Here's how the result was:

Pneumothorax and scant pleural effusion are consistent with recent thoracocentesis. 
Suspected soft tissue masses within the right caudal and 
right cranial lung lobes are strongly concerning for primary or metastatic neoplasia. 
Gallbladder mineralization is of unknown clinical significance. 
There is widening and increased soft tissue opacity of the cranialmediastinum, with mild dorsal deviation of the caudal thoracic trachea.
There is mineral opacity in the region of the gallbladder. Multiple sites of spondylosis are considered incidental.

'''
