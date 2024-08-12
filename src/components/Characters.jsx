import React, {useState, useEffect} from 'react'
import axios from 'axios'
import CharactersPreview from './CharactersPreview'

// Weapon icons
import Bow_Icon from '../images/Icon_Bow.webp'
import Catalyst_Icon from '../images/Icon_Catalyst.webp'
import Claymore_Icon from '../images/Icon_Claymore.webp'
import Polearm_Icon from '../images/Icon_Polearm.webp'
import Sword_Icon from '../images/Icon_Sword.webp'
import Orange_Star from '../images/Orange_Star.png'
import Purple_Star from '../images/Purple_Star.png'

const Characters = (props) => {
    
    // Array of filtered characters
    const [filteredCharacters, setFilteredCharacters] = useState(props.characters)

    const [filteredArray, setFilteredArray] = useState(props.masterCharacterDataArray)
    
    // Icons for each character button in the grid
    const [icons, setIcons] = useState([])
    
    // This will be set to true when the user clicks on a character and then their preview component will show instead of the grid.
    const [charPreviewState, setCharPreviewState] = useState(false)

    // This is the current character's data that is being previewed.
    const [charPreviewData, setCharPreviewData] = useState([])

    // An array of elements to iterate through for convenience
    const elements = [
        'Pyro',
        'Geo',
        'Electro',
        'Dendro',
        'Cryo',
        'Hydro',
        'Anemo'
    ]

    // An array of weapons to iterate through for convenience
    const weapons = [
        ['Sword', 'favonius-sword'],
        ['Bow', 'favonius-warbow'],
        ['Claymore', 'favonius-greatsword'],
        ['Polearm', 'favonius-lance'],
        ['Catalyst', 'favonius-codex']
    ]

    // The current selected elements, weapon types, and rarities that the user can filter through by pressing buttons.
    // This allows for multiple element filtering.
    const [selectedElements, setSelectedElements] = useState([])
    const [selectedWeapons, setSelectedWeapons] = useState([])
    const [selectedRarity, setSelectedRarity] = useState(null)

    // API call for one character
    // const getCharacterData = async (char) => {
    //     await axios.get('https://genshin.jmp.blue/characters/' + char)
    //     .then(res => console.log(res.data))
    // }

    // Helper function for converting character array into img src array for each character in grid.
    const getCharacterIcons = () => {
        const img_src_arrays_map = new Map();
        props.characters.map(char => {
           img_src_arrays_map[char] = "https://genshin.jmp.blue/characters/" + char + "/icon-big"
        })
        setIcons(img_src_arrays_map)
    }

    useEffect(() => {
        getCharacterIcons()
    }, [])

    // Map version
    // useEffect(() => {
    //     if (selectedElements.length > 0) {
    //         let empty_array = props.characters.filter(char => {
    //             let char_vision = props.masterCharacterDataMap[char]["vision"]
    //             // console.log(char_vision)
    //             // console.log(selectedElements)
    //             return (selectedElements.includes(char_vision))
    //         })
    //         setFilteredCharacters(empty_array)
    
    //     } else {
    //         setFilteredCharacters(props.characters)
    //     }
    // }, [selectedElements,])

    // Array version
    useEffect(() => {
        let currentArray = props.masterCharacterDataArray
        if (selectedElements.length == 0 && selectedWeapons.length == 0 && selectedRarity == null) {
            setFilteredArray(currentArray)
        }

        if (selectedElements.length > 0) {
            let emptyArray = currentArray.filter(char => {
                let char_vision = char["vision"]
                return (selectedElements.includes(char_vision))
            })
            currentArray = emptyArray
        }

        if (selectedWeapons.length > 0) {
            let emptyArray = currentArray.filter(char => {
                let char_weapon = char["weapon"]
                return (selectedWeapons.includes(char_weapon))
            })
            currentArray = emptyArray
        }

        if (selectedRarity != null) {
            let emptyArray = currentArray.filter(char => {
                let char_rarity = char["rarity"]
                console.log(char_rarity)
                return(selectedRarity == char_rarity)
            })
            currentArray = emptyArray
        }

        //Alphabetically sort the array at the end.
        currentArray = currentArray.sort((a,b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
        })
        setFilteredArray(currentArray)

    }, [selectedElements, selectedWeapons, selectedRarity])

    if (props.masterCharacterDataArray) {
    // Renders each character background orange for 5 star and purple for 4 star
    return (
    <div className = " w-5/6 mx-auto ">
        {/* When state is true, the current character details page will be rendered. When false, the grid will be rendered. */}
        {charPreviewState ? 
            <div className='items-center justify-center'>
                <CharactersPreview
                    setCharPreviewState={setCharPreviewState}
                    setCharPreviewData={setCharPreviewData}
                    charPreviewData={charPreviewData}
                /> 
            </div>
            :
            <div>
            <h1 className = "dark:text-white">Characters</h1>
            
            {/* <div> */}
                {/* Debugging */}
                {/* <button onClick = {() => console.log(props.masterCharacterData)}>props masterCharacterData</button>
                <button onClick = {() => console.log(props.characters)}>props characters</button>
                <button onClick = {() => console.log(filteredCharacters)}>filteredCharacters</button>
                <button onClick = {() => console.log(charPreviewData)}>preview character</button> */}
                {/* <button onClick = {() => {
                    const weapons = []
                    props.characters.map(char => {
                        weapons.push(props.masterCharacterData[char]["weapon"])
                    })
                    console.log(new Set(weapons))
                }}>list of weapons</button> */}
            {/* </div> */}
            {/* Filter function that filters prop's array into filteredCharacters array. */}
            {/* Also accounts for capitalization variances. */}
            <div className='inline-flex m-8 p-4 space-x-7'>

                {/* Filter by element */}
                <div>
                {elements.map(res => {
                    return(
                    <button className = {selectedElements.includes(res) ? "py-1 px-1 rounded-full bg-gray-300" : "py-1 px-1 rounded-full bg-gray-500"} onClick = {() =>
                        {
                            if (selectedElements.includes(res)) {
                                // setSelectedElements([...selectedElements.filter(entry => entry != res)])
                                setSelectedElements(current => [...current].filter(entry => entry != res))
                            } else {
                                // setSelectedElements([...selectedElements, res])
                                setSelectedElements(current => [...current, res])
                            }
                            console.log(selectedElements.length > 0)
                            // console.log(selectedElements.includes(res))
                            console.log(selectedElements)
                        }
                    }>
                        <img className="w-full h-full rounded-lg" src = {'https://genshin.jmp.blue/elements/' + res.toLowerCase() + '/icon'} />
                    </button>
                    )
                })}
                </div>

                {/* Filter by weapon type */}
                <div>
                {weapons.map(entry => {
                    let wep = entry[0]
                    let icon = null
                    if (wep == "Sword") {
                        icon = Sword_Icon
                    }
                    if (wep == "Bow") {
                        icon = Bow_Icon
                    }
                    if (wep == "Claymore") {
                        icon = Claymore_Icon
                    }
                    if (wep == "Polearm") {
                        icon = Polearm_Icon
                    }
                    if (wep == "Catalyst") {
                        icon = Catalyst_Icon
                    }
                    return(
                        <button className={selectedWeapons.includes(wep) ? "px-1 py-1 rounded-full bg-gray-300" : "px-1 py-1 rounded-full bg-gray-500"} onClick = {() => {
                            if (selectedWeapons.includes(wep)) {
                                setSelectedWeapons([...selectedWeapons].filter(entry => entry != wep))
                            } else {
                                setSelectedWeapons([...selectedWeapons, wep])
                            }
                        }}>
                            <img className="w-full h-full rounded-lg" src = {icon} />
                        </button>
                    )
                })}
                </div>
                {/* Filter by rarity */}
                <div>
                    <button className = {selectedRarity == 4 ? "py-1 px-1 rounded-full bg-gray-300" : "py-1 px-1 rounded-full bg-gray-500"} onClick = {() =>
                        {
                            if (selectedRarity == 4) {
                                setSelectedRarity(null)
                            } else {
                                setSelectedRarity(4)
                            }
                        }
                    }>
                        <img className="w-16 h-16 rounded-lg" src = {Purple_Star} />
                    </button>
                    <button className = {selectedRarity == 5 ? "py-1 px-1 rounded-full bg-gray-300" : "py-1 px-1 rounded-full bg-gray-500"} onClick = {() =>
                        {
                            if (selectedRarity == 5) {
                                setSelectedRarity(null)
                            } else {
                                setSelectedRarity(5)
                            }
                        }
                    }>
                        <img className="w-16 h-16 rounded-lg" src = {Orange_Star} />
                    </button>
                </div>

                {/* Filter by name */}
                <input type = "string" placeholder='Search Character' onChange = {(e) => {
                    let emptyArray = props.masterCharacterDataArray.filter(entry => entry["id"].includes(e.target.value.toLowerCase()))
                    setFilteredArray(emptyArray)
                }}/>
                
            </div>

            

            {/* Map version  */}
            {/* <input type = "string" placeholder='Search Character' onChange = {(e) => {
                let emptyArray = props.characters.filter(entry => entry.includes(e.target.value.toLowerCase()))
                setFilteredCharacters(emptyArray)
            }}/> */}


            {/* Character Grid */}
            {/* Map version. */}
            {/* <div className = "grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 ">
                {filteredCharacters.map(entry => {
                    if (props.masterCharacterDataMap[entry]["rarity"] == 4) {
                        return(
                            <div className = "w-full h-full">
                                <button className = "rounded-lg bg-gradient-to-b from-purple-500 to-white" ><img className="w-full h-full rounded-lg bg-gradient-to-b from-purple-500 to-white" src = {icons[entry]} onClick = {() => {
                                    setCharPreviewState(true)
                                    setCharPreviewData(props.masterCharacterDataMap[entry])
                                }}/></button>
                                <h2 className = "capitalize">{entry}</h2>
                            </div>
                        )
                    }
                    if (props.masterCharacterDataMap[entry]["rarity"] == 5) {                   
                        return(
                            <div className = "w-full h-full">
                                <button className = "rounded-lg bg-gradient-to-b from-orange-500 to-white" ><img className="w-full h-full rounded-lg bg-gradient-to-b from-orange-500 to-white" src = {icons[entry]} onClick = {() => {
                                    setCharPreviewState(true)
                                    setCharPreviewData(props.masterCharacterDataMap[entry])
                                }}/></button>
                                <h2 className = "capitalize">{entry}</h2>
                            </div>
                        )
                    }
                    
                })}                
            </div>   */}

            {/* Array version */}
            <div className = "grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 ">
                {/* <button onClick = {() => console.log(filteredArray)}>filtered array </button> */}
                {filteredArray.map(entry => {
                    if (entry["rarity"] == 4) {
                        return(
                            <div className = "border-4 w-full h-full box rounded-lg hover:bg-purple-500 hover:border-purple-500 transition duration-300 ease-in-out">
                                <button className = "bg-gradient-to-b from-purple-500 to-white" >
                                    <img className="w-full h-full rounded-lg " src = {icons[entry["id"].toLowerCase()]} onClick = {() => {
                                    setCharPreviewState(true)
                                    setCharPreviewData(entry)
                                }}/></button>
                                <h2 className = "capitalize dark:text-white">{entry["name"]}</h2>
                            </div>
                        )
                    }
                    if (entry["rarity"] == 5) {                   
                        return(
                            <div className = "border-4 w-full h-full box rounded-lg hover:bg-orange-500 hover:border-orange-500 transition duration-300 ease-in-out">
                                <button className = "bg-gradient-to-b from-orange-500 to-white" >
                                    <img className="w-full h-full rounded-lg " src = {icons[entry["id"].toLowerCase()]} onClick = {() => {
                                    setCharPreviewState(true)
                                    setCharPreviewData(entry)
                                }}/></button>
                                <h2 className = "capitalize dark:text-white">{entry["name"]}</h2>
                            </div>
                        )
                    }
                    
                })}                
            </div>  
        </div>
        }
    </div>
)
    } else {
        <div>
            Loading
        </div>
    }
    
}

export default Characters