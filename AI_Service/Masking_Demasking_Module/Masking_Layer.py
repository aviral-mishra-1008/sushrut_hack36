import spacy
import re
import uuid

class PIIMasker:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_lg")
        
        self.pii_patterns = {
            'phone': r'(?:\+91[\-\s]?)?[6789]\d{2,4}[\s-]?\d{2,4}[\s-]?\d{4}',
            'landline': r'(?:0\d{2,4}[-\s]?)?\d{6,8}',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'aadhaar': r'\b\d{4}\s?\d{4}\s?\d{4}\b',
            'pan': r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b',
            'pincode': r'(?<![\d-])\d{6}(?![\d-])',
            'passport': r'\b[A-Z][0-9]{7}\b',
            'gstin': r'\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}\b'
        }
        
        self.reset_mapping()

    def reset_mapping(self):
        self.mapping_dict = {}
        self.used_masks = set()

    def generate_mask(self, entity_type):
        while True:
            mask = f"[{entity_type}_{str(uuid.uuid4())[:8]}]"
            if mask not in self.used_masks:
                self.used_masks.add(mask)
                return mask

    def mask_pii(self, text):
        self.reset_mapping()
        
        lines = text.split('\n')
        masked_lines = []
        
        for line in lines:
            if not line.strip():
                masked_lines.append(line)
                continue
                
            current_line = line
            entities_to_mask = []
            
            doc = self.nlp(current_line)
            for ent in doc.ents:
                if ent.label_ in ['PERSON', 'GPE', 'ORG', 'LOC']:
                    if not any(term.lower() in ent.text.lower() for term in 
                             ['hospital', 'clinic', 'medical', 'healthcare', 'pharmacy']):
                        entities_to_mask.append((
                            ent.start_char,
                            ent.end_char,
                            ent.text,
                            ent.label_
                        ))
            
            for pattern_name, pattern in self.pii_patterns.items():
                for match in re.finditer(pattern, current_line):
                    if not any(term.lower() in match.group().lower() for term in 
                             ['hospital', 'clinic', 'medical', 'healthcare', 'pharmacy']):
                        entities_to_mask.append((
                            match.start(),
                            match.end(),
                            match.group(),
                            pattern_name
                        ))
            
            entities_to_mask.sort(key=lambda x: x[0], reverse=True)            
            masked_regions = set()
            
            for start, end, original, entity_type in entities_to_mask:
                if not any(start < m_end and end > m_start 
                          for m_start, m_end in masked_regions):
                    mask = self.generate_mask(entity_type)
                    current_line = current_line[:start] + mask + current_line[end:]
                    self.mapping_dict[mask] = original
                    masked_regions.add((start, end))
            
            masked_lines.append(current_line)
        
        final_text = '\n'.join(masked_lines)
        
        return final_text, self.mapping_dict

    def demask_pii(self, masked_text, mapping_dict):
        demasked_text = masked_text
        sorted_masks = sorted(mapping_dict.keys(), key=len, reverse=True)
        for mask in sorted_masks:
            demasked_text = demasked_text.replace(mask, mapping_dict[mask])
        return demasked_text