from django.urls import path
from .views import IndexView

# viewをユーザーがアクセスする実際のURLに結びつける
urlpatterns = [
    path('', IndexView.as_view()),
]