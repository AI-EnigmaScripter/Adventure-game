#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
class Character {
    name;
    fuel = 100;
    constructor(name) {
        this.name = name;
    }
    takeDamage(damage) {
        this.fuel -= damage;
        if (this.fuel < 0)
            this.fuel = 0;
    }
    isDefeated() {
        return this.fuel <= 0;
    }
    displayStatus() {
        console.log(chalk.bold(`${this.name}'s Status:`));
        console.log(chalk.yellow(`Fuel: ${this.fuel}`));
    }
    displayArt() {
        console.log(this.getArt());
    }
    getArt() {
        return '';
    }
}
class Player extends Character {
    attack(opponent) {
        const damage = Math.floor(Math.random() * 20) + 10;
        opponent.takeDamage(damage);
        console.log(gradient.pastel(`${this.name} attacks ${opponent.name} for ${damage} damage!`));
    }
    drinkPotion() {
        const healing = Math.floor(Math.random() * 20) + 10;
        this.fuel += healing;
        console.log(gradient.morning(`${this.name} drinks a potion and heals for ${healing} fuel!`));
    }
    run() {
        console.log(gradient.summer(`${this.name} tries to run away...`));
        const escapeChance = Math.random();
        if (escapeChance > 0.5) {
            console.log(gradient.summer(`${this.name} successfully escapes!`));
            return true;
        }
        else {
            console.log(gradient.cristal(`${this.name} failed to escape!`));
            return false;
        }
    }
    getArt() {
        return `
     /\\_/\\  
    ( o.o ) 
     > ^ <  
    `;
    }
}
class Opponent extends Character {
    attack(player) {
        const damage = Math.floor(Math.random() * 20) + 10;
        player.takeDamage(damage);
        console.log(gradient.atlas(`${this.name} attacks ${player.name} for ${damage} damage!`));
    }
    getArt() {
        return `
     .-"""-.
    /       \\
   |  .-. .-|
   |  |_| |_|
   |  _____ |
    \\_____/
    `;
    }
}
class Mage extends Character {
    castSpell(opponent) {
        const damage = 15; // Consistent damage
        opponent.takeDamage(damage);
        console.log(gradient.rainbow(`${this.name} casts a spell on ${opponent.name} for ${damage} damage!`));
    }
    drinkPotion() {
        const healing = Math.floor(Math.random() * 20) + 10;
        this.fuel += healing;
        console.log(gradient.morning(`${this.name} drinks a potion and heals for ${healing} fuel!`));
    }
    run() {
        console.log(gradient.summer(`${this.name} tries to run away...`));
        const escapeChance = Math.random();
        if (escapeChance > 0.5) {
            console.log(gradient.summer(`${this.name} successfully escapes!`));
            return true;
        }
        else {
            console.log(gradient.cristal(`${this.name} failed to escape!`));
            return false;
        }
    }
    getArt() {
        return `
        /\\
       /  \\
      |    |
      |____|
     (______)
      |    |
      |    |
    `;
    }
}
async function promptPlayerName() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: chalk.blue('Please Enter Your Name:')
    });
    return name;
}
async function promptCharacterSelection() {
    const { character } = await inquirer.prompt({
        type: 'list',
        name: 'character',
        message: chalk.blue('Select Your Character:'),
        choices: ['Player', 'Mage']
    });
    return character;
}
async function promptOpponentSelection() {
    const { select } = await inquirer.prompt({
        type: 'list',
        name: 'select',
        message: chalk.blue('Select Your Opponent:'),
        choices: ['Skeleton', 'Assassin', 'Zombie']
    });
    return select;
}
async function promptPlayerAction() {
    const { opt } = await inquirer.prompt({
        type: 'list',
        name: 'opt',
        message: chalk.blue('Select Your Action:'),
        choices: ['Attack', 'Drink Potion', 'Run For Your Life..']
    });
    return opt;
}
async function promptMageAction() {
    const { opt } = await inquirer.prompt({
        type: 'list',
        name: 'opt',
        message: chalk.blue('Select Your Action:'),
        choices: ['Cast Spell', 'Drink Potion', 'Run For Your Life..']
    });
    return opt;
}
function displayTitle(text) {
    console.log(gradient.passion(figlet.textSync(text, { horizontalLayout: 'full' })));
}
async function startGame() {
    displayTitle('Battle Game');
    const playerName = await promptPlayerName();
    const characterType = await promptCharacterSelection();
    const opponentName = await promptOpponentSelection();
    let player;
    if (characterType === 'Mage') {
        player = new Mage(playerName);
    }
    else {
        player = new Player(playerName);
    }
    const opponent = new Opponent(opponentName);
    console.log(gradient.instagram(`${player.name} VS ${opponent.name}`));
    player.displayArt();
    opponent.displayArt();
    while (!player.isDefeated() && !opponent.isDefeated()) {
        player.displayStatus();
        opponent.displayStatus();
        let action;
        if (player instanceof Mage) {
            action = await promptMageAction();
        }
        else {
            action = await promptPlayerAction();
        }
        if (action === 'Attack' && player instanceof Player) {
            player.attack(opponent);
        }
        else if (action === 'Cast Spell' && player instanceof Mage) {
            player.castSpell(opponent);
        }
        else if (action === 'Drink Potion') {
            if (player instanceof Player) {
                player.drinkPotion();
            }
            else if (player instanceof Mage) {
                player.drinkPotion();
            }
        }
        else if (action === 'Run For Your Life..') {
            if (player instanceof Player || player instanceof Mage) {
                if (player.run())
                    break;
            }
        }
        if (!opponent.isDefeated()) {
            opponent.attack(player);
        }
        else {
            console.log(gradient.passion(`${player.name} has defeated ${opponent.name}!`));
            break;
        }
        if (player.isDefeated()) {
            console.log(gradient.vice(`${opponent.name} has defeated ${player.name}!`));
        }
    }
}
startGame();
