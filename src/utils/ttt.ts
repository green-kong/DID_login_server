class Test {
  a: number;
}

const aa: Test = {
  a: 1,
};

const bb = new Test();

console.log(bb instanceof Test);
