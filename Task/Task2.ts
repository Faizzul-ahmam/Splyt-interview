//--------- Type Declaration ----------------//

type Params = { [key: string]: any };

type Func = {
  (...args: any[]): any;
  names?: string[];
  defaultArgs?: Params;
};

//----------- Functions ---------------------//

function add(a:number, b:number)
{
    return a+b
}


function defaultArguments(funcToModify: Func, newDefaultArgs: Params): Func {
  const funcInString = funcToModify.toString().replace(/\/\/.*$|\/\*.*?\*\/|\s/gm, '');
  const match = funcInString.match(/(?:[\w]+(?:,[\w]+)*)?(?=\))/m);
  const names = funcToModify.names || (match ? match[0].split(',') : []);

  const defaultArgsToSet = Object.assign({}, funcToModify.defaultArgs, newDefaultArgs);
  const funcToReturn = function(this: any, ...args: any[]) {
    const argList = names.map(function(name, i) {
      return args[i] || defaultArgsToSet[name];
    });
    return funcToModify.apply(this, argList);
  }
  funcToReturn.names = names;
  funcToReturn.defaultArgs = defaultArgsToSet;
  return funcToReturn as Func;
}

// ---------------- Test Case ------------------------//

const add2 = defaultArguments(add, { b: 9 });
console.log(add2(10)); // 19
console.log(add2(10, 7)); // 17
console.log(add2()); // NaN

const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.log(add3(10)); // 13
console.log(add3()); // 5

const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything, since c isn't an argument
console.log(add4(10)); // NaN
console.log(add4(10, 10)); // 20

const add5 = defaultArguments(add2, { a: 10 }); // extends add2
console.log(add5()); // 19