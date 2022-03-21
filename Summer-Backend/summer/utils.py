"""Translates text into the target language.

Target must be an ISO 639-1 language code.
See https://g.co/cloud/translate/v2/translate-reference#supported_languages
"""
import os
from google.cloud import translate_v2 as translate

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'summer/summer-credentials.json'

translate_client = translate.Client()

results = translate_client.get_languages()

for language in results:
    print(u"{name} ({language})".format(**language))