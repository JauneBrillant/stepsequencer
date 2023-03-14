from django.views.generic import TemplateView

# templatesからhtmlを読み込んでユーザに返す
class IndexView(TemplateView):
    template_name = "index.html"