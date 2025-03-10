// import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Html5Scanner({ onScanSuccess}) {
    const beepSound = new Audio('https://www.soundjay.com/buttons/beep-07a.mp3');
    var qrCode = null;

    useEffect(() => {
        const interval = setInterval(() => {
            qrCode = null;
        }, 10000);

        const scanner = new Html5QrcodeScanner('reader',{
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 2
        });
    
        scanner.render((decodedText) => {
            beepSound.play();
            if(qrCode === decodedText) return;
            qrCode = decodedText;
            onScanSuccess(decodedText);
        });

        return () => {
            scanner.clear();
            clearInterval(interval);
        }
    },[]);

    return (
        
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div id="reader" className="w-full"/>
        </div>
        
    )
}
