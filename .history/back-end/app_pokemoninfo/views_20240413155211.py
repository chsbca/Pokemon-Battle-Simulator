def pokemon_list(request):
    limit = request.GET.get('limit', 20)
    offset = request.GET.get('offset', 0)
    pokemon_objects = Pokemon.objects.all()
    paginator = Paginator(pokemon_objects, limit)

    page_number = int(offset) // int(limit) + 1
    page_obj = paginator.get_page(page_number)
    pokemon_data = [{
        'name': pokemon.name,
        'pokedexNumber': pokemon.pokedex_number,
        'types': [type.name for type in pokemon.types.all()],
        'stats': {
            'hp': pokemon.hp,
            'attack': pokemon.attack,
            'defense': pokemon.defense,
            'special_attack': pokemon.special_attack,
            'special_defense': pokemon.special_defense,
            'speed': pokemon.speed
        }
    } for pokemon in page_obj.object_list]

    return JsonResponse({
        'results': pokemon_data,
        'next': page_obj.next_page_number() if page_obj.has_next() else None,
        'previous': page_obj.previous_page_number() if page_obj.has_previous() else None
    })
Step 2: Define the URL