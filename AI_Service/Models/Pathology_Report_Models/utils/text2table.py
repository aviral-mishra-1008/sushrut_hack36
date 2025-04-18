import re
import pandas as pd
from collections import defaultdict

def extract_medical_report_data(text):

    # Define common pathological report terms and their variations
    # Format: {normalized_term: [list of variations/synonyms]}
    medical_terms = {
        # Patient information
        "Name": ["name", "patient name", "patient", "pt name"],
        "Age / Sex": ["age / sex", "age/sex", "age and sex", "age & sex", "age, sex"],
        "Age": ["age", "age in years", "patient age", "yrs", "years"],
        "Sex": ["sex", "gender"],
        "Referred by": ["referred by", "ref by", "reference", "referral", "referring doctor"],
        "Registration Number": ["reg. no.", "reg no", "registration no", "registration number", "id", "patient id"],
        "Registered on": ["registered on", "registration date", "reg date", "reg. date"],
        "Collected on": ["collected on", "collection date", "sample collected", "specimen collected", "date collected"],
        "Received on": ["received on", "reception date", "sample received", "specimen received", "date received"],
        "Reported on": ["reported on", "report date", "date reported", "date of report"],

        # Common CBC parameters
        "HEMOGLOBIN": ["hemoglobin", "hb", "hgb", "haemoglobin"],
        "TOTAL LEUKOCYTE COUNT": ["total leukocyte count", "tlc", "wbc", "white blood cell", "white blood cell count", "leukocytes"],
        "NEUTROPHILS": ["neutrophils", "neut", "neutro", "neutr", "neutrophil count", "neutrophil percentage"],
        "LYMPHOCYTE": ["lymphocyte", "lymphocytes", "lymph", "lymphs", "lymphocyte count", "lymphocyte percentage"],
        "EOSINOPHILS": ["eosinophils", "eos", "eosin", "eosinophil count", "eosinophil percentage"],
        "MONOCYTES": ["monocytes", "mono", "monos", "monocyte count", "monocyte percentage"],
        "BASOPHILS": ["basophils", "baso", "basos", "basophil count", "basophil percentage"],
        "PLATELET COUNT": ["platelet count", "platelets", "plt", "thrombocytes", "thrombocyte count"],
        "TOTAL RBC COUNT": ["total rbc count", "rbc", "red blood cell", "red blood cells", "erythrocytes", "erythrocyte count"],
        "HEMATOCRIT VALUE": ["hematocrit value", "hematocrit", "hct", "haematocrit", "packed cell volume", "pcv"],
        "MEAN CORPUSCULAR VOLUME": ["mean corpuscular volume", "mcv", "mean cell volume"],
        "MEAN CELL HAEMOGLOBIN": ["mean cell haemoglobin", "mch", "mean corpuscular haemoglobin"],
        "MEAN CELL HAEMOGLOBIN CON": ["mean cell haemoglobin con", "mchc", "mean corpuscular haemoglobin concentration"],

        # Other common tests
        "GLUCOSE": ["glucose", "blood glucose", "fasting glucose", "random glucose", "sugar", "blood sugar"],
        "CREATININE": ["creatinine", "creat", "serum creatinine"],
        "UREA": ["urea", "blood urea", "bun", "blood urea nitrogen"],
        "CHOLESTEROL": ["cholesterol", "total cholesterol", "serum cholesterol"],
        "TRIGLYCERIDES": ["triglycerides", "tg", "serum triglycerides"],
        "HDL": ["hdl", "hdl cholesterol", "high density lipoprotein"],
        "LDL": ["ldl", "ldl cholesterol", "low density lipoprotein"],
        "HBA1C": ["hba1c", "glycated hemoglobin", "glycosylated hemoglobin"],
    }

    term_lookup = {}
    for normalized, variations in medical_terms.items():
        for var in variations:
            term_lookup[var.lower()] = normalized

    # Preprocess text
    text = re.sub(r'\s+', ' ', text)
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Store extracted terms and values
    extracted_data = defaultdict(list)

    # Method 1: Extract key-value pairs with colon separator
    colon_pattern = re.compile(r'([^:]+)\s*:\s*([^:]+)')
    for line in lines:
        matches = colon_pattern.findall(line)
        for term, value in matches:
            term = term.strip().lower()
            value = value.strip()

            # Check if term should be normalized
            if term in term_lookup:
                normalized_term = term_lookup[term]
                extracted_data[normalized_term].append(value)

    # Method 2: Extract test results (name-value pairs)
    # First identify potential test result sections
    in_test_section = False
    test_lines = []

    for i, line in enumerate(lines):
        if re.search(r'(?:TEST|PARAMETER|EXAMINATION).*(?:VALUE|RESULT)', line, re.IGNORECASE) or \
                re.search(r'(?:HAEMATOLOGY|BIOCHEMISTRY|SEROLOGY|MICROBIOLOGY)', line, re.IGNORECASE):
            in_test_section = True

        elif in_test_section and re.search(r'(?:NOTE|INTERPRETATION|Clinical Notes|END OF REPORT)', line, re.IGNORECASE):
            in_test_section = False

        if in_test_section:
            test_lines.append(line)

    for line in test_lines:
        test_pattern1 = re.compile(r'([A-Za-z][\w\s\,\-\/]+?)\s+([HL]?\s*[\d\.\,]+)')
        matches = test_pattern1.findall(line)

        for term, value in matches:
            term = term.strip().lower()
            value = value.strip()

            # Skip if term is too short (likely a mistake)
            if len(term) < 2:
                continue

            # Check if term should be normalized
            if term in term_lookup:
                normalized_term = term_lookup[term]
                extracted_data[normalized_term].append(value)
            else:
                # Case for medical terms not in our dictionary
                # Check if any part of the term is a known variation
                term_words = term.split()
                for word in term_words:
                    if word in term_lookup:
                        normalized_term = term_lookup[word]
                        extracted_data[normalized_term].append(value)
                        break
                # else:
                #     # If term not recognized, use it directly if it seems like a valid test name
                #     if len(term.split()) >= 2 and re.match(r'^[A-Za-z]', term):
                #         normalized_term = term.upper()
                #         extracted_data[normalized_term].append(value)

    # Method 3: Extract patient name using regex pattern
    name_pattern = re.compile(r'(?:Mr\.|Mrs\.|Ms\.|Dr\.|Miss|Prof\.)\s+([A-Za-z\s\.]+)')
    for line in lines:
        name_matches = name_pattern.findall(line)
        for name in name_matches:
            name = name.strip()
            if name:
                extracted_data["Name"].append(name)

    # Method 4: Extract age/sex pattern
    age_sex_pattern = re.compile(r'(\d+)\s*(?:YRS|YEARS|Y)(?:\s*\/\s*|\s+)([MF])')
    for line in lines:
        age_sex_matches = age_sex_pattern.findall(line)
        for age, sex in age_sex_matches:
            extracted_data["Age / Sex"].append(f"{age} YRS / {sex}")


    terms = []
    values = []

    for term, vals in extracted_data.items():
        if vals:  
            terms.append(term)
            values.append(vals[0]) 

    # Create DataFrame
    df = pd.DataFrame({
        'Term': terms,
        'Value': values
    })

    return df

def format_tabular_output(df):
    df_with_index = df.reset_index()

    output = "\tTerm                  \t\tValue\n"
    for idx, row in df_with_index.iterrows():
        output += f"{idx:<5}\t{row['Term']:<30}\t{row['Value']}\n"

    return output

def process_medical_report(text):
    df = extract_medical_report_data(text)
    # formatted_output = format_tabular_output(df)
    df.to_csv('extracted_table.csv')
    return df