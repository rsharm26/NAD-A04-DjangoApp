from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=200) # VARCHAR(n)
    body = models.TextField()
    liked = models.ManyToManyField(User, blank=True) # Can have many users like a post but also none.
    author = models.ForeignKey(Profile, on_delete=models.CASCADE) # Must have an author profile per post (posts deleted if profile).
    updated = models.DateTimeField(auto_now=True)
    create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)
    
    @property
    def like_count(self):
        return self.liked.all().count()