from django.apps import AppConfig

# Effectively initialization, where as soon as the application is ready...
# ...we import the signals from signals.py and can execute them when necessary.
class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profiles'
    
    def ready(self):
        import profiles.signals