import React, { useEffect, useState } from "react";
import axios from 'axios';

const Header = () => {

  const [joke, setJoke] = useState();
  const [randomJoke, setRandomJoke] = useState();
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  const jokeCategories = [
    {
      name: "Programming",
      api: "https://v2.jokeapi.dev/joke/Programming?type=single",
      format: "official"
    },
    {
      name: "2-part jokes",
      api: "https://official-joke-api.appspot.com/jokes/general/random",
      format: "official"
    },
    {
      name: "Dad Joke",
      api: "https://icanhazdadjoke.com/",
      format: "icanhaz"
    },
    {
      name: "Chuck Norris",
      api: "https://api.chucknorris.io/jokes/random",
      format: "chuck"
    },
  ];


  const fetchJoke = async (api, format) => {
    setLoading(true);
    try {
      const response = await axios.get(api, {
        headers: format === "icanhaz" ? { Accept: "application/json" } : {},
      });

      let jokeData;

      switch (format) {
        case "official":
          jokeData = response.data[0] || response.data; // sometimes it's an array
          break;
        case "icanhaz":
          jokeData = { joke: response.data.joke };
          break;
        case "chuck":
          jokeData = { joke: response.data.value };
          break;
        default:
          jokeData = { joke: "No joke format matched" };
      }

      setJoke(jokeData);
    } catch (error) {
      console.error("Joke Fetch Error:", error);
      setJoke({ joke: "Failed to load joke." });
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomJoke = async () => {
    setRandomLoading(true);

    try {
      const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
      setRandomJoke(response.data);
      setRandomLoading(false);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  useEffect(() => {
    fetchRandomJoke()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF9C4] text-[#2E2E2E] flex p-10">

      <div className="w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold my-10 text-center">
          Welcome to <span className="text-orange-500">jokesSunlo</span>
        </h1>

        <p>Wanna hear a random joke? Your life</p>
        <p>HAHA!!! Just kidding... Here you go</p>

        <div className="bg-white rounded-2xl mt-5 shadow-md p-6 max-w-xl w-full text-center">

          {
            randomLoading ? <h2>loading the joke...</h2> :
              randomJoke ?
                <>
                  <p className="text-xl md:text-2xl font-medium mb-4">
                    {randomJoke.setup}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-purple-600">
                    {randomJoke.punchline}
                  </p>
                </>
                : <h1>You are a joke lol</h1>
          }

        </div>


        <button onClick={fetchRandomJoke} className="mt-10 bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-full transition-all shadow-md">
          Next Joke 😄
        </button>
      </div>

      <div className="bg-[#FFE0B2] rounded-xl w-1/2">
        <div className="p-10 text-md">

          <div className="mt-5 space-x-4 flex flex-wrap">
            {jokeCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => fetchJoke(cat.api, cat.format)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-md px-3 py-1 rounded-full transition-all shadow-md m-1"
              >
                {cat.name}
              </button>
            ))}
          </div>


          <div className="mt-10 border rounded-xl bg-sky-100 p-10">
            {loading ? (
              <h2>Loading joke...</h2>
            ) : joke ? (
              joke.setup ? (
                <>
                  <h3 className="font-semibold">{joke.setup}</h3>
                  <p className="text-lg text-purple-600">{joke.punchline}</p>
                </>
              ) : (
                <p className="text-lg">{joke.joke}</p>
              )
            ) : (
              <p>Select a joke category above.</p>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Header;
