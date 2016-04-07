from tethys_sdk.base import TethysAppBase, url_map_maker


class Hydroprospector(TethysAppBase):
    """
    Tethys app class for Hydroprospector.
    """

    name = 'HydroProspector'
    index = 'hydroprospector:home'
    icon = 'hydroprospector/images/dam.jpeg'
    package = 'hydroprospector'
    root_url = 'hydroprospector'
    color = '#3399ff'
    description = 'Place a brief description of your app here.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='hydroprospector',
                           controller='hydroprospector.controllers.home'),

                   UrlMap(name='help_file',
                            url='hydroprospector/help_file',
                            controller='hydroprospector.controllers.help_file'),

                    UrlMap(name='technical_file',
                            url='hydroprospector/technical_file',
                            controller='hydroprospector.controllers.technical_file'),
        )

        return url_maps