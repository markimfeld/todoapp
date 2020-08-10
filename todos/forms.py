from django import forms


from .models import Task


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ('name', )
    
    name = forms.CharField(
        widget = forms.TextInput(
            attrs={
                'placeholder': 'New task...',
            }
        )
    )