from django.contrib import admin
from .models import Post, Photo
# Register your models here.

admin.site.register(Post) # See all posts.
admin.site.register(Photo)