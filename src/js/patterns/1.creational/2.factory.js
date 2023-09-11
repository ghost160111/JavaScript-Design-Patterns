// Factory Design Pattern

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