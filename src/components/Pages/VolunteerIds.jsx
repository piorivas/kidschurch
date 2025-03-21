import { use, useEffect, useState } from "react";
import useIdCards from "../../hooks/useIdCards";
import ModalLogin from "../Modal/ModalLogin";


export const VolunteerIds = () => {
    const { generateIds, getPdfUrl, getSlidesId } = useIdCards();
    const [idRange, setIdRange] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [slide, setSlide] = useState(null);

    useEffect(() => {
        const getSlide = async () => {
            const slideId = await getSlidesId('users');
            setSlide('https://docs.google.com/presentation/d/e/' + slideId + '/embed?start=false&loop=false&delayms=60000');
            console.log('slideId: ' + slideId);
        }
        getSlide();
    }, []);

    const generate = async () => {
        try {
            setLoading(true);
            const getIds = (idRange) => {
                let ids = [];
                idRange.split(',').forEach((r) => {
                    if (r.includes('-')) {
                        const [start, end] = r.split('-');
                        for (let i = parseInt(start); i <= parseInt(end); i++) {
                            ids.push(i);
                        }
                    } else {
                        ids.push(parseInt(r));
                    }
                });

                return ids;
            }
            await generateIds('users', getIds(idRange));
            setLoading(false);
            document.getElementById('slides-iframe').src += '';
        } catch (error) {
            console.error('error message: ' + error.message);
            if (error.message === 'Error: Unauthorized') {
                setShowLoginModal(true);
            }
            setLoading(false);
        }
    }

    const print = async () => {
        try {
            setLoadingPdf(true);
            window.open(await getPdfUrl('users'), '_blank');
            setLoadingPdf(false);
        } catch (error) {
            console.error('error message' + error.message);
            if (error.message === 'Error: Unauthorized') {
                setShowLoginModal(true);
            }
            setLoadingPdf(false);
        }
    }

    

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="p-2 pt-5 gap-2 flex items-center w-full md:w-auto">
                    <h1 className="text-2xl flex-grow md:flex-grow-0">Volunteer IDs</h1>
                </div>
            </div>
            <div className="p-2 pt-5 gap-2 flex items-center justify-center w-full md:w-auto">
                <form className="flex items-center gap-2" onChange={(e) => setIdRange(e.target.value)}  onSubmit={(e) => {e.preventDefault()}}>
                    <div>ID Numbers:</div>
                    <input type="text" className="border rounded p-1 ml-2" placeholder="eg: 1, 3-5, 7" />
                    <button type="submit" onClick={(e) => generate()} className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1 px-4 ml-2 flex flex-row items-center">
                        Generate
                        {loading && (
                        <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        )}
                    </button>
                    <button type="submit" onClick={(e) => print()} className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1 px-4 ml-2 flex flex-row items-center">
                        Print
                        {loadingPdf && (
                        <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        )}
                    </button>
                </form>
            </div>
            <div className="p-2 pt-5 gap-2 flex items-center justify-center w-full md:w-auto">
                {slide &&
                    <iframe 
                        id="slides-iframe"
                        src={slide}
                        frameBorder="0" width="792" height="1157" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true">
                    </iframe>
                }
            </div>
            {showLoginModal && <ModalLogin isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};