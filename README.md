# Welcome to the Pokémon Battle Simulator!

## About the Project

![Screenshot](https://i.imgur.com/aRU4nRB.png)

This project simulates how Pokémon battles go, with limitations:
- Moves in this simulator utilize:
    - Attack, Special Attack, Defense, Special Defense stats **
    - Type effectiveness
- Moves in this simulator do not utilize (this list is not all-inclusive):
    - Priority
    - Stat changes
    - Status inflictions
    - Accuracy
    - Power Points**

**Whether a move is physical or special is not taken into account, therefore the highest stat will be used for the move and for defending against it.

### Features
- PokéAPI to pull accurate information about Pokémon
- User account utility to save your configurable preset Pokémon of 6 or less
- The ability to add/remove Pokémon to your team, along with picking which moves you want to use
- Pokémon list to view available Pokémon and their level 50 stats
- Opponent list to view present AI opponents that you can fight against
- Battles that utilize the Pokémon's style of turn-based battling
- OpenAPI to give extra commentary as the battles happen

### Built With

* ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
* ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
* ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
* ![PokéAPI](https://img.shields.io/badge/PokeAPI-FFCB05?style=for-the-badge&logo=pokemon&logoColor=black)
* ![OpenAI API](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)

<!-- ## Getting Started

### Prerequisites
- Python 3.10.12
- Node.js and npm
- PostgreSQL

### Installation
1. Clone repository
    ```sh
    git clone https://github.com/chsbca/Pokemon-Battle-Simulator.git
    ```
2. Create a virtual environment
    ```sh
    python3 -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```
3. Install backend dependencies
    ```sh
    pip install -r requirements.txt
    ```
4. Configure environment variables
    - Create a ``.env`` file in the backend directory and set up the following variables:
    ```sh
    SECRET_KEY = 'django-key-here'
    MASTER_TRAINER ="mastersignup/"
    OPENAI_API_KEY="openai-api-key-here"
    ```
    ##### (OpenAPI key is optional, you can comment out lines in the code to make it work without an OpenAPI subscription)
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ``` -->

## Usage

### Summary of Logic

All of the battle logic and flow is contained within ``front-end/src/pages/BattlePage.jsx``

Here's a quick rundown of what the logic does:

![Screenshot](https://i.imgur.com/VoqPmHD.png)

### Battle System

Let me show you a step-by-step rundown of what happens when the user selects an attack for their Pokémon to use.

1. ``handleAttack``
```js
    // Called when the user clicks a move button on the front-end
    const handleAttack = (userMove) => {
        setUserHasAttacked(true) // Sets state wherein the user cannot mass click a move/button to bypass the intended turn based nature of the game
        if (!userHasAttacked) {
            setEvents([]);
            const userPoke = currentPokemon;
            const cynPoke = cynthiaPokemon;
            const userSpeed = userPoke.pokemon.speed;
            const cynSpeed = cynPoke.pokemon.speed;

            // Stop if the user's Pokémon has fainted, preventing the player from attacking when their Pokemon is KO'd
            if (currentPokemon.pokemon.hp <= 0) {
                return; 
            }

            // Stop if the opponent's Pokémon's HP < 0, prompt a win if opponent has no more available Pokemon
            if (cynthiaPokemon.pokemon.hp <= 0) {
                const nextPokemon = selectNextCynthiaPokemon()
                if (nextPokemon) {
                    setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!")
                    return;
                }
            }

            // If not stopped above, call the performBattle function to proceed with the game flow
            if (userSpeed > cynSpeed) {
                // User's Pokémon is faster and attacks first
                performBattle(userPoke, cynPoke, userMove, selectRandomMove(cynPoke))
            } else {
                // Cynthia's Pokémon is faster and attacks first
                performBattle(cynPoke, userPoke, selectRandomMove(cynPoke), userMove)
            }
        }
    };
```

2. ``performBattle``
```js
    const performBattle = async (firstAttacker, secondAttacker, firstMove, secondMove) => {
        // Calls executeAttack and wait for it to complete
        const newHPAfterFirstAttack = await executeAttack(firstAttacker, secondAttacker, firstMove);

        // Use a delay to simulate asynchronous attack timing
        setTimeout(async () => {
            // Check if the second attacker is still able to fight before counterattacking
            if (newHPAfterFirstAttack > 0) {
                // Execute the second attack
                await executeAttack(secondAttacker, firstAttacker, secondMove);
            } else {
                // Handle the scenario where the first attacker's move was enough to make the second attacker faint
                const nextPokemon = selectNextCynthiaPokemon();
                if (!nextPokemon) {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            }
            // Turn has been played out, reset this state to false to allow user to pick another attack
            setUserHasAttacked(false)
        }, 7000);


    };
```
3. ``executeAttack``
```js
    const executeAttack = async (attacker, defender, move) => {
        // Grabs the higher attack stat, either attack or special attack
        const attackStat = attacker.pokemon.attack > attacker.pokemon.special_attack ? attacker.pokemon.attack : attacker.pokemon.special_attack;
        // Grabs the higher defense stat, either attack or special attack
        const defenseStat = defender.pokemon.defense > defender.pokemon.special_defense ? defender.pokemon.defense : defender.pokemon.special_defense;
        // Grabs the power of the move chosen
        const power = move.learnable_move.power;
        // Generates a multiplier based on type relationship i.e. super effective
        const typeEffectiveness = getTypeEffectiveness(move.learnable_move.move_type, defender.pokemon.types);
        // STAB = Same Type Attribute Bonus, if the pokemon's type is the same as the move chosen, grants a bonus multiplier
        const stab = attacker.pokemon.types.some(type => type.name === move.learnable_move.move_type.name) ? 1.5 : 1;
        // Setting the defender's HP and making sure it isn't the attacker's
        const defenderCurrentHP = (attacker === currentPokemon) ? cynthiaTeamHP[defender.pokemon.pokedex_number] : ourTeamHP[defender.pokemon.pokedex_number];
        // Damage calculation formula for Pokemon grabbed from Bulbapedia
        const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attackStat / defenseStat) / 50 + 2) * stab * typeEffectiveness);
        // Reflect new HP value after all damage calculation has been done
        const newHP = Math.max(defenderCurrentHP - damage, 0);

        // Setting defender's appropriate HP value after being attacked
        const updateHP = (attacker === currentPokemon) ? setCynthiaTeamHP : setOurTeamHP;
        updateHP(prevHP => ({ ...prevHP, [defender.pokemon.pokedex_number]: newHP }));

        // Preparing commentary message depending on the effectiveness of the move used
        let effectivenessMessage = '';
        if (typeEffectiveness > 1) {
            effectivenessMessage = "It's super effective!";
        } else if (typeEffectiveness < 1 && typeEffectiveness > 0) {
            effectivenessMessage = "It's not very effective...";
        } else if (typeEffectiveness === 0) {
            effectivenessMessage = "It doesn't affect the target..."
        }

        // Generating commentary message using events from above
        await createBattleEvent(attacker, move, damage, effectivenessMessage);
        if (newHP <= 0) {
            setEvents(prevEvents => [...prevEvents, `${capitalizeAndFormat(defender.pokemon.name)} has fainted!`]);
            if (attacker === currentPokemon) {
                // If Cynthia's Pokémon faints, select the next Pokémon
                const nextPokemon = selectNextCynthiaPokemon();
                if (nextPokemon) {
                    // setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            } else {
                return
            }
        }
        return newHP
    }
```

### Opponent AI

At the moment, I've only implemented rudimentary AI, specifically choosing moves and Pokemon at random.

1. ``selectRandomMove``
```js
    const selectRandomMove = (pokemon) => {
        const randomIndex = Math.floor(Math.random() * pokemon.chosen_moves.length)
        return pokemon.chosen_moves[randomIndex];
    };
```
2. ``selectNextCynthiaPokemon``
```js
    const selectNextCynthiaPokemon = () => {
        // Filter out any Pokémon that has no HP left
        const availablePokemon = cynthiaTeam.filter(p => cynthiaTeamHP[p.pokemon.pokedex_number] > 0);
        if (availablePokemon.length > 0) {
            // Randomly select one of the available Pokémon
            return availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
        } else {
            // If no Pokémon are left, Cynthia has been defeated
            alert("Cynthia has no more Pokémon left! You win!");
            return null; // Indicate game over
        }
    };
```

3. ``enemySwitchCounterattack``

```js
    // Just like the games, the opponent is allowed to prompt a counterattack after you switch Pokemon mid-battle when none of two Pokemon battling have fainted
    const enemySwitchCounterattack = (newPokemon) => {
        if (ourTeamHP[currentPokemon.pokemon.pokedex_number] > 0) {
            alert("The opponent triggers a counterattack as you switch in!")
            const randomMove = selectRandomMove(cynthiaPokemon)
            executeAttack(cynthiaPokemon, newPokemon, randomMove)
        }
        return
    }
```

## Roadmap

### Improving Battle Logic
- Implementing missing logic:
    - Accuracy
    - Physical or special property of a move
    - Power Points
    - Special move properties i.e. Hyper Beam's recharge time, Fissue's one-hit-KO
    - Weather
    - Status afflictions
    - Stat changing moves
    - and more!

### Improving AI
- Instead of random move selection, they will check move typing advantages and make use of that
- Like above, but for switching Pokemon after their current one faints

## Contact

Christopher "Leo" Caniones - chsbca999@gmail.com

LinkedIn: https://www.linkedin.com/in/chriscaniones/

## Creator's Thoughts

This was my personal submission for my final project at Code Platoon.

I created this project as I wanted to have fun with all that I learned in programming bootcamp. Since I've been playing video games for as long as I could remember, I wanted to try and create something that can simulate Pokémon battles. It was definitely way more than I can take, as I underestimated how much logic was put into a battle system that looked simple as a consumer like me. Now that I've created a foundation for what I want to simulate, I want to improve my skills with this project on the side.
