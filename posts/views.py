from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile
# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and form.is_valid():
        author = Profile.ojects.get(user=request.user)
        instance = form.save(commit=False)
        instance.author = author
        instance.save()
    
    context = {'form': form}

    return render(request, 'posts/main.html', context)

def load_post_data_view(request, **kwargs):
    # Basically, get data from posts[lower to upper], so we want to retrieve n number of posts for display.
    num_posts = kwargs.get('num_posts')
    visible = 3
    upper = num_posts
    lower = upper - visible

    qs = Post.objects.all()
    size = Post.objects.all().count()
    data = [{
            'id': obj.id, 
            'title': obj.title, 
            'body': obj.body, 
            'liked': request.user in obj.liked.all(),
            'count': obj.like_count,
            'author': obj.author.user.username
        } for obj in qs]

    return JsonResponse({'data': data[lower:upper], 'size': size})

def like_unlike_post(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest': # https://old.reddit.com/r/django/comments/rbewk0/what_is_the_recommended_way_of_knowing_if_a/
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)

        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        
        return JsonResponse({'liked': liked, 'count': obj.like_count})