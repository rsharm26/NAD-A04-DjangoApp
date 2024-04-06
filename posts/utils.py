from .models import Post
from profiles.models import Profile
from django.http import HttpResponse

def action_permission(func):
    def wrapper(request, **kwargs):
        pk = kwargs.get('pk')
        profile = Profile.objects.get(user=request.user)
        post = Post.objects.get(pk=pk)

        if profile.user == post.author.user:
            print("lolz")
            return func(request, **kwargs)
        else:
            print("bruh")
            return HttpResponse('Access denied - you are not the author of this post (cannot delete)')
        
    return wrapper