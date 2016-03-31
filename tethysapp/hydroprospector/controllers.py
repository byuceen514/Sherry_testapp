from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import TextInput


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    dam_ele = TextInput(display_text='Dam Top Elevation(m):',
                name="dam_ele",
                initial="1000",
                disabled=False,
                attributes="")
    context = {'dam_ele': dam_ele}

    return render(request, 'hydroprospector/home.html', context)