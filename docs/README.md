# JavaScript Design Patterns

## Creational Design Pattern

> 1. Constructor:

```js
class Server {
  constructor(name, ip) {
    this.name = name;
    this.ip = ip;
  }

  getUrl() {
    return `https://${this.ip}:80`;
  }
}

const aws = new Server("AWS German", "82.21.21.32");

console.log(aws.getUrl()); // https://82.21.21.32:80
```

> 2. Factory

```js
class SimpleMembership {
  constructor(name) {
    this.name = name;
    this.cost = 50;
  }
}

class StandardMembership {
  constructor(name) {
    this.name = name;
    this.cost = 150;
  }
}

class PremiumMembership {
  constructor(name) {
    this.name = name;
    this.cost = 500;
  }
}

class MemberFactory {
  static list = {
    simple: SimpleMembership,
    standard: StandardMembership,
    premium: PremiumMembership
  }

  create(name, type = "simple") {
    const Membership = MemberFactory.list[type] || MemberFactory.list["simple"];
    const member = new Membership(name);
    
    member.type = type;
    member.define = function() {
      console.log(`${this.name} (${this.type}): ${this.cost}`);
    }

    return member;
  }
}

const factory = new MemberFactory();

const members = [
  factory.create("Jaloliddin", "premium"),
  factory.create("Eva", "standard"),
  factory.create("Vasilisa", "simple"),
  factory.create("Camila"),
];

members.forEach((member) => {
  member.define();
});

// Outputs:

// Jaloliddin (premium): 500
// Eva (standard): 150
// Vasilisa (simple): 50
// Camila (simple): 50
```

> 3. Prototype

```js
const car = {
  wheels: 4,

  init() {
    console.log(`У меня есть ${this.wheels} колеса, мой владелец ${this.owner}`);
  }
}

const carWithOwner = Object.create(car, {
  owner: {
    value: "Дмитрий",
  }
});

console.log(carWithOwner.__proto__ === car); // true

carWithOwner.init(); // У меня есть 4 колеса, мой владелец Дмитрий
```

> 4. Singleton

```js
class Database {
  constructor(data) {
    if (Database.exists) {
      return Database.instance;
    }

    Database.instance = this;
    Database.exists = true;

    this.data = data;
  }

  getData() {
    return this.data;
  }
}

const mongo = new Database("MongoDB");
console.log(mongo.getData()); // MongoDB

const mysql  = new Database("MySQL");
console.log(mongo.getData()); // MongoDB
```

## Structural Design Pattern

> 1. Adapter

```js
class OldCalc {
  operations(t1, t2, operation) {
    switch (operation) {
      case "add": return t1 + t2;
      case "sub": return t1 - t2;
      default: return NaN;
    }
  }
}

class NewCalc {
  add(t1, t2) {
    return t1 + t2;
  }

  sub(t1, t2) {
    return t1 - t2;
  }
}

class CalcAdapter {
  constructor() {
    this.calc = new NewCalc();
  }

  operations(t1, t2, operation) {
    switch (operation) {
      case "add": return this.calc.add(t1, t2);
      case "sub": return this.calc.sub(t1, t2);
      default: return NaN;
    }
  }
}

const oldCalc = new OldCalc();
console.log(oldCalc.operations(10, 5, "add")); // 15

const newCalc = new NewCalc();
console.log(newCalc.add(10, 5)); // 15

const adapter = new CalcAdapter();
console.log(adapter.operations(25, 10, "sub")); // 15
```

> 2. Decorator

```js
class Server {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;
  }

  get Url() {
    return `https://${this.ip}:${this.port}`;
  }
}

function aws(server) {
  server.isAWS = true;
  server.awsInfo = function() {
    return server.Url;
  }

  return server;
}

function azure(server) {
  server.isAZURE = true;
  server.port += 500;

  return server;
}

const s1 = aws(new Server("12.34.56.78", 8080));

console.log(s1.isAWS); // true
console.log(s1.awsInfo()); // https://12.34.56.78:8080

const s2 = azure(new Server("98.87.65.43", 1000));

console.log(s2.isAZURE); // true
console.log(s2.Url); // https://98.87.65.43:1500
```

> 3. Facade

```js
class Complaints {
  constructor() {
    this.complaints = [];
  }

  reply(complaint) {
  }

