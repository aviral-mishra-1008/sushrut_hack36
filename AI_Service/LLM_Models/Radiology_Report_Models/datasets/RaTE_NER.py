from datasets import load_dataset
import json 

'''
Refer to this paper: https://arxiv.org/pdf/2406.16845v2
Huge thanks to the researchers at Shanghai Artificial Intelligence Laboratory and School of Artificial Intelligence, Shanghai Jiao Tong University

Authors
----------------
Weike Zhao 
Chaoyi Wu
Xiaoman Zhang
Ya Zhang
Yanfeng Wang
Weidi Xie

For providing the RaTE-NER dataset under Creative Commons License 
which was very helpful in our use case for training an NER model over BioBERT 
for radiology reports
'''

class RaTE_NER:
    def __init__(self,name="Angelakeke/RaTE-NER",data_struct={"train": "MIMIC_IV/train_IOB.json","test": "MIMIC_IV/test_IOB.json","validation": "MIMIC_IV/dev_IOB.json"}):
        self.dataset_name = name
        self.data_struct = data_struct
        self.data = load_dataset(self.dataset_name,data_files=data_struct)

class Mappings:
    def __init__(self,path="datasets\mappings.json"):
        self.path = path

    def load_mappings(self,path="datasets\mappings.json"):
        with open(path,'r') as file:
            data = json.load(file)
        
        id2label = dict()
        label2id = dict()

        for key,value in data['NER_TAGS_MAPPING'].items():
            id2label[int(key)] = value
        
        for key,value in data['NER_TAGS_MAPPING'].items():
            label2id[value] = int(key)
        
        label_list = list(label2id.keys())
        
        return id2label,label2id,label_list


'''
Test code
dataset = RaTE_NER()
mappings = dataset.load_mapping()
print(mappings)
'''
        