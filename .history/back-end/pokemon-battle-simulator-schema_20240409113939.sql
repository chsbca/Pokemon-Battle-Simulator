CREATE TABLE "user"(
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "pokemon"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "hp" INT NOT NULL,
    "attack" INT NOT NULL,
    "defense" INT NOT NULL,
    "special_attack" INT NOT NULL,
    "special_defense" INT NOT NULL,
    "speed" INT NOT NULL,
    "evasion" INT NOT NULL
);

CREATE TABLE "move"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "chosen_moves"(
    "pokemonID" BIGINT NOT NULL,
    "moveID" BIGINT NOT NULL,
    PRIMARY KEY ("pokemonID", "moveID"),
    CONSTRAINT "chosen_moves_pokemonid_foreign" FOREIGN KEY("pokemonID") REFERENCES "pokemon"("id") ON DELETE CASCADE,
    CONSTRAINT "chosen_moves_moveid_foreign" FOREIGN KEY("moveID") REFERENCES "move"("id") ON DELETE CASCADE
);

CREATE TABLE "learnable_moves"(
    "pokemonID" BIGINT NOT NULL,
    "moveID" BIGINT NOT NULL,
    PRIMARY KEY ("pokemonID", "moveID"),
    CONSTRAINT "learnable_moves_pokemonid_foreign" FOREIGN KEY("pokemonID") REFERENCES "pokemon"("id") ON DELETE CASCADE,
    CONSTRAINT "learnable_moves_moveid_foreign" FOREIGN KEY("moveID") REFERENCES "move"("id") ON DELETE CASCADE
);

CREATE TABLE "team"(
    "userID" BIGINT NOT NULL,
    "pokemon_1" BIGINT,
    "pokemon_2" BIGINT,
    "pokemon_3" BIGINT,
    "pokemon_4" BIGINT,
    "pokemon_5" BIGINT,
    "pokemon_6" BIGINT,
    PRIMARY KEY("userID"),
    CONSTRAINT "team_userID_foreign" FOREIGN KEY("userID") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "team_pokemon_1_foreign" FOREIGN KEY("pokemon_1") REFERENCES "pokemon"("id") ON DELETE SET NULL,
    CONSTRAINT "team_pokemon_2_foreign" FOREIGN KEY("pokemon_2") REFERENCES "pokemon"("id") ON DELETE SET NULL,
    CONSTRAINT "team_pokemon_3_foreign" FOREIGN KEY("pokemon_3") REFERENCES "pokemon"("id") ON DELETE SET NULL,
    CONSTRAINT "team_pokemon_4_foreign" FOREIGN KEY("pokemon_4") REFERENCES "pokemon"("id") ON DELETE SET NULL,
    CONSTRAINT "team_pokemon_5_foreign" FOREIGN KEY("pokemon_5") REFERENCES "pokemon"("id") ON DELETE SET NULL,
    CONSTRAINT "team_pokemon_6_foreign" FOREIGN KEY("pokemon_6") REFERENCES "pokemon"("id") ON DELETE SET NULL
);
