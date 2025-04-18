from Masking_Layer import PIIMasker

masker = PIIMasker()

sample_text ="""
Patient Name: Rajesh Kumar Sharma
Address: Flat No. 402, Shanti Apartments, Sector 15, Noida, UP - 201301
Contact Details:
    Mobile: +91 98765 43210
    Landline: 011-26547890
    Email: rajesh.sharma1985@gmail.com
Aadhaar: 4321 5678 9012
PAN: ABCDE1234F
Emergency Contact: Priya Sharma (Wife) - +91 87654 32109

Medical History:
The patient visited Dr. Mehta at Apollo Hospital, Delhi on 12th April 2025
Symptoms: Persistent fever, body ache, and weakness for the past 3 days
Current Medications: Taking Paracetamol for fever
Previous Conditions: Type-2 Diabetes, managed with Metformin 500mg
"""

masked_text, mapping = masker.mask_pii(sample_text)

print("Original Text:")
print(sample_text)
print("\nMasked Text:")
print(masked_text)
print("\nMapping Dictionary:")
print(mapping)

demasked_text = masker.demask_pii(masked_text, mapping)
print("\nDemasked Text:")
print(demasked_text)

'''
OUTPUT:

********MASKED OUTPUT********
Patient Name: [PERSON_54f41118]
Address: Flat No. 402, Shanti Apartments, Sector 15, [GPE_141a85ba], UP - [landline_94e54923]
Contact Details:
    Mobile: [phone_b53c0a4c]0
    Landline: [landline_744ad7c8]
    Email: [email_e10be06d]
Aadhaar: [aadhaar_f4c7efd7]
[ORG_8567fa36]: [pan_63719aae]
Emergency Contact: [PERSON_9b20ffdf] (Wife) - [phone_6309a902]9

Medical History:
The patient visited Dr. [PERSON_4c814506] at Apollo Hospital, [GPE_c4450a0f] on 12th April 2025
Symptoms: Persistent fever, body ache, and weakness for the past 3 days
Current Medications: Taking Paracetamol for fever
Previous Conditions: Type-2 Diabetes, managed with Metformin 500mg


********DATA DICT********
Mapping Dictionary:
{'[PERSON_54f41118]': 'Rajesh Kumar Sharma', '[landline_94e54923]': '201301', '[GPE_141a85ba]': 'Noida', '[phone_b53c0a4c]': '+91 98765 4321', '[landline_744ad7c8]': '011-26547890', '[email_e10be06d]': 'rajesh.sharma1985@gmail.com', '[aadhaar_f4c7efd7]': '4321 5678 9012', '[pan_63719aae]': 'ABCDE1234F', '[ORG_8567fa36]': 'PAN', '[phone_6309a902]': '+91 87654 3210', '[PERSON_9b20ffdf]': 'Priya Sharma', '[GPE_c4450a0f]': 'Delhi', '[PERSON_4c814506]': 'Mehta'}


*********DEMASKED TEXT***********
Patient Name: Rajesh Kumar Sharma
Address: Flat No. 402, Shanti Apartments, Sector 15, Noida, UP - 201301
Contact Details:
    Mobile: +91 98765 43210
    Landline: 011-26547890
    Email: rajesh.sharma1985@gmail.com
Aadhaar: 4321 5678 9012
PAN: ABCDE1234F
Emergency Contact: Priya Sharma (Wife) - +91 87654 32109

Medical History:
The patient visited Dr. Mehta at Apollo Hospital, Delhi on 12th April 2025
Symptoms: Persistent fever, body ache, and weakness for the past 3 days
Current Medications: Taking Paracetamol for fever
Previous Conditions: Type-2 Diabetes, managed with Metformin 500mg

'''