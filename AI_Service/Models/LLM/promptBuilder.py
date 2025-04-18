import os
import tempfile

TEMP_DIR = tempfile.gettempdir()
REPORT_DIR = os.path.join(TEMP_DIR, "medical_reports")
os.makedirs(REPORT_DIR, exist_ok=True)

def save_report(file, filename):
    if file:
        filepath = os.path.join(REPORT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(file)
        return filepath
    return None

def read_report(filepath):
    if filepath and os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def classify_level(user_input, pathology_text="", radiology_text=""):
    total_text = f"{user_input}{pathology_text}{radiology_text}".lower()
    length = len(total_text.split())

    if any(kw in total_text for kw in ["diagnosis", "differentiate", "differential", "recommend treatment", "advanced staging"]):
        return "advanced"
    elif length > 150 or any(kw in total_text for kw in ["interpret", "analyze", "compare", "correlate"]):
        return "medium"
    else:
        return "basic"
    
def build_prompt(user_input, pathology_path= None, radiology_path= None):
    pathology_content = read_report(pathology_path)
    radiology_content = read_report(radiology_path)

    level = classify_level(user_input, pathology_content, radiology_content)

    sections = [f"User Prompt:\n{user_input}"]
    if pathology_content:
        sections.append(f"Pathology Report:\n{pathology_content}")
    if radiology_content:
        sections.append(f"Radiology Report:\n{radiology_content}")

    base_prompt = "\n\n".join(sections)

    if level == "basic":
        instruction = "\n\nRespond with general medical advice based on the above."
    elif level == "medium":
        instruction = "\n\nAnalyze the medical context in moderate detail. Provide interpretations."
    else:  # advanced
        instruction = "\n\nGive a deep clinical analysis integrating all reports. Include possible diagnoses, recommendations, and next steps."

    return base_prompt + instruction, level

