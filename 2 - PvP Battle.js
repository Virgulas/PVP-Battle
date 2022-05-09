class Player {
  #maxHealth;
  #maxEn;
  #health;
  #en;
  name;
  armor;

  constructor(n, mH, mEn, armor) {
    this.#maxHealth = mH;
    this.#maxEn = mEn;
    this.#health = mH;
    this.#en = mEn;
    this.name = n;
    this.armor = armor;
  }
  damageReceiver(skStatus, caller, skName) {
    let effectiveArmor = this.armor - skStatus.penetration;
    let dmgC = skStatus.damage * ((100 - effectiveArmor) / 100);
    this.#health = this.#health - dmgC;
    return `${caller} used ${skName}, ${skStatus.desc}, against ${
      this.name
    }, doing ${dmgC.toFixed(2)} damage!`;
  }
  learnSkill(skName, details) {
    this[skName] = function (target) {
      let oldEn = this.#en;
      if (Number(this.hpPerc.match(/\d+.?\d+/g)) == 0)
        return "dead bodies can't use skills";
      this.#en = this.#en - details.cost;
      if (this.#en < 0) {
        this.#en = oldEn;
        return `${this.name} attempted to use ${skName}, but didn't have enough energy!`;
      }
      let res = target.damageReceiver(details, this.name, skName);
      if (this.#health < this.#maxHealth) {
        this.#health += details.heal;
        if (this.#health > this.#maxHealth) this.#health = this.#maxHealth;
        if (details.heal > 0) {
          if (Number(target.hpPerc.match(/\d+.?\d+/g)) == 0)
            return (
              res +
              ` ${this.name} healed for ${details.heal} health!` +
              ` ${target.name} died.`
            );
          else
            return (
              res +
              ` ${this.name} healed for ${details.heal} health.` +
              ` ${target.name} is at ${target.hpPerc} health.`
            );
        }
      }
      if (Number(target.hpPerc.match(/\d+.?\d+/g)) == 0)
        return res + ` ${target.name} died.`;
      return res + ` ${target.name} is at ${target.hpPerc} health.`;
    };
  }
  get en() {
    return this.#en;
  }
  get hp() {
    if (this.#health <= 0) return 0;
    if (this.#health >= this.#maxHealth) return this.#maxHealth;
    return this.#health;
  }
  get hpPerc() {
    if (this.#health <= 0) return "0%";
    return ((this.#health * 100) / this.#maxHealth).toFixed(2) + "%";
  }
}

const man = new Player("A Man With A Burning Heart", 100, 110, 60);
man.learnSkill("fireball", {
  damage: 23,
  penetration: 1.2,
  heal: 5,
  cost: 0,
  desc: "a firey magical attack",
});
const monkey = new Player("Monkey With Frozen Toes", 100, 100, 50);
monkey.learnSkill("iceball", {
  damage: 18,
  penetration: 0,
  heal: 5,
  cost: 1,
  desc: "an ice attack",
});
console.log(monkey.iceball(man));
console.log(man.fireball(monkey));
