from django.shortcuts import render
from .models import Photo, Post
from django.http import HttpResponse, JsonResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def post_list_and_create(request):
    form = PostForm(request.POST or None)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and form.is_valid():
        author = Profile.objects.get(user=request.user)
        instance = form.save(commit=False)
        instance.author = author
        instance.save()

        return JsonResponse({
            'title': instance.title, 
            'body': instance.body, 
            'author': instance.author.user.username,
            'id': instance.id
        })
    
    context = {'form': form}

    return render(request, 'posts/main.html', context)

@login_required
def post_detail(request, pk):
    # PROBLEM: objects.get() can raise an "ObjectDoesNotExist" exception.
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form
    }

    return render(request, 'posts/detail.html', context)

@login_required
def post_detail_view_data(request, pk):
    # Same issue as above.
    obj = Post.objects.get(pk=pk)

    data = {
        'id': obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username 
    }

    return JsonResponse({'data': data})

@login_required
def load_post_data_view(request, **kwargs):
    # Basically, get data from posts[lower to upper], so we want to retrieve n number of posts for display.
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
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

@login_required
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

@login_required
@action_permission 
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')

        obj.title = new_title
        obj.body = new_body
        obj.save()

    return JsonResponse({'title': new_title, 'body': new_body})

@login_required
@action_permission
def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        obj.delete()
        return JsonResponse({'msg': 'Post deleted'})

    return JsonResponse({'msg': 'Access denied'})

@login_required
def image_upload_view(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)

        return HttpResponse()