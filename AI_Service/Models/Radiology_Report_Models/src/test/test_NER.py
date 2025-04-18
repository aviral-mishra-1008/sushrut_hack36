from datasets.RaTE_NER import *
from NER_model.model_pipe1 import *

id2label,label2id,label_list = Mappings().load_mappings()
model = Bert_NER(label_list=label_list,label2id=label2id,id2label=id2label)
path = "__ENTER_MODEL_FOLDER__PATH__"
model.load_model(path)

text = input("Enter Text: ")
output = model.tag(text)

print(f"\nText: {text}")
print("Entities found:")
for entity, label in output:
    print(f"  • {entity}: {label}")

'''
Sample: 
Text: Patient presents with left superior eye lid thickening and orbital cellulitis
Entities found:
  • left: ANATOMY
  • superior: ANATOMY
  • eye: ANATOMY
  • lid: ANATOMY
  • thickening: ABNORMALITY
  • orbital: DISEASE
  • cellulitis: DISEASE

Text: There is evidence of pneumonia in the right lower lobe
Entities found:
  • pneumonia: DISEASE
  • right: ANATOMY
  • lower: ANATOMY
  • lobe: ANATOMY

Text: MRI shows multiple lesions in the temporal lobe with surrounding edema
Entities found:
  • multiple: ABNORMALITY
  • lesions: ABNORMALITY
  • temporal: ANATOMY
  • lobe: ANATOMY
  • surrounding: DISEASE
  • edema: DISEASE
'''