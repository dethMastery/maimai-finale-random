import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";

import { typeList, typeTranslated } from "./modules/list";
import type { dataInterface } from "./modules/interface";

const App = () => {
  const { readRemoteFile } = usePapaParse();

  const [apiData, setAPIData] = useState<dataInterface[] | null>(null);

  const [type, setType] = useState<string | null>(null);
  const [newType, setNewType] = useState<string | null>(null);
  const [showData, setShowData] = useState<dataInterface | null>(null);

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

  const typeHandler = () => {
    if (type === null && newType !== type) {
      setType(newType);
    } else {
      if (type !== null && newType !== type) {
        setType(newType);
      }
    }
  };

  const randomFunc = () => {
    if (apiData !== null) {
      typeHandler();

      if (newType !== null && newType !== "" && newType !== "none") {
        // Filtering Data
        let filteredData = apiData.filter((items) => {
          return items.Category === newType;
        });

        let randomString = Math.floor(Math.random() * filteredData.length);

        setShowData(filteredData[randomString]);
      } else {
        let randomString = Math.floor(Math.random() * apiData.length);

        setShowData(apiData[randomString]);
      }
    }
  };

  useEffect(() => {
    if (showData === null) {
      csvHandler();
    }
  }, [showData]);

  if (apiData != null) {
    if (showData != null) {
      return (
        <div className="w-full min-h-screen bg-jet text-whitesmoke flex flex-col justify-center items-center gap-4">
          <div className="w-[22rem] p-4 bg-whitesmoke text-jet rounded-xl text-center">
            <h1 className="text-2xl font-bold w-full">
              {showData["Music(Eng)"] != "-"
                ? showData["Music(Eng)"]
                : showData["Music(JPN)"]}
            </h1>
            <h3 className="text-lg opacity-80 w-full">
              {showData["Artist(Eng)"] != "-"
                ? showData["Artist(Eng)"]
                : showData["Artist(JPN)"]}
            </h3>

            <br />

            <div className="w-full flex flex-row gap-2 justify-center items-center">
              <p className="text-lg">
                {typeTranslated[typeList.indexOf(showData.Category)]}
              </p>
              {type !== null ? (
                type === showData.Category ? (
                  <div className="bg-amber-300 py-2 px-4 rounded-full border-jet border-solid border-2">
                    L
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>

            <br />

            {/* Diff */}
            <div className="w-full flex flex-row justify-around">
              <div>
                <p>EZ</p>
                <p>{showData.Easy}</p>
              </div>
              <div>
                <p>BC</p>
                <p>{showData.Basic}</p>
              </div>
              <div>
                <p>AD</p>
                <p>{showData.Advanced}</p>
              </div>
              <div>
                <p>EX</p>
                <p>{showData.Expert}</p>
              </div>
              <div>
                <p>MT</p>
                <p>{showData.Master}</p>
              </div>
              <div>
                <p>RE</p>
                <p>{showData["Re:Master"]}</p>
              </div>
            </div>
          </div>

          <select
            name="type"
            id="type"
            className="bg-whitesmoke text-jet text-center text-xl px-4 py-2 rounded-xl"
            onChange={(e) => setNewType(String(e.target.value))}
            value={
              newType != null && newType != ""
                ? newType
                : type !== null
                ? type
                : ""
            }
          >
            <option value="none">None</option>
            {typeList.map((item, i) => {
              return (
                <option value={item} key={i}>
                  {typeTranslated[i]}
                </option>
              );
            })}
          </select>

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
        <div className="w-full min-h-screen bg-jet text-whitesmoke flex flex-col justify-center items-center gap-4">
          <select
            name="type"
            id="type"
            className="bg-whitesmoke text-jet text-center text-xl px-4 py-2 rounded-xl"
            onChange={(e) => setNewType(String(e.target.value))}
            value={
              newType != null && newType != ""
                ? newType
                : type !== null
                ? type
                : ""
            }
          >
            <option value="none">None</option>
            {typeList.map((item, i) => {
              return (
                <option value={item} key={i}>
                  {typeTranslated[i]}
                </option>
              );
            })}
          </select>
          <button
            className="bg-living-coral p-4 rounded-xl text-xl hover:opacity-60 hover:cursor-pointer"
            onClick={() => randomFunc()}
          >
            Random!
          </button>
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
