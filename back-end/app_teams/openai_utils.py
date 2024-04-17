import openai
from django.conf import settings

def initialize_openai():
    openai.api_key = settings.OPENAI_API_KEY

def get_cynthias_move(current_state):
    """
    Generates Cynthia's move based on the current state of the game using OpenAI.
    :param current_state: dict with necessary details about the current game state
    :return: dict containing the next move and dialogue
    """
    initialize_openai()
    try:
        response = openai.Completion.create(
            engine="davinci",
            prompt=create_prompt(current_state),
            max_tokens=50
        )
        move = response.choices[0].text.strip()
        return {
            'move': move,
            'dialogue': generate_dialogue(move)
        }
    except Exception as e:
        print(f"Failed to get response from OpenAI: {e}")
        return None

def create_prompt(state):
    """
    Creates a prompt for the AI based on the current game state.
    :param state: dict with game state details
    :return: str prompt for AI
    """
    # Example prompt creation
    return f"Given the current state of the battle {state}, what should Cynthia do next?"

def generate_dialogue(move):
    """
    Generates a dialogue based on the move chosen.
    :param move: str describing the chosen move
    :return: str dialogue
    """
    return f"Cynthia decides to use {move}, aiming to turn the tide of battle!"
