from camelot import read_pdf as camelot_read_pdf
import pandas as pd
import numpy as np

class pathology_reports:
    def __init__(self):
        self.units = ['g/dl', 'g/ml', '%', 'mg/dl', 'mmol/L', 'cells/mcL', 'mEq/L', 'pg', 'fl', '/mm3', 'U/L'] #add more units as we expand project
        self.max_chars = 35
        self.char_threshold = 5
        self.clean_threshold = 50
    
    def check_medical_units(self,df):
        text = df.to_string().lower()
        return any(unit.lower() in text for unit in self.units)
    
    def extract_medical_tables(self,pdf_path,flavorType):
        tables = camelot_read_pdf(pdf_path, pages='all', flavor=flavorType)
        medical_tables = []
        
        for table in tables:
            if self.check_medical_units(table.df):
                medical_tables.append(table.df)
        
        if medical_tables:
            final_df = pd.concat(medical_tables, ignore_index=True)
            return final_df
        return None

    def validate_cell_lengths(self, df):
        cell_lengths = df.astype(str).applymap(len)
        avg_length = np.mean(cell_lengths.values)
        return avg_length <= self.max_chars
    
    def get_valid_tables(self, pdf_path):
        lattice_df = self.extract_medical_tables(pdf_path, "lattice")
        stream_df = self.extract_medical_tables(pdf_path, "stream")
        
        valid_tables = []
        
        if lattice_df is not None and self.validate_cell_lengths(lattice_df):
            valid_tables.append(lattice_df)
            
        if stream_df is not None and self.validate_cell_lengths(stream_df):
            valid_tables.append(stream_df)
            
        if valid_tables:
            return pd.concat(valid_tables, ignore_index=True)
        return None

    def clean_by_cell_length(self, df):
        cell_lengths = df.astype(str).applymap(len)
        mean_length = np.mean(cell_lengths.values)
        mask = cell_lengths.apply(lambda x: all(val <= mean_length + self.clean_threshold for val in x), axis=1)
        return df[mask]

    def is_pure_number(self, value):
        try:
            float(str(value).replace(',', ''))
            return True
        except ValueError:
            return False
            
    def is_number_with_unit(self, value):
        value = str(value).replace(',', '')
        for unit in self.units:
            if unit in value.lower():
                try:
                    float(value.lower().replace(unit.lower(), ''))
                    return True
                except ValueError:
                    continue
        return False
        
    def check_sequence(self, values):
        if len(values) == 4:
            return (not self.is_pure_number(values[0]) and 
                   self.is_pure_number(values[1]) and 
                   not self.is_pure_number(values[2]))
                   
        elif len(values) == 3:
            return (not self.is_pure_number(values[0]) and 
                   self.is_number_with_unit(values[1]))
        return False
    
    def to_natural_language(self, df):
        sentences = []
        for _, row in df.iterrows():
            values = [val for val in row.astype(str).values if val and val.strip() and val.lower() != 'nan']
            
            if not self.check_sequence(values):
                continue
                
            if len(values) == 4:
                sentence = f"The {values[0]} measurement shows {values[1]}, {values[2]} with reference range: {values[3]}"
                sentences.append(sentence)
            elif len(values) == 3:
                sentence = f"The {values[0]} measurement shows {values[1]} with reference range: {values[2]}"
                sentences.append(sentence)
        
        if not sentences:
            return ""
            
        if len(sentences) == 1:
            return sentences[0]
            
        return ". ".join(sentences[:-1]) + ". Lastly, " + sentences[-1]
