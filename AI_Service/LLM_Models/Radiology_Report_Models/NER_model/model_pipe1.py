import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer
from seqeval.metrics import accuracy_score, precision_score, recall_score, f1_score


class Bert_NER:
    def __init__(self,label_list, id2label,label2id,base_name=None):
        self.base_name = base_name
        self.id2label = id2label
        self.label2id = label2id
        self.label_list = label_list
        if base_name is not None:
            self.model = AutoModelForTokenClassification.from_pretrained(base_name,num_labels=len(label_list),id2label=id2label,label2id=label2id)
            self.tokenizer = AutoTokenizer.from_pretrained(base_name)

    def tokenize_and_align_labels(self,sentence):
        tokenized_inputs = self.tokenizer(
            sentence["tokens"],
            truncation=True,
            is_split_into_words=True,
            padding='max_length',
            max_length=128,
            return_tensors=None  #This ensures we get a dict instead of pytorch tensors
        )

        labels = []

        #This is actually based on the structure of the dataset RaTE-NER
        for i, label in enumerate(sentence["ner_tags"]):  
            word_ids = tokenized_inputs.word_ids(batch_index=i)
            previous_word_idx = None
            label_ids = []

            for word_idx in word_ids:
                if word_idx is None:
                    label_ids.append(-100)
                elif word_idx != previous_word_idx:
                    label_ids.append(int(label[word_idx]))
                else:
                    label_ids.append(-100)
                previous_word_idx = word_idx

            labels.append(label_ids)

        tokenized_inputs["labels"] = labels
        return tokenized_inputs
    
    def tokenize_dataset(self,dataset,format="torch"):
        tokenized = dataset.map(
            self.tokenize_and_align_labels,
            batched=True,
            remove_columns=dataset["train"].column_names,
            load_from_cache_file=False
        )

        tokenized.set_format(format)
        return tokenized
    
    def metrics(self,eval_preds):
        predictions, labels = eval_preds
        predictions = np.argmax(predictions, axis=2)

        # Remove ignored index (special tokens)
        true_predictions = [
            [self.id2label[p] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]
        true_labels = [
            [self.id2label[l] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]

        return {
            "accuracy": accuracy_score(true_labels, true_predictions),
            "precision": precision_score(true_labels, true_predictions),
            "recall": recall_score(true_labels, true_predictions),
            "f1": f1_score(true_labels, true_predictions)
        }
     
    def set_training_args(self,epochs=3,learing_rate=2e-5,weight_decay=0.01,logging_steps=100,evaluation_startegy="epoch",save_strategy="epoch",per_device_train_batch_size=16,per_device_eval_batch_size=16):
        return TrainingArguments(
            output_dir="./results",
            evaluation_strategy=evaluation_startegy,
            learning_rate=learing_rate,
            per_device_train_batch_size=per_device_train_batch_size,
            per_device_eval_batch_size=per_device_eval_batch_size,
            num_train_epochs=epochs,
            weight_decay=weight_decay,
            push_to_hub=False,
            logging_dir='./logs',
            logging_steps=logging_steps,
            save_strategy=save_strategy,
            load_best_model_at_end=True,
            metric_for_best_model="f1"
        )
     
    def train(self,training_args,tokenized_dataset):
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=tokenized_dataset["train"],
            eval_dataset=tokenized_dataset["validation"],
            tokenizer=self.tokenizer,
            compute_metrics=self.metrics
        )

        trainer.train()
        evaluation_results = trainer.evaluate()
        return evaluation_results
    
    def save_model(self,path="./radiology-ner-model"):
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)
        print("Saved Successfully!!")

    def load_model(self,path):
        self.tokenizer = AutoTokenizer.from_pretrained(path)
        self.model = AutoModelForTokenClassification.from_pretrained(
            path,
            id2label=self.id2label,
            label2id=self.label2id
        )
    
    def tag(self,text):
        words = text.split()
        inputs = self.tokenizer(
            words,
            is_split_into_words=True,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        self.model.eval()  
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = torch.argmax(outputs.logits, dim=2)

        predicted_labels = []
        word_ids = inputs.word_ids(batch_index=0)
        current_word = None
        current_entity = None
        entity_words = []

        for idx, (word_id, pred) in enumerate(zip(word_ids, predictions[0])):
            if word_id is None:
                continue

            if word_id != current_word:
                if current_entity and entity_words:
                    predicted_labels.append((" ".join(entity_words), current_entity))
                    entity_words = []

                current_word = word_id
                pred_label = self.id2label[str(pred.item())]  

                if pred_label != "O":
                    if pred_label.startswith("B-"):
                        current_entity = pred_label[2:]
                        entity_words = [words[word_id]]
                    elif pred_label.startswith("I-"):
                        if current_entity and pred_label[2:] == current_entity:
                            entity_words.append(words[word_id])
                else:
                    current_entity = None

        if current_entity and entity_words:
            predicted_labels.append((" ".join(entity_words), current_entity))

        return predicted_labels
            