from .models import Profile
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Triggered post-save (pressing save button).
@receiver(post_save, sender=User)

# Sender is the user class itself and instance is the specific instance.
# created will only be set to true once during initial creation, signaling...
# ...that we want to take a certain action (create the user profile).
def post_save_create_profile(sender, instance, created, *args, **kwargs):
    print(sender)
    print(instance)
    print(created)

    if created:
        Profile.objects.create(user=instance)