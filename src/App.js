import axios from 'axios';
import React, { Fragment, useState, useEffect } from 'react';
import { defaultUser, squad, baseURL } from './constants'

import './App.css';

function App () {
  const [global, setGlobal] = useState(null);
  const [isError, setIsError] = useState(false);
  const [realtime, setRealtime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState(defaultUser);
  const [selectedData, setSelectedData] = useState(null);
  const [url, setUrl] = useState(baseURL + '&player=' + defaultUser);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await axios.get(url);

        setSelectedData(response.data.legends.selected);
        setGlobal(response.data.global);
        setRealtime(response.data.realtime);

      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
 
    fetchData();
  }, [url]);

  return (
    <Fragment>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Fragment>
          <header>
            <h2>{global && global.name}</h2>
            <span>Current Level: {global && global.level}</span> 
          </header>

          <section>
          <div className="row">
            <div className="column">
              <h2>Status: </h2>
              <ul>
                <li>Online: {realtime && realtime.isOnline === 0 && 'No'}</li>
                <li>in a game: {realtime && realtime.isInGame === 0 && 'No'}</li>
                <li>Can join game: {realtime && realtime.canJoin === 0 && 'No'}</li>
                <li>Full Party: {realtime && realtime.partyFull === 0 && 'No'}</li>
              </ul>

              <h2>Squad: </h2>
              <ul>
                {squad.map(member => (
                  <li key={member.name}>
                    <button
                      className='link'
                      onClick={() =>
                        setUrl(`${baseURL}&player=${member.tag}`)
                      }
                    >
                      {member.name}
                    </button>
                  </li>
                ))}
              </ul>
              
            </div>
            <div className="column">
              <h2>Rank</h2>
              Season: <br /><img alt={global && global.rank.rankName} src={global && global.rank.rankImg}></img><br />
              Arena: <br /><img alt={global && global.arena.rankName} src={global && global.arena.rankImg}></img>
            </div>
            <div className="column">
              <h2>Current Character</h2>
              <p>{selectedData && selectedData.LegendName}</p> 
              <ul>
                {selectedData && selectedData.data.map(item => (
                  <li key={item.key}>{item.name}: {item.value}</li>
                ))}
              </ul>
              <img 
                className='legend'
                alt={selectedData && selectedData.LegendName} 
                src={selectedData &&selectedData.ImgAssets.icon} 
              ></img>
            </div>
          </div>
          </section>

        <footer>
          <input
            type="text"
            value={player}
            onChange={event => setPlayer(event.target.value)}
          />
          <button
            type="button"
            data-testid='search-player'
            onClick={() =>
              setUrl(`${baseURL}&player=${player}`)
            }
          >
            Search
          </button>
        </footer>
        </Fragment>
      )}
    </Fragment>
  );
}

export default App;
