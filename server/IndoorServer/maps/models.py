from django.db import models
from djangotoolbox.fields import EmbeddedModelField, ListField, SetField
from django_mongodb_engine.fields import GridFSField
import json
from django_mongodb_engine.contrib import MongoDBManager

# Create your models here.
#models for maps and so forth.

class Map(models.Model):
    name = models.CharField(max_length=50)
    floors = ListField(EmbeddedModelField('Floor'))
    objects = MongoDBManager()

class Floor(models.Model):
    floor_name = models.CharField(max_length=50)
    #img = models.FileField(storage=GridFSStorage, upload_to='/')
    img = GridFSField()
    clusters = ListField(EmbeddedModelField('Cluster'))

class Cluster(models.Model):
    topLeft = EmbeddedModelField('Pos')
    bottomRight = EmbeddedModelField('Pos')
    tags = SetField()

class Pos(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()


img = '/Users/sreeraj.a/projects/InNavi/server/resources/bkimg.jpg'
#test map
p1 = Pos(x=0, y=0)
p2 = Pos(x=20, y=20)
cluster = Cluster(topLeft=p1, bottomRight=p2, tags={'a', 'b', 'c'})
fl1 = Floor(floor_name='firstFloor', clusters=[cluster], img=(open(img).read()))
map1 = Map(name='testMap', floors=[fl1])

