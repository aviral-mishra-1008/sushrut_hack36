'''
This is the training code that we used to train out first iteration of the 
NER model based on the BioBERT BASE Layer using RaTE-NER Dataset
'''
from datasets.RaTE_NER import *
from NER_model.model_pipe1 import *

dataset = RaTE_NER()
id2label,label2id,label_list = Mappings().load_mappings()

model = Bert_NER(label_list=label_list,id2label=id2label,label2id=label2id,base_name="dmis-lab/biobert-base-cased-v1.1")
tokenized_dataset = model.tokenize_dataset(dataset.data)

model.set_training_args()
model.train()
model.save_model()


'''
This model achieves a validation accuracy of 82% and performs decent on the unseen data from actual radiology reports
however considering our use-case of grounding the prompt for LLM, we would now try a text summarizer as well and then
try to come up with kind of a hybrid approach
'''


