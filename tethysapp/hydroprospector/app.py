from tethys_sdk.base import TethysAppBase, url_map_maker


class Hydroprospector(TethysAppBase):
    """
    Tethys app class for Hydroprospector.
    """

    name = 'Hydroprospector'
    index = 'hydroprospector:home'
    icon = 'hydroprospector/images/icon.gif'
    package = 'hydroprospector'
    root_url = 'hydroprospector'
    color = '#3498db'
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
        )

        return url_maps