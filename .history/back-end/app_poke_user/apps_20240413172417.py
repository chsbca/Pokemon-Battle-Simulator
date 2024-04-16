from django.apps import AppConfig

class PokeUserConfig(AppConfig):
    name = 'app_poke_user'

    def ready(self):
        import app_poke_user.signals  # Import your signals here
