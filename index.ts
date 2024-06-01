#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';


class Character {
  name: string;
  fuel: number = 100;

  constructor(name: string) {
    this.name = name;
  }

  takeDamage(damage: number) {
    this.fuel -= damage;
    if (this.fuel < 0) this.fuel = 0;
  }

  isDefeated(): boolean {
    return this.fuel <= 0;
  }
}

class Player extends Character {
  attack(opponent: Character) {
    const damage = Math.floor(Math.random() * 20) + 10;
    opponent.takeDamage(damage);
    console.log(`${chalk.bold.green(this.name)} attacks ${chalk.bold.red(opponent.name)} for ${damage} damage!`);
  }

  drinkPotion() {
    const healing = Math.floor(Math.random() * 20) + 10;
    this.fuel += healing;
    console.log(`${chalk.bold.green(this.name)} drinks a potion and heals for ${healing} fuel!`);
  }

  run(): boolean {
    console.log(`${chalk.bold.green(this.name)} tries to run away...`);
    const escapeChance = Math.random();
    if (escapeChance > 0.5) {
      console.log(`${chalk.bold.green(this.name)} successfully escapes!`);
      return true;
    } else {
      console.log(`${chalk.bold.red(this.name)} failed to escape!`);
      return false;
    }
  }
}

class Opponent extends Character {
  attack(player: Character) {
    const damage = Math.floor(Math.random() * 20) + 10;
    player.takeDamage(damage);
    console.log(`${chalk.bold.red(this.name)} attacks ${chalk.bold.green(player.name)} for ${damage} damage!`);
  }
}

async function promptPlayerName(): Promise<string> {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: chalk.blue('Please Enter Your Name')
  });
  return name;
}

async function promptOpponentSelection(): Promise<string> {
  const { select } = await inquirer.prompt({
    type: 'list',
    name: 'select',
    message: chalk.blue('Select Your Opponent'),
    choices: ['Skeleton', 'Assassin', 'Zombie']
  });
  return select;
}

async function promptPlayerAction(): Promise<string> {
  const { opt } = await inquirer.prompt({
    type: 'list',
    name: 'opt',
    message: chalk.blue('Select Your Action'),
    choices: ['Attack', 'Drink Potion', 'Run For Your Life..']
  });
  return opt;
}

async function startGame() {
  const playerName = await promptPlayerName();
  const opponentName = await promptOpponentSelection();

  const player = new Player(playerName);
  const opponent = new Opponent(opponentName);

  console.log(`${chalk.bold.green(player.name)} VS ${chalk.bold.red(opponent.name)}`);

  while (!player.isDefeated() && !opponent.isDefeated()) {
    const action = await promptPlayerAction();

    if (action === 'Attack') {
      player.attack(opponent);
    } else if (action === 'Drink Potion') {
      player.drinkPotion();
    } else if (action === 'Run For Your Life..') {
      if (player.run()) break;
    }

    if (!opponent.isDefeated()) {
      opponent.attack(player);
    } else {
      console.log(`${chalk.bold.green(player.name)} has defeated ${chalk.bold.red(opponent.name)}!`);
      break;
    }

    if (player.isDefeated()) {
      console.log(`${chalk.bold.red(opponent.name)} has defeated ${chalk.bold.green(player.name)}!`);
    }
  }
}

startGame();
