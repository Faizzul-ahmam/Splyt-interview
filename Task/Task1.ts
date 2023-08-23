
async function retryFailures<T>(targetFunction: () => Promise<T>, retries:number):Promise<T|undefined>
{
  let lastError;

  for (let i = 0; i < retries; i++) {
      try{
          return await targetFunction();
      } catch (error) {
          lastError = error
      }
  }

  if(lastError)
  {
    throw lastError;
  }
  else
  {
    throw new Error(`Failed to execute targetFunction(), Please try more than ${retries} retries.`);
  }

}


function createTargetFunction(succeedsOnAttempt: number) {
  let attempt = 0;
  return async () => {
    if (++attempt === succeedsOnAttempt) {
      return attempt;
    }

    throw Object.assign(new Error(`Attempt failed..`),{attempt});
  };
 }

async function runTest<T>(dataToTest:Array<number>) {
  type FailAttemptError = {message:Error,attempt:number}
  try {
    const result = await retryFailures(createTargetFunction(dataToTest[0]), dataToTest[1]);
    console.log(`Success on attempt ${result}`);
  } 
  catch (error) {
    if((error as FailAttemptError).attempt)
    {
      console.error(`Failed after ${(error as FailAttemptError).attempt} attempts`);
    }
    else{
      console.error((error as Error).message)
    }
  }

}

[[3,5],[3,2],[1,0],[5,5]].forEach( (dataSet) =>{
    runTest(dataSet);
});