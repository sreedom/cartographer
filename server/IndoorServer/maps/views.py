from django.views.generic import TemplateView, CreateView
from maps.models import Map
from django.http.response import HttpResponse, Http404
import json
from mongo_models import create_gridfs, get_file
from django.core.urlresolvers import reverse
import tempfile
import pymongo
from bson.json_util import dumps, loads
from bson import ObjectId

client = pymongo.mongo_client.MongoClient()
db = client.my_database

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
    try:
        image = get_file(db, image_id)
    except:
        image = None

    if image:
        return HttpResponse(image.read(), content_type="image/jpg")
    else:
        raise Http404("nothing to see here. move on")

def download_map(request, map_id):
    collection = db.maps_map
    _map = collection.find_one({'_id':ObjectId(map_id)})
    if not _map:
        raise Http404
    else:
        return HttpResponse(dumps(_map), mimetype='application/json')

def upload_file(request):
    #import ipdb; ipdb.set_trace()  # XXX BREAKPOINT
    f = request.FILES['file']
    id = create_gridfs(f,f.name,db)
    url = request.build_absolute_uri (
        reverse(download_image, args=(str(id), )))
    #render html file
    result = {'url':url, 'id':str(id)}
    return HttpResponse(json.dumps(result), mimetype='application/json')

def save_map(request):
    '''sample json input

    '''
    pass



def update_map(request, map_id):
    collection = db.maps_map
    floor_data = loads(request.POST.get('floor_data'))
    resp = collection.update({'_id':ObjectId(map_id)},
                      {'$push':{'floors':floor_data}})
    return HttpResponse(json.dumps(resp), mimetype='application/json')

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


