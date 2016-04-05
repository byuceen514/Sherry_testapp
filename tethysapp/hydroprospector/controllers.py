from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import TextInput,Button


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    dam_h = TextInput(display_text='Input Dam Height(m):',
                name="dam_h",
                initial="200",
                disabled=False,
                attributes="")
    btnCalculate = Button(display_text="Run HydroProspector",
                        name="btnCalculate",
                        attributes="onclick=app.run_service()",
                        submit=False)

    context = {'dam_h': dam_h,
               'btnCalculate': btnCalculate
               }

    return render(request, 'hydroprospector/home.html', context)