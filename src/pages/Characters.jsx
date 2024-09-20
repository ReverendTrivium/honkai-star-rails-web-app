import React, {useState, useEffect } from 'react'
import axios from 'axios'
import CharactersPreview from '../components/CharactersPreview'
import { AssetFinder } from 'enkanetwork.js';
import Loader from '../components/Loader'; 

// Light Cone icons (for Star Rail weapons)
import Nihility_Icon from '../images/Icon_Nihility.webp';
import Destruction_Icon from '../images/Icon_Destruction.webp';
import Harmony_Icon from '../images/Icon_Harmony.webp';
import Erudition_Icon from '../images/Icon_Erudition.webp';
import Preservation_Icon from '../images/Icon_Preservation.webp';
import Hunt_Icon from '../images/Icon_Hunt.webp';
import Abundance_Icon from '../images/Icon_Abundance.webp';
import Orange_Star from '../images/Orange_Star.png';
import Purple_Star from '../images/Purple_Star.png';

const Characters = (props) => {

    // State to manage loading status
    const [loading, setLoading] = useState(true);

    // State for fetched character data
    const [characterData, setCharacterData] = useState([]);

    // Function to fetch IDs from the JSON file
    const fetchCharacterIds = async () => {
        try {
            const response = await axios.get('/CharacterIDs.json'); // Replace with actual path or URL to JSON file
            return response.data.ids; // Assuming the JSON structure is { "ids": [...] }
        } catch (error) {
            console.error('Error fetching character IDs:', error);
            return []; // Return an empty array if there's an error
        }
    };

    // Function to fetch character data from the API using the fetched IDs
    const fetchCharacters = async (ids) => {
        try {
            const assetFinder = new AssetFinder(); // Initialize the asset finder
            const fetchedData = [];
            for (const id of ids) {
                // Fetch each character's data using the ID
                const character = await assetFinder.starrail.character(id);
                
                // Generate the icon URL using starrail.toLink method
                const iconUrl = assetFinder.starrail.toLink(`SpriteOutput/AvatarRoundIcon/${id}.png`);
                
                // Push the character's name and icon URL to the array
                fetchedData.push({
                    id,
                    name: character.name,
                    icon: iconUrl,
                    assets: character.assets,
                });
            }
            
            setCharacterData(fetchedData); // Save fetched data to state
            setLoading(false); // Set loading to false when done
        } catch (error) {
            console.error('Error fetching character data:', error);
            setLoading(false); // Stop loading if there is an error
        }
    };
    
    useEffect(() => {
        // First, fetch the character IDs from the JSON file
        const fetchData = async () => {
            const ids = await fetchCharacterIds(); // Fetch the dynamic IDs
            if (ids.length > 0) {
                await fetchCharacters(ids); // Pass the fetched IDs to fetchCharacters to get character data
            } else {
                setLoading(false); // No IDs, stop loading
            }
        };
            
        fetchData(); // Call the function when the component mounts
    }, []);

    if (loading) {
        return <Loader />; // Show loader while data is being fetched
    }

    // Array of filtered characters
    const [filteredCharacters, setFilteredCharacters] = useState(props.characters);
    const [filteredArray, setFilteredArray] = useState(props.masterCharacterDataArray);

    // For toggling between grid and table for filteredArray
    // True for table and false for grid
    const [form, setForm] = useState(true)

    // For table form
    const [page, setPage] = useState(0)
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    
    // Icons for each character button in the grid
    const [icons, setIcons] = useState([])

    // Paths (Elements in Star Rail)
    const paths = [
        'Destruction',
        'Hunt',
        'Erudition',
        'Harmony',
        'Nihility',
        'Preservation',
        'Abundance'
    ];

    // Light Cones (Weapons in Star Rail)
    const lightCones = [
        ['Destruction', Destruction_Icon],
        ['Hunt', Hunt_Icon],
        ['Erudition', Erudition_Icon],
        ['Harmony', Harmony_Icon],
        ['Nihility', Nihility_Icon],
        ['Preservation', Preservation_Icon],
        ['Abundance', Abundance_Icon]
    ];

    // Function to map Light Cone types to icons
    function getLightConeIcon(path) {
        const foundIcon = lightCones.find(([key]) => key === path);
        return foundIcon ? foundIcon[1] : null;
    }

     // Color palette for different paths
    const pathColors = {
        "Destruction": "bg-red-100 dark:bg-red-600",
        "Hunt": "bg-blue-100 dark:bg-blue-600",
        "Erudition": "bg-yellow-100 dark:bg-yellow-600",
        "Harmony": "bg-green-100 dark:bg-green-600",
        "Nihility": "bg-purple-100 dark:bg-purple-600",
        "Preservation": "bg-teal-100 dark:bg-teal-600",
        "Abundance": "bg-pink-100 dark:bg-pink-600"
    };

    // The current selected elements, light cone types, and rarities that the user can filter through by pressing buttons.
    // This allows for multiple element filtering.
    // Selected filters for paths, weapons (light cones), rarity, and name
    const [selectedPaths, setSelectedPaths] = useState([]);
    const [selectedLightCones, setSelectedLightCones] = useState([]);
    const [selectedRarity, setSelectedRarity] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    useEffect(() => {
        let currentArray = props.masterCharacterDataArray;

        // If no filters are selected, show all characters
        if (selectedPaths.length === 0 && selectedLightCones.length === 0 && selectedRarity === null && selectedName.length === 0) {
            setFilteredArray(currentArray);
            return;
        }

        // Filter by paths (elements in Star Rail)
        if (selectedPaths.length > 0) {
            let filteredByPaths = currentArray.filter(char => {
                let charPath = char["path"];
                return selectedPaths.includes(charPath);
            });
            currentArray = filteredByPaths;
        }

        // Filter by light cones (weapons in Star Rail)
        if (selectedLightCones.length > 0) {
            let filteredByLightCones = currentArray.filter(char => {
                let charLightCone = char["lightCone"];
                return selectedLightCones.includes(charLightCone);
            });
            currentArray = filteredByLightCones;
        }

        // Filter by rarity
        if (selectedRarity !== null) {
            let filteredByRarity = currentArray.filter(char => char["rarity"] === selectedRarity);
            currentArray = filteredByRarity;
        }

        // Filter by name search
        if (selectedName.length > 0) {
            let filteredByName = currentArray.filter(char => char["name"].toLowerCase().includes(selectedName.toLowerCase()));
            currentArray = filteredByName;
        }

        // Sort alphabetically by name at the end
        currentArray = currentArray.sort((a, b) => a.name.localeCompare(b.name));
        
        setFilteredArray([...currentArray]);

    }, [selectedPaths, selectedLightCones, selectedRarity, selectedName]);

    return (
        <div className={props.charPreviewState ? pathColors[props.charPreviewData.path] + " p-2 md:p-4 min-h-screen" : "min-h-screen p-2 md:p-4"}>
            {/* When state is true, render the character details page. Otherwise, render the grid. */}
            {props.charPreviewState ? 
                <div>
                    <CharactersPreview
                        setCharPreviewState={props.setCharPreviewState}
                        setCharPreviewData={props.setCharPreviewData}
                        charPreviewData={props.charPreviewData}
                        rosterData={props.masterCharacterDataArray}
                    />
                </div>
            :
                <div className=''>
                    <div className="h-20"></div>
                    <h1 className="p-4 text-black dark:text-white">Characters</h1>

                    {/* Filter Function */}
                    <div className="md:m-4">
                        <div className="bg-slate-800 dark:bg-slate-500 h-1 w-full"></div>
                        <div className="lg:inline-flex m-2 md:m-4 md:space-x-7 max-lg:space-y-2">
                            
                            {/* Filter by path */}
                            <div className="flex p-2 items-center justify-center">
                            {paths.map(path => (
                                <div key={path} className="relative group inline-block">
                                    <button 
                                        className={selectedPaths.includes(path) ? "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-800 dark:bg-gray-300" : "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-400 dark:bg-gray-500"}
                                        onClick={() => {
                                            if (selectedPaths.includes(path)) {
                                                setSelectedPaths(prev => prev.filter(p => p !== path));
                                            } else {
                                                setSelectedPaths(prev => [...prev, path]);
                                            }
                                        }}
                                    >
                                        <img className="object-scale-down w-full h-full rounded-lg" src={getLightConeIcon(path)} alt={path} />
                                    </button>
                                    <div className="max-md:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-300 dark:bg-slate-400 text-black dark:text-white text-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {path}
                                    </div>
                                </div>
                            ))}
                            </div>

                            {/* Filter by light cone */}
                            <div className="flex p-2 items-center justify-center">
                            {lightCones.map(([cone, icon]) => (
                                <div key={cone} className="relative group inline-block">
                                    <button 
                                        className={selectedLightCones.includes(cone) ? "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-800 dark:bg-gray-300" : "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-400 dark:bg-gray-500"}
                                        onClick={() => {
                                            if (selectedLightCones.includes(cone)) {
                                                setSelectedLightCones(prev => prev.filter(lc => lc !== cone));
                                            } else {
                                                setSelectedLightCones(prev => [...prev, cone]);
                                            }
                                        }}
                                    >
                                        <img className="object-scale-down h-full w-full rounded-lg" src={icon} alt={cone} />
                                    </button>
                                    <div className="max-md:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-300 dark:bg-slate-400 text-black dark:text-white text-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {cone}
                                    </div>
                                </div>
                            ))}
                            </div>

                            {/* Filter by rarity */}
                            <div className="flex p-2 items-center justify-center">
                                <div className="relative group inline-block">
                                    <button 
                                        className={selectedRarity === 4 ? "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-800 dark:bg-gray-300" : "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-400 dark:bg-gray-500"}
                                        onClick={() => setSelectedRarity(selectedRarity === 4 ? null : 4)}
                                    >
                                        <img className="object-scale-down md:h-16 md:w-16 rounded-lg" src={Purple_Star} alt="4 Star" />
                                    </button>
                                    <div className="max-md:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-300 dark:bg-slate-400 text-black dark:text-white text-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        4&nbsp;Star&nbsp;Rarity
                                    </div>
                                </div>

                                <div className="relative group inline-block">
                                    <button 
                                        className={selectedRarity === 5 ? "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-800 dark:bg-gray-300" : "flex items-center max-md:w-10 max-md:h-10 py-1 px-1 rounded-full bg-gray-400 dark:bg-gray-500"}
                                        onClick={() => setSelectedRarity(selectedRarity === 5 ? null : 5)}
                                    >
                                        <img className="object-scale-down md:h-16 md:w-16 rounded-lg" src={Orange_Star} alt="5 Star" />
                                    </button>
                                    <div className="max-md:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-300 dark:bg-slate-400 text-black dark:text-white text-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        5&nbsp;Star&nbsp;Rarity
                                    </div>
                                </div>
                            </div>

                            {/* Filter by name */}
                            <input 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 max-lg:w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                id="character-search"
                                type="text"
                                placeholder="Search Character"
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)}
                            />

                            {/* Toggle between grid and table */}
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" onClick={() => setForm(prev => !prev)} />
                                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm md:text-md lg:text-lg font-medium text-black dark:text-gray-300">Toggle Grid/Table</span>
                            </label>
                        </div>
                        <div className="bg-slate-800 dark:bg-slate-500 h-1 w-full"></div>
                    </div>

                    {/* Character Grid */}
                    {form ? (
                        <div className="lg:w-4/5 lg:mx-auto grid max-md:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2 md:gap-4">
                            {filteredArray.map(entry => (
                                <div key={entry.id} className="border-4 border-black dark:border-white w-full h-full rounded-lg hover:bg-orange-500 hover:border-orange-500 transition duration-300 ease-in-out">
                                    <button className="bg-gradient-to-b from-orange-500 to-white">
                                        <img className="w-full h-full rounded-lg" src={entry.icon} onClick={() => {
                                            props.setCharPreviewState(true);
                                            props.setCharPreviewData(entry);
                                        }} alt={entry.name} />
                                    </button>
                                    <h2 className="capitalize text-black dark:text-white min-h-8 flex justify-center align-middle">{entry.name}</h2>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No characters available.</div>
                    )}
                </div>
            }
        </div>
    );
}

export default Characters