from googletrans import Translator
import asyncio

async def to_english(text, language_code):
    if language_code in ['en-US', 'en-GB']:
        return text
    try:
        translator = Translator()
        source_lang = language_code.split('-')[0]
        translation = await translator.translate(text, src=source_lang, dest='en')
        return translation.text
    
    except Exception as e:
        raise Exception(f"Translation failed: {str(e)}")

async def to_vernacular(text, language_code):
    try:
        translator = Translator()
        dest_lang = language_code.split('-')[0]
        translation = await translator.translate(text, src='en', dest=dest_lang)
        print(translation.text)
        return translation.text
    
    except Exception as e:
        raise Exception(f"Translation failed: {str(e)}")