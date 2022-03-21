from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Getting request when the user clicks the translate button
# Supports Chinese, Spanish, French, German, Italian, and Malay.
@csrf_exempt
def translate(request): 
    if request.method == 'POST':
        from google.cloud import translate_v2 as translate

        translate_client = translate.Client()
        translation = translate_client.translate(request.POST['text'], target_language=request.POST['target_language'], format_='text')
        return HttpResponse(translation['translatedText'])