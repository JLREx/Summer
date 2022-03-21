from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .forms import UploadFileForm

def upload_blob(source_file_path, bucket_name='summer-vision'):
    from google.cloud import storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    destination_blob_name = source_file_path.split('\\')[-1]
    
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_path)
    return '.'.join(destination_blob_name.split('.')[:-1])

# Extract text from docx file
def extract_text_from_docx(file):
    from docx2python import docx2python
    content = docx2python(file, extract_image=False) 
    return content.text

# Extract text from image file
def extract_text_from_image(file):
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()
    with open(file, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.document_text_detection(image=image)
    texts = response.text_annotations[0].description.replace('\n', ' ')
    return texts

# Extract text from pdf file
def extract_text_from_pdf(source_file_path):
    import re
    import json
    from google.cloud import vision
    from google.cloud import storage

    base_name = upload_blob(source_file_path) # Need to get filename here
    gcs_source_uri = ''.join(['gs://summer-vision/', base_name, '.pdf'])
    gcs_destination_uri = ''.join(['gs://summer-vision/', base_name, '.json'])
    mime_type = 'application/pdf'

    client = vision.ImageAnnotatorClient()
    feature = vision.Feature(type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)

    gcs_source = vision.GcsSource(uri=gcs_source_uri)
    input_config = vision.InputConfig(gcs_source=gcs_source, mime_type=mime_type)
    gcs_destination = vision.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.OutputConfig(gcs_destination=gcs_destination)

    async_request = vision.AsyncAnnotateFileRequest(features=[feature], input_config=input_config, output_config=output_config)
    operation = client.async_batch_annotate_files(requests=[async_request])
    operation.result(timeout=420)

    storage_client = storage.Client()
    match = re.match(r'gs://([^/]+)/(.+)', gcs_destination_uri)
    bucket_name = match.group(1)
    prefix = match.group(2)

    bucket = storage_client.get_bucket(bucket_name)
    blob_list = [blob for blob in list(bucket.list_blobs(
        prefix=prefix)) if not blob.name.endswith('/')]

    annotation_list = []
    for output in blob_list:
        json_string = output.download_as_string()
        response = json.loads(json_string)
        annotation_list.append(' '.join([page_response['fullTextAnnotation']['text'] for page_response in response['responses']]))
    return ''.join(annotation_list)

# Check if the file is an image file or a PDF file
@csrf_exempt
def detect_text_from_files(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file_type = request.FILES['file'].name.split('.')[-1]
            if (file_type == 'png' or file_type == 'jpg' or file_type == 'jpeg'):
                return HttpResponse(extract_text_from_image(request.FILES['file'].temporary_file_path()))

            elif (file_type == 'pdf'):
                return HttpResponse(extract_text_from_pdf(request.FILES['file'].temporary_file_path()))
            
            elif (file_type == 'docx'):
                return HttpResponse(extract_text_from_docx(request.FILES['file']))