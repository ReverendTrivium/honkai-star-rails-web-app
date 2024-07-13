import { useState, useEffect } from 'react'
import './App.css'
import './output.css'
import axios from 'axios';
import Characters from './components/Characters';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('Home')
  const [characters, setCharacters] = useState([])
  const [masterCharacterDataMap, setMasterCharacterDataMap] = useState([])
  const [masterCharacterDataArray, setMasterCharacterDataArray] = useState([])
  const types = [
    'artifacts',
    'boss',
    'characters',
    'consumables',
    'domains',
    'elements',
    'enemies',
    'materials',
    'nations',
    'weapons'
  ]

  const fetchData = async (text) => {
    try{
      setLoading(true)
      await axios.get('https://genshin.jmp.blue/characters' + text)
      .then(res => {
        setCharacters(res.data)
        const api_data_map = new Map()
        const api_data_array = []
        res.data.map(async char => {
          try {
            await axios.get('https://genshin.jmp.blue/characters/' + char)
            .then(res => {
              api_data_map[char] = res.data
              api_data_array.push(res.data)
            })
          } catch (error) {
            console.log("Error getting API: ", error)
          }
        })
        setMasterCharacterDataMap(api_data_map)
        setMasterCharacterDataArray(api_data_array)
        // console.log("we're here 1")
      }).then(() => {
        // console.log("we're here 2")
        setLoading(false)
        // console.log("we're here 3")
      }
        
      )
    } catch (error) {
      // setLoading(false)
      console.log(error)
    }
  }
  const getCharacterDataAll = async () => {
    const api_data = new Map();
    console.log("working")
    await characters.map(char => {
        try {
            axios.get('https://genshin.jmp.blue/characters/' + char)
            .then(res => api_data[char] = res.data)
        } catch (error) {
            console.log("Error getting API: ", error)
        }
        
    })
    setMasterCharacterDataMap(api_data)  
  }
  useEffect(() => {
    fetchData('')
    // .then(() => getCharacterDataAll())
  }, [])
  return (
    <div className="bg-paimon bg-center w-screen bg-cover bg-slate-800 bg-no-repeat md:h-[350px] min-h-screen flex flex-col justify-between items-center">
      {loading ? 
      <div>
        Loading Page
      </div> :
      <div className='mb-auto h-10 min-height-full min-h-screen flex-grow'>
              {/* Navbar */}
        <div className="inline-flex rounded-md shadow-sm h-10 bg-black" role="group">
          <button className = "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700" onClick = {() => setPage('Home')}>Home</button>
          <button onClick = {() => setPage('Characters')}>Characters</button>
          <button onClick = {() => setPage('Weapons')}>Weapons</button>
          <button onClick = {() => setPage('Dev')}>Dev</button>
        </div>

        <div className = "">
          {/* Home */}
          {page == 'Home' && 
          <div className = "">
            <Home />
          </div>  
          }

          {/* Characters */}
          {page == 'Characters' &&
            <Characters 
              characters = {characters}
              masterCharacterDataMap = {masterCharacterDataMap}
              masterCharacterDataArray = {masterCharacterDataArray}
              loading = {loading}
            />
          }
        
          {/* Dev */}
          {page == 'Dev' &&
          <div>
            <button onClick={() => console.log(data)}> Get data. </button>
            <button onClick={() => console.log(masterCharacterDataMap)}> Get master character data. </button>
            {
              types.map(entry => {
                return(
                  <div>
                    <button onClick = {() => {
                      fetchData(entry)
                    }}> {entry} </button>
                  </div>
                )
              })
            }
          </div>
          }
        
        </div>

        {/* Footer */}
        <div className='min-h-screen '>
          <Footer/>
        </div>
      </div>
      }
      
    </div>
  )
}

export default App
