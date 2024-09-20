import { useState, useEffect } from 'react';
import './App.css';
import './output.css';
import { StarRail } from 'starrail.js';  // Import StarRail.js
import Footer from './components/Footer';
import Theme from './components/Theme';
import Loader from './components/Loader';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Characters from './pages/Characters';
import LightCones from './pages/LightCones';
import Dev from './pages/Dev';
import Artifacts from './pages/Artifacts';
import Consumables from './pages/Consumables';

function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('Home');
  const [characters, setCharacters] = useState([]);
  const [masterCharacterDataMap, setMasterCharacterDataMap] = useState(new Map());
  const [masterCharacterDataArray, setMasterCharacterDataArray] = useState([]);

  // This is the current character's data that is being previewed.
  const [charPreviewState, setCharPreviewState] = useState(false);
  const [charPreviewData, setCharPreviewData] = useState(false);

  const types = [
    'characters',
    'lightcones',
    'artifacts',
    'consumables'
  ];

  const fetchData = async (type) => {
    try {
      setLoading(true);
      const client = new StarRail();  // Initialize the StarRail client

      if (type === 'characters') {
        // Fetch all characters
        const charactersList = await client.getAllCharacters();  
        setCharacters(charactersList);

        // Fetch individual character data
        const characterDataArray = await Promise.all(charactersList.map(async (char) => {
          const charData = await client.getCharacterById(char.id);
          return charData;
        }));
        setMasterCharacterDataArray(characterDataArray);
      }
      
      // You can add more logic here for other types such as lightcones, artifacts, etc.
      
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('characters');  // Fetch character data when the app loads
  }, []);

  return (
    <div className="">
      <div className="">
        {/* Navbar */}
      </div>

      {loading ? (
        <div>
          <Loader loading={loading} />
        </div>
      ) : (
        <div className='min-h-screen flex-grow bg-slate-100 dark:bg-slate-900'>
          <Navbar
            setPage={setPage}
            setCharPreviewState={setCharPreviewState}
            setCharPreviewData={setCharPreviewData}
          />
          <div className="">
            {/* Home */}
            {page === 'Home' && (
              <Home
                setPage={setPage}
                setCharPreviewData={setCharPreviewData}
                setCharPreviewState={setCharPreviewState}
              />
            )}

            {/* Characters */}
            {page === 'Characters' && (
              <Characters
                characters={characters}
                masterCharacterDataArray={masterCharacterDataArray}
                loading={loading}
                setPage={setPage}
                setCharPreviewState={setCharPreviewState}
                charPreviewState={charPreviewState}
                setCharPreviewData={setCharPreviewData}
                charPreviewData={charPreviewData}
              />
            )}

            {/* LightCones */}
            {page === 'LightCones' && <LightCones />}

            {/* Artifacts */}
            {page === 'Artifacts' && <Artifacts />}

            {/* Consumables */}
            {page === 'Consumables' && <Consumables />}
            
            {/* Dev */}
            {page === 'Dev' && <Dev types={types} />}
          </div>

          {/* Footer */}
          <div className="">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
