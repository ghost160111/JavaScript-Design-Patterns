// Template Design Pattern

class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  responsibilites() {}

  work() {
    return `${this.name} is dealing with ${this.responsibilites()}`;
  }

  getPaid() {
    return `${this.name} has salary of ${this.salary}`;
  }
}

class Developer extends Employee {
  constructor(name, salary) {
    super(name, salary);
  }

  responsibilites() {
    return "developing programs";
  }
}

class Tester extends Employee {
  constructor(name, salary) {
    super(name, salary);
  }

  responsibilites() {
    return "testing programs";
  }
}

const dev = new Developer("Jaloliddin", 300);

console.log(dev.getPaid()); // Jaloliddin has salary of 300
console.log(dev.work()); // Jaloliddin is dealing with developing programs

const tester = new Tester("Victoria", 250);

console.log(tester.getPaid()); // Victoria has salary of 250
console.log(tester.work()); // Victoria is dealing with testing programs
