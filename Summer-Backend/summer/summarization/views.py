from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def summarize(request): 
    if request.method == 'POST':     
        from simplet5 import SimpleT5

        model = SimpleT5()
        model.load_model('t5', r'C:\Users\jiale\Jupyter Notebook\TNL\Summer\summer\summarization\simplet5-epoch-0-train-loss-1.6666-val-loss-1.4172')

        text = """summarize: {}""".format(request.POST['text'])
        return HttpResponse(model.predict(text)[0])