  add(complaint) {
    this.complaints.push(complaint);
    return this.reply(complaint);
  }
}

class ProductComplaints extends Complaints {
  reply({id, customer, details}) {
    return `Product: ${id}: ${customer} (${details})`;
  }
}

class ServiceComplaints extends Complaints {
  reply({id, customer, details}) {
    return `Service: ${id}: ${customer} (${details})`;
  }
}

class ComplaintRegistry {
  register(customer, type, details) {
    const id = Date.now();
    let complaint;

    if (type === "service") {
      complaint = new ServiceComplaints();
    } else {
      complaint = new ProductComplaints();
    }

    return complaint.add({id, customer, details});
  }
}

const registry = new ComplaintRegistry();

console.log(registry.register("Jaloliddin", "service", "Unavailable")); // Service: 1694428417402: Jaloliddin (Unavailable)
console.log(registry.register("Azizbek", "product", "some complaint regarding to products")); // Product: 1694428498133: Azizbek (some complaint regarding to products)
```

4. Flyweight

```js
class Car {
  constructor(model, price) {
    this.model = model;
    this.price = price;
  }
}

class CarFactory {
  constructor() {
    this.cars = [];
  }

  create(model, price) {
    const candidate = this.getCar(model);
    if (candidate) {
      return candidate;
    }

    const newCar = new Car(model, price);
    this.cars.push(newCar);
    return newCar;
  }

  getCar(model) {
    return this.cars.find(car => car.model === model);
  }
}

const factory = new CarFactory();

const bmwX6 = factory.create("bmw", 10000);
const audi = factory.create("audi", 20000);
const bmwX3 = factory.create("bmw", 8000);

console.log(bmwX3 === bmwX6); // true

console.log(bmwX6); // Car { model: 'bmw', price: 10000 }
console.log(audi);  // Car { model: 'audi', price: 20000 }
console.log(bmwX3); // Car { model: 'bmw', price: 10000 }

console.log(factory.cars); // [ Car { model: 'bmw', price: 10000 }, Car { model: 'audi', price: 20000 } ]
```

5. Proxy

```js
function networkFetch(url) {
  return `${url} - Ответ с сервера`;
}

const cache = new Set();
const proxiedFetch = new Proxy(networkFetch, {
  apply(target, thisArg, args) {
    const url = args[0];
    if (cache.has(url)) {
      return `${url} - Ответ из кэша`;
    } else {
      cache.add(url);
      return Reflect.apply(target, thisArg, args);
    }
  }
});

console.log(proxiedFetch("angular.io")); // angular.io - Ответ с сервера
console.log(proxiedFetch("react.io")); // react.io - Ответ с сервера
console.log(proxiedFetch("angular.io")); // angular.io - Ответ из кэша
```

## Behavioral Design Pattern

> 1. Chain of responsibilities

```js
class MySum {
  constructor(initialValue = 42) {
    this.sum = initialValue;
  }

  add(value) {
    this.sum += value;
    return this;
  }
}

const sum1 = new MySum();
console.log(sum1.add(8).add(10).add(1).add(9)); // MySum { sum: 70 }

const sum2 = new MySum(0);
console.log(sum2.add(1).add(2).add(3)); // MySum { sum: 6 }
```

> 2. Command

```js
class MyMath {
  constructor(initialValue = 0) {
    this.number = initialValue;
  }

  square() {
    return this.number ** 2;
  }

  cube() {
    return this.number ** 3;
  }
}

class Command {
  constructor(subject) {
    this.subject = subject;
    this.commandsExecuted = [];
  }

  execute(command) {
    this.commandsExecuted.push(command);
    return this.subject[command]();
  }
}

const x = new Command(new MyMath(2));

console.log(x.execute("square")); // 4
console.log(x.execute("cube"));   // 8

console.log(x.commandsExecuted); // [ 'square', 'cube' ]
```

> 3. Iterator

```js
class MyIterator {
  constructor(data) {
    this.index = 0;
    this.data = data;
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.data.length) {
          return {
            value: this.data[this.index++],
            done: false
          }
        } else {
          this.index = 0;
          return {
            done: true,
            value: void 0
          }
        }
      }
    }
  }
}

function* generator(collection) {
  let index = 0;

  while (index < collection.length) {
    yield collection[index++];
  }
}

