from django.views.generic import TemplateView, CreateView
from maps.models import Map
from django.http.response import HttpResponse
import json
from mongo_models import create_gridfs
from django.core.urlresolvers import reverse
import tempfile

# Create your views here.

class NewMapView(TemplateView):
    template_name = 'maps/map_form.html'

def save_map(request, map_id):
    params = request.POST
    if params:
        floor_name = params.get('floor_name')
        cluster_json = params.get('cluster_json')
        image = request.FILES['image']
    pass


def download_image(request, image_id):
    all_maps = Map.objects.all()
    for m in all_maps:
        for f in m.floors:
            if str(f.img._id) == image_id:
                image = f.img
    return HttpResponse(image.read(), content_type="image/jpg")


def upload_file(request):
    f = request.FILES['file']
    id = create_gridfs(f)
    url = request.build_absolute_uri (
        reverse(download_image, args=(str(id), )))
    #render html file

def save_map(request):
    pass

def filter_by_meta(qset, k, v):
    #return all maps for which meta.k == v
    pass

def search_maps(request):
    filters = request.GET
    all_maps = Map.objects.all()
    #apply filters here
    for key, value in filters.iteritems():
        all_maps = filter_by_meta(all_maps, key, value)
    filtered_maps = list(all_maps.values('name','id'))
    return HttpResponse(json.dumps(filtered_maps), mimetype='application/json')


