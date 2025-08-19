import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import type { dataInterface } from "./modules/interface";

const App = () => {
  const { readRemoteFile } = usePapaParse();

  const [apiData, setAPIData] = useState<dataInterface[] | null>(null);
  const [random, setRandom] = useState<number>(-1);

  const csvHandler = () => {
    readRemoteFile("/api.csv", {
      complete: (res) => {
        let data: string[][] = res.data as string[][];

        // Clean Data
        let head: string[] = data[0];
        let ignoreList: number[] = [9, 17, 18, 19];
        let jsonBlock: dataInterface[] = [];

        let regex = /Removed\([^)]*\)/i;

        for (let i = 1; i < data.length; i++) {
          if (data[i][19] != "Japan only") {
            if (!regex.test(data[i][19])) {
              let jsonTemplate: string = "{";

              for (let j = 0; j < head.length / 2 + 1; j++) {
                if (ignoreList.indexOf(j) < 0) {
                  jsonTemplate += `"${head[j]}": "${data[i][j].replaceAll(
                    `"`,
                    `'`
                  )}", `;
                }

                if (j == head.length / 2 - 1) {
                  jsonTemplate = jsonTemplate.slice(0, -2);
                  jsonTemplate += "}";

                  let temp: dataInterface = JSON.parse(jsonTemplate);

                  jsonBlock.push(temp);
                }
              }
            }
          }
        }

        // console.log(jsonBlock);

        setAPIData(jsonBlock);
      },
      download: true,
    });
  };

  const randomFunc = () => {
    if (apiData !== null) {
      let randomString = Math.floor(Math.random() * apiData.length);

      setRandom(randomString);
    }
  };

  useEffect(() => {
    if (random < 0) {
      csvHandler();
    } else {
    }
  }, [random]);

  if (apiData != null) {
    if (random < 0) {
      return (
        <div className="w-full min-h-screen bg-jet text-whitesmoke flex justify-center items-center">
          <button
            className="bg-living-coral p-4 rounded-xl text-xl hover:opacity-60 hover:cursor-pointer"
            onClick={() => randomFunc()}
          >
            Random!
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-full min-h-screen bg-jet text-whitesmoke flex justify-center items-center">
          <div className="w-[22rem] p-4 bg-whitesmoke text-jet rounded-xl text-center">
            <h1 className="text-2xl font-bold">
              {apiData[random]["Music(Eng)"] != "-"
                ? apiData[random]["Music(Eng)"]
                : apiData[random]["Music(JPN)"]}
            </h1>
            <h3 className="text-lg opacity-80">
              {apiData[random]["Artist(Eng)"] != "-"
                ? apiData[random]["Artist(Eng)"]
                : apiData[random]["Artist(JPN)"]}
            </h3>

            <br />

            <p>{apiData[random].Category}</p>

            <br />

            {/* Diff */}
            <div className="w-full flex flex-row justify-around">
              <div>
                <p>EZ</p>
                <p>{apiData[random].Easy}</p>
              </div>
              <div>
                <p>BC</p>
                <p>{apiData[random].Basic}</p>
              </div>
              <div>
                <p>AD</p>
                <p>{apiData[random].Advanced}</p>
              </div>
              <div>
                <p>EX</p>
                <p>{apiData[random].Expert}</p>
              </div>
              <div>
                <p>MT</p>
                <p>{apiData[random].Master}</p>
              </div>
              <div>
                <p>RE</p>
                <p>{apiData[random]["Re:Master"]}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="w-full min-h-screen bg-jet text-whitesmoke flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }
};

export default App;
