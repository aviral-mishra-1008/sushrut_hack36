import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io

class PDFTextExtractor:

    def extract_images_from_pdf(self, pdf_path):
        
        #Extracts images from the PDF file.
    
        pdf_document = fitz.open(pdf_path)
        images = []
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            image_list = page.get_images(full=True)

            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image = Image.open(io.BytesIO(image_bytes))
                images.append(image)

        return images

    def extract_text_from_images(self, images):
  
        #Performs OCR on the extracted images and returns the text.

        extracted_text = ""
        for image in images:
            text = pytesseract.image_to_string(image)
            extracted_text += text + "\n"

        return extracted_text

    def process_pdf(self,pdf_path):
  
        #Processes the PDF file: extracts images, performs OCR, and returns the text.
        
        images = self.extract_images_from_pdf(pdf_path)
        extracted_text = self.extract_text_from_images(images)
        return extracted_text