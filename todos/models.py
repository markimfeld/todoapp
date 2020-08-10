from django.forms.models import model_to_dict
from django.db import models

# Create your models here.
class Task(models.Model):
    name = models.CharField(max_length=120)
    status = models.BooleanField(default=False)


    def to_dict(self):
        return model_to_dict(self)

    def __str__(self):
        return self.name