const iterator = new MyIterator(["This", "is", "iterator"]);
const gen = generator(["This", "is", "iterator"]);

// for (const value of gen) {
//   console.log(`Value: ${value}`);
// }

console.log(`Value: ${gen.next().value}`);
console.log(`Value: ${gen.next().value}`);
console.log(`Value: ${gen.next().value}`);
console.log(`Value: ${gen.next().value}`);

// Value: This
// Value: is
// Value: iterator
// Value: undefined
```

> 4. Mediator

```js
class User {
  constructor(name) {
    this.name = name;
    this.room = null;
  }

  send(message, to) {
    this.room.send(message, this, to);
  }

  receive(message, from) {
    console.log(`${from.name} => ${this.name}: ${message}`);
  }
}

class ChatRoom {
  constructor() {
    this.users = {}
  }

  register(user) {
    this.users[user.name] = user;
    user.room = this;
  }

  send(message, from, to) {
    if (to) {
      to.receive(message, from);
    } else {
      Object.keys(this.users).forEach(key => {
        this.users[key].receive(message, from);
      });
    }
  }
}

const u1 = new User("Jaloliddin");
const u2 = new User("Elena");
const u3 = new User("Eva");

const room = new ChatRoom();

room.register(u1);
room.register(u2);
room.register(u3);

u1.send("Hi", u2)
u2.send("Hello!", u1);
u3.send("Hi everyone!");
```

> 5. Observer

```js
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obj => obj !== observer);
  }

  fire(action) {
    this.observers.forEach(observer => {
      observer.update(action);
    })
  }
}

class Observer {
  constructor(state = 1) {
    this.state = state;
    this.initialState = state;
  }

  update(action) {
    switch (action.type) {
      case "INCREMENT":
        this.state = ++this.state;
        break;
      case "DECREMENT":
        this.state = --this.state;
        break;
      case "ADD":
        this.state += this.action.payload;
        break;
      default:
        this.state = this.initialState;
    }
  }
}

const stream$ = new Subject();

const obs1 = new Observer();
const obs2 = new Observer(42);

stream$.subscribe(obs1);
stream$.subscribe(obs2);

stream$.fire({type: "INCREMENT"});
stream$.fire({type: "INCREMENT"});
stream$.fire({type: "DECREMENT"});
stream$.fire({type: "ADD", payload: 10});

console.log(obs1.state); // 2
console.log(obs2.state); // 43
```

> 6. State

```js
class Light {
  constructor(light) {
    this.light = light;
  }
}

class RedLight extends Light {
  constructor() {
    super("red");
  }

  sign() {
    return "STOP";
  }
}

class YellowLight extends Light {
  constructor() {
    super("yellow");
  }

  sign() {
    return "READY";
  }
}

class GreenLight extends Light {
  constructor() {
    super("green");
  }

  sign() {
    return "GO";
  }
}

class TrafficLight {
  constructor() {
    this.states = [
      new RedLight(),
      new YellowLight(),
      new GreenLight(),
    ];

    this.current = this.states[0];
  }

  change() {
    const total = this.states.length;
    let index = this.states.findIndex(light => light === this.current);

    if (index + 1 < total) {
      this.current = this.states[index + 1];
    } else {
      this.current = this.states[0];
    }
  }

  sign() {
    return this.current.sign();
  }
}

const traffic = new TrafficLight();

console.log(traffic.sign()); // STOP
traffic.change();

console.log(traffic.sign()); // READY
traffic.change();

console.log(traffic.sign()); // GO
traffic.change();

console.log(traffic.sign()); // STOP
```

> 7. Strategy

```js
class Vehicle {
  travelTime() {
    return this.timeTaken;
  }
}

class Bus extends Vehicle {
  constructor() {
    super();
    this.timeTaken = 10;
  }
}

class Taxi extends Vehicle {
  constructor() {
    super();
    this.timeTaken = 5;
  }
}

class Car extends Vehicle {
  constructor() {
    super();
    this.timeTaken = 3;
  }
}

class Commute {
  travel(transport) {
    return transport.travelTime();
  }
}

const commute = new Commute();

console.log(commute.travel(new Taxi())); // 5
console.log(commute.travel(new Bus()));  // 10
console.log(commute.travel(new Car()));  // 3
```

> 8. Template

```js
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
```