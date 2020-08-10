from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from .forms import TaskForm
from .models import Task



def index(request):

    tasks = Task.objects.all()

    form = TaskForm()

    if request.method == "POST":
        form = TaskForm(data=request.POST)

        if form.is_valid():
            new_task = form.save(commit=False)

            if new_task is not None:
                new_task.save()

                return JsonResponse({"new_task": new_task.to_dict()})

    context = {
        "tasks": tasks,
        "form": form
    }

    return render(request, 'todos/index.html', context)


def delete_one(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if task is not None:
        task.delete()

        return JsonResponse({"msg": "Tarea borrada"})

def change_status(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if task is not None:
        if task.status:
            task.status = False
        else:
            task.status = True
    
        task.save()

        return JsonResponse({"task": task.to_dict()})