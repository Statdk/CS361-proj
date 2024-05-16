fetch("http://localhost:2013/request?type=equipment&isPrime=false").then(res => res.json()).then(
  (data) => {
    console.log(data[0]);
  }
);