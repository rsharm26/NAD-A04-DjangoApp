from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# Works similar to Room (Android), where a class models our entity.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # This reads as "one user per profile"
    bio = models.TextField(default="No bio...") # 'blank=True' okay as well
    avatar = models.ImageField(default='avatar.png', upload_to='avatars')
    updated = models.DateTimeField(auto_now=True) # Auto-populated
    create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of the user {self.user.username}" # Assume this is .toString()