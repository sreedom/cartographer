from django.conf.urls import patterns, url
import views
from django.views.generic import TemplateView
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'IndoorServer.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

                       url(r'^list/$', views.search_maps, name="maps.search"),
                       url(r'^test/$', TemplateView.as_view(template_name='maps/test.html'), name="maps.test"),
                       url(r'^admin/$', TemplateView.as_view(template_name='maps/map.html'), name="maps.test"),
                       url(r'^upload-image/$', views.upload_file, name="maps.upload"),
                       url(r'^image/(?P<image_id>.*)/$', views.download_image, name="maps.download"),
                       url(r'^update-map/(?P<map_id>.*)$', views.update_map, name="maps.update"),
                       url(r'^detail/(?P<map_id>.*)$', views.download_map, name="maps.detail"),



)
