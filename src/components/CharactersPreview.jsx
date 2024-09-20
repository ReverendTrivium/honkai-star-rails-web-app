import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Sidebar from './Sidebar'
import SkillTalents from './SkillTalents'
import Keywords from '../utility/Keywords'
import AscensionMaterials from './AscensionMaterials'

const CharactersPreview = (props) => {
    const [card, setCard] = useState([])
    const [icon, setIcon] = useState([])
    const [loading, setLoading] = useState(true)
    const [birthday, setBirthday] = useState("")
    const [releaseDate, setReleaseDate] = useState("")
    const [images, setImages] = useState([])
    const keywords = [...Keywords]

    const pathColors = {
        "Destruction": {
            "Card": "bg-red-300 hover:bg-red-400 dark:bg-red-900 dark:hover:bg-red-800",
        },
        "Hunt": {
            "Card": "bg-blue-300 hover:bg-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800",
        },
        "Erudition": {
            "Card": "bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-900 dark:hover:bg-yellow-800",
        },
        "Harmony": {
            "Card": "bg-green-300 hover:bg-green-400 dark:bg-green-900 dark:hover:bg-green-800",
        },
        "Nihility": {
            "Card": "bg-purple-300 hover:bg-purple-400 dark:bg-purple-900 dark:hover:bg-purple-800",
        },
        "Preservation": {
            "Card": "bg-teal-300 hover:bg-teal-400 dark:bg-teal-900 dark:hover:bg-teal-800",
        },
        "Abundance": {
            "Card": "bg-pink-300 hover:bg-pink-400 dark:bg-pink-900 dark:hover:bg-pink-800",
        }
    }

    // Helper function for converting birthday and release date data from API to a readable string.
    const convertDates = () => {
        let temp_birthday = moment(props.charPreviewData.birthday, "YYYY-MM-DD").format("MMMM D")
        let temp_release = moment(props.charPreviewData.release, "YYYY-MM-DD").format("MMMM D YYYY")
        setBirthday(temp_birthday)
        setReleaseDate(temp_release)
    }

    // Fetch character images for Star Rail
    const getCharacterImage = (charId) => {
        const cardUrl = `https://starrail.jmp.blue/characters/${charId}/portrait` // Star Rail URL
        const iconUrl = `https://starrail.jmp.blue/characters/${charId}/icon-big` // Star Rail URL

        setCard(cardUrl)
        setIcon(iconUrl)
    }

    const callAPI = (charId) => {
        let data = {
            "talent-skill": `https://starrail.jmp.blue/characters/${charId}/talent-skill`,
            "talent-ultimate": `https://starrail.jmp.blue/characters/${charId}/talent-ultimate`,
            "talent-passive": `https://starrail.jmp.blue/characters/${charId}/talent-passive`,
            "namecard-background": `https://starrail.jmp.blue/characters/${charId}/namecard-background`
        }

        setImages(data)
    }

    useEffect(() => {
        getCharacterImage(props.charPreviewData.id)
        callAPI(props.charPreviewData.id)
        setLoading(false)
        convertDates()

        // Add skills to the keywords
        props.charPreviewData.skillTalents.forEach(entry => {
            keywords.push(entry.name)
        })
    }, [])

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="lg:mb-4">
            <div className="h-24"></div>

            {/* Mobile */}
            <div id="/" className="lg:hidden space-y-2 py-4 items-center rounded-lg h-screen">
                <div className="my-2 flex items-center justify-center">
                    <img className="rounded-lg" src={icon} alt={props.charPreviewData.name}></img>
                </div>
                <div className="py-2 items-start justify-start text-start">
                    <h1 className="text-black dark:text-white text-5xl md:text-9xl uppercase font-bold">{props.charPreviewData.name}</h1>
                    <p className="text-gray-500 dark:text-gray-300 italic text-2xl md:text-4xl uppercase font-bold">{props.charPreviewData.title}</p>
                    <h2 className="text-black dark:text-white mb-2 text-sm md:text-xl">{props.charPreviewData.description}</h2>
                </div>
                <button className={`${pathColors[props.charPreviewData.path]["Card"]} border-gray-800 dark:border-white text-black dark:text-white rounded-full`} onClick={() => {
                    props.setCharPreviewData([])
                    props.setCharPreviewState(false)
                }}>Go Back</button>
            </div>

            {/* PC */}
            <div id="/" className="max-lg:hidden lg:grid lg:grid-cols-2 lg:gap-4 items-center rounded-lg bg-cover bg-center lg:h-screen">
                <div className="h-full min-h-screen flex items-center justify-end p-4">
                    <img className="object-contain max-h-screen" src={card} alt={props.charPreviewData.name}></img>
                </div>
                <div className="items-start justify-start text-left mr-10 space-y-16">
                    <div>
                        <h1 className="dark:text-white text-black text-9xl uppercase font-bold">{props.charPreviewData.name}</h1>
                        <p className="dark:text-gray-300 italic text-gray-500 text-2xl uppercase font-bold">{props.charPreviewData.title}</p>
                        <h2 className="mb-2 text-3xl text-black dark:text-white">{props.charPreviewData.description}</h2>
                    </div>
                    <div className="space-x-5">
                        <button className={`${pathColors[props.charPreviewData.path]["Card"]} group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-black dark:text-white border border-black dark:border-white`} onClick={() => document.getElementById('Skill Talents').scrollIntoView({ behavior: 'smooth' })}>
                            <span className="text-2xl">Skills</span>
                        </button>
                        <button className={`${pathColors[props.charPreviewData.path]["Card"]} group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-black dark:text-white border border-black dark:border-white`} onClick={() => document.getElementById('Ascension Materials').scrollIntoView({ behavior: 'smooth' })}>
                            <span className="text-2xl">Ascension Materials</span>
                        </button>
                        <button className={`${pathColors[props.charPreviewData.path]["Card"]} group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-black dark:text-white border border-black dark:border-white`} onClick={() => {
                            props.setCharPreviewData([])
                            props.setCharPreviewState(false)
                            window.scrollTo(0, 0)
                        }}>
                            <span className="text-2xl">Go Back</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Skill Talents */}
            <div id="Skill Talents" className="scroll-mt-20 dark:text-white block lg:p-6 rounded-3xl gap-4">
                <SkillTalents
                    keywords={keywords}
                    keywordsColor={pathColors[props.charPreviewData.path]["Keyword-Text"]}
                    images={images}
                    skillTalents={props.charPreviewData.skillTalents}
                    cardColor={pathColors[props.charPreviewData.path]["Card"]}
                    rosterData={props.rosterData}
                    charPreviewData={props.charPreviewData}
                />
            </div>

            {/* Ascension Materials */}
            {props.charPreviewData["ascension_materials"] &&
                <div id="Ascension Materials" className="scroll-mt-20 dark:text-white block lg:p-6 rounded-3xl gap-4">
                    <AscensionMaterials
                        data={props.charPreviewData.ascension_materials}
                        quantityTheme={pathColors[props.charPreviewData.path]["Ascension-Quantity"]}
                        tabTheme={pathColors[props.charPreviewData.path]["Card"]}
                        borderTheme={pathColors[props.charPreviewData.path]["Ascension-Border"]}
                    />
                </div>
            }
        </div>
    )
}

export default CharactersPreview
