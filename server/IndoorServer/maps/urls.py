from django.conf.urls import patterns, url
import views
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'IndoorServer.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

                       url(r'^list/$', views.search_maps, name="maps.search"),
                       url(r'^upload-image/$', views.search_maps, name="maps.search"),
                       url(r'^image/(?P<image_id>.*)/$', views.download_image, name="maps.download"),
                       url(r'^update-map/(?P<map_id>.*)/$', views.update_map, name="maps.update"),


)
