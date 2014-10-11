from django.views.generic import TemplateView, CreateView
from maps.models import Map
from django.http.response import HttpResponse
import json
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

def filter_by_meta(qset, key,value):
    return qset


def serialize_clusters(cluster_obj):
    cluster_obj.topLeft = {'x':cluster_obj.topLeft.x,
                           'y': cluster_obj.topLeft.y}
    cluster_obj.bottomRight = {'x':cluster_obj.bottomRight.x,
                           'y': cluster_obj.bottomRight.y}

def serialize_floors(floor_obj):
    floor_obj.clusters = map(serialize_clusters, floor_obj.clusters)
    return floor_obj

def serialize_map(map_obj):
    #serialize all floors
    map_obj.floors = map(serialize_floors, map_obj.floors)
    return map_obj


def search_maps(request):
    filters = request.GET
    all_maps = Map.objects.all()
    #apply filters here
    for key, value in filters.iteritems():
        all_maps = filter_by_meta(all_maps, key, value)
    filtered_maps = list(all_maps.values('name','id'))
    return HttpResponse(json.dumps(filtered_maps), mimetype='application/json')


