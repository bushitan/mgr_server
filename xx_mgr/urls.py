# -*- coding: utf-8 -*-
from django.views.static import serve
from mgr_server.settings import MEDIA_ROOT


from django.conf.urls import url
from views import *



urlpatterns = [
    url(r'^main/$', Main.as_view()),

    url(r'^ym/index/$', YMIndexView.as_view()),
    url(r'^ym/country/(?P<nav_index>\w+)/(?P<pid>\w+)/$', YMCountryView.as_view()),
    url(r'^ym/about_me/(?P<nav_index>\w+)/$', YMAboutMeView.as_view()),
    url(r'^ym/cover/(?P<nav_index>\w+)/(?P<tag_id>\w+)/$', YMCoverView.as_view()),
    url(r'^ym/article/(?P<nav_index>\w+)/(?P<article_id>\w+)/$', YMArticleView.as_view()),

    url(r'^lx/index/$', LXIndexView.as_view()),
    url(r'^lx/country/(?P<nav_index>\w+)/(?P<pid>\w+)/$', LXCountryView.as_view()),
    url(r'^lx/study/(?P<nav_index>\w+)/$', LXStudyView.as_view()),
    url(r'^lx/success/(?P<nav_index>\w+)/$', LXSuccessView.as_view()),
    url(r'^lx/about_me/(?P<nav_index>\w+)/$', LXAboutMeView.as_view()),
    url(r'^lx/cover/(?P<nav_index>\w+)/(?P<tag_id>\w+)/$', LXCoverView.as_view()),
    url(r'^lx/article/(?P<nav_index>\w+)/(?P<article_id>\w+)/$', LXArticleView.as_view()),



    url(r'^upload/image/$', UploadImage.as_view()),

    url(r'^lite/father_tag/$', LiteFatherTag.as_view()),
    url(r'^lite/cover_article/$', LiteCoverArticle.as_view()),
    url(r'^lite/cover/$', LiteCover.as_view()),
    url(r'^lite/article/$', LiteArticle.as_view()),
    url(r'^lite/swiper/$', LiteSwiper.as_view()),


    url(r'^mobile/index/(?P<web_site>\w+)/$', MobileIndex.as_view()),
    url(r'^mobile/tab/(?P<web_site>\w+)/(?P<father_id>\w+)/$', MobileTabView.as_view()),
    url(r'^mobile/cover/(?P<web_site>\w+)/(?P<tag_id>\w+)/$', MobileCoverView.as_view()),
    url(r'^mobile/article/(?P<web_site>\w+)/(?P<article_id>\w+)/$', MobileArticleView.as_view()),
    # url(r'^mobile/article/$', MobileArticleView.as_view()),

    # url(r'^media/(?P<path>.*)$', serve,{'document_root': MEDIA_ROOT, }),
    # url(r'^tag/delete/$', TagAdd.as_view()),
    # url(r'^tag/get_list/$', TagAdd.as_view()),
    # url(r'^tag/update/$', TagAdd.as_view()),
]