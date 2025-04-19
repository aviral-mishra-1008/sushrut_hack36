import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

models = ["medalpaca/medalpaca-7b","Qwen/Qwen2-0.5B-Instruct"]
test_device = "cuda" if torch.cuda.is_available() else "cpu"
model_choice = models[0] if test_device=="cuda" else models[1]

class LLM:
    def __init__(self,model_name=None):
        if model_name is None:
            model_name = model_choice
        self.device = torch.device(test_device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)

    def generate(self, prompt):
        if test_device=="cuda":
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            output = self.model.generate(input_ids, max_length=512, no_repeat_ngram_size=3, top_p=0.9, temperature=0.7, do_sample=True)
            return self.tokenizer.decode(output[0], skip_special_tokens=True).replace(prompt, "").strip()
        else:
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            output = self.model.generate(input_ids, max_length=256, no_repeat_ngram_size=3, top_p=0.9, temperature=0.5, do_sample=True)
            return self.tokenizer.decode(output[0], skip_special_tokens=True).replace(prompt, "").strip()
    
    def generate_test(self,prompt,max_length=512, no_repeat_ngram_size=3, top_p=0.9, temperature=0.7, do_sample=True):
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            output = self.model.generate(input_ids, max_length=max_length, no_repeat_ngram_size=no_repeat_ngram_size, top_p=top_p, temperature=temperature, do_sample=do_sample)
            return self.tokenizer.decode(output[0], skip_special_tokens=True).replace(prompt, "").strip()

'''
    The LLMs have been decided after a lot of consideration, a number of models were tried and tested and the best ones were selected.
    The models tested include:
        1. medicalai/ClinicalBERT
        2. distilBERT 
        3. Microsoft's BioGPT-LARGE
        4. BioGPT-large-QA-Pubmed
        5. TinyLlama 1.1B
        6. Google Flan t5
        7. medicalai/ClinicalGPT-base-zh

    The choices were tested in Google Colab: https://colab.research.google.com/drive/1WwTq0YPuA95Di4EbWZzqERXymtztadj5?usp=sharing

    The ultimate choice for a GPU based model was Medalpaca-7b model which is a 7 Billion Parameter model which was tested on T4 GPU
    The model perfomed well and gave quite descriptive answers to the prompts given to it. The 8-bit quantization enabled the model to 
    work satisfactorily on an 8GB VRAM setup

    Then finding the best model for CPU based setup was a bit tricky, as the models were not performing well on CPU
    mostly halucinating, and since in general the medical content is a bit low, we tried approaches of using MaskedLM and BERT based
    models to fill in the MASKS as we require these models for testing purpose only since we don't own NVIDIA's Shovels :_)

    Lastly, the best model turned out to be Qwen2-0.5B-Instruct which is a 500 Million Parameter model
    Its a CausalLM and works well on CPU, the model is quite descriptive and gives good answers to the prompts given to it after some prompt engineering
    The model's speed of response generation and quality makes it a good choice for CPU based setups
'''