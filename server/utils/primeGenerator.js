const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

exports.getDailyWave = () => {
  let wave = [];

  for (let i = 0; i < 20; i++) {
    const num = Math.floor(Math.random() * 100) + 1; 
    const primeStatus = isPrime(num);
    wave.push({
      value: num,
      isPrime: primeStatus,
      type: primeStatus ? 'HEAL' : 'LASER' 
    });
  }
  return wave;
};