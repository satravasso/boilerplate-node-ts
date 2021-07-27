import axios from "axios";
import { pokemon, stat } from "../types";


/**
  * É feita a subtração da vida do pokemon defensor com o ataque do pokemon atacante
  *
  * @param AtackPokemon - Pokemon que irá atacar
  * @param DefensePokemon - Pokemon que irá defender
  * @returns O a vida do Pokemon que defendeu
  *
  */
function atkPokemon(AtackPokemon: pokemon, DefensePokemon: pokemon) {

  console.log(`${AtackPokemon.name} está atacamdo com ${AtackPokemon.attackName}`)
  const hp = DefensePokemon.hp - AtackPokemon.attack;
  console.log(`${DefensePokemon.name} ficou com com ${hp}`)
  return hp

}
/**
  * Retorna o pokemon ganhador, a batalha é calculada a partir dos dados consumidos da api
  * é feita a subtração do pokemon Defensor - pokemon Atacante até que um dos pokemons
  * fique com a vida menor ou igual à 0
  *
  * @param namePokemon1 - Nome do primeiro pokemon para a batalha
  * @param namePokemon2 - Nome do segundo pokemon para a batalha
  * @returns O nome do ganhador da batalha
  *
  */
export async function getFightResult(namePokemon1: string, namePokemon2: string) {
  console.log(`Iniciamos nossa batalha Pokemon! E a batalha é ${namePokemon1} contra ${namePokemon2}`)
  let pokemon1 = await getPokemonStats(namePokemon1);
  console.log(`Nosso primeiro Pokemon tem um Ataque de ${pokemon1.attack} e Vida total de ${pokemon1.hp}`)
  let pokemon2 = await getPokemonStats(namePokemon2);
  console.log(`E nosso segundo Pokemon tem um Ataque de ${pokemon2.attack} e Vida total de ${pokemon2.hp}`)

  let round = 0;
  do {
    round += 1;
    console.log(`Começamos com ${namePokemon1} atacando`)

    pokemon2.hp = atkPokemon(pokemon1, pokemon2)

    if (pokemon2.hp >= 0) {
      pokemon1.hp = atkPokemon(pokemon2, pokemon1)
    } else if (round === 1) {
      console.log(`${namePokemon2} não sobreviveu ao primeiro ataque!`)
    }


  } while (pokemon1.hp >= 0 && pokemon2.hp >= 0);


  if (pokemon2.hp <= 0) {
    console.log(`${namePokemon2} perdeu no round ${round}`)
    return pokemon1.name;
  }

  console.log(`${namePokemon1} perdeu no round ${round}`)
  return pokemon2.name


};

/**
  *
  * @param pokemonName - Nome do pokemon
  * @returns retorna um objeto do tipo pokemon
  *
  */
async function getPokemonStats(pokemonName: string) {

  let pokemon: pokemon;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const stats = response.data.stats.map((states: { base_stat: number, stat: { name: string } }) => { return { base_stat: states.base_stat, name: states.stat.name } });

    pokemon = {
      name: pokemonName,
      hp: stats.find((value: stat) => value.name === 'hp').base_stat,
      attack: stats.find((value: stat) => value.name === 'attack').base_stat,
      attackName: response.data.abilities[0].ability.name
    }
  } catch (error) {
    throw error
  }
  return pokemon;
}
