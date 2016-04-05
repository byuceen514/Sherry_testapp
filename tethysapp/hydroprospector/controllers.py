from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import TextInput


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    dam_h = TextInput(display_text='Dam Height(m):',
                name="dam_h",
                initial="1000",
                disabled=False,
                attributes="")
    context = {'dam_h': dam_h}

    return render(request, 'hydroprospector/home.html', context)