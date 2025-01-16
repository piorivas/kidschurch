import React, { useState } from "react";
import Html5Scanner from "../Html5Scanner";
import Logs from "../Logs";
import ModalYesNo from "../Modal/ModalYesNo";
import { handleQrScan } from "../../utils/QrScannerHandler";
import { useNavigate } from "react-router-dom";
import { utils } from "../../utils/Utilities";
import useDatabase from "../../hooks/useDatabase";

export const QrScanner = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();
  const { request } = useDatabase(); // Call useDatabase hook here

  const validateQRCode = (qrCode) => {
    console.log("QR Code: ", qrCode);
    const qrData = qrCode.split('||');
    if (qrData.length !== 4) {
      if (qrCode.startsWith("https://nxtgen.short.gy/v1?register=")) {
        setQrCode(qrCode);
        setShowModal(true);
      }
      console.log("QR Invalid");
      return false;
    }
    console.log("QR Valid");
    return true;
  };

  const insertTempLog = (code, time) => {
    setLogs(
      (prevLogs) => [{
        scan: "Loading...",
        id: code,
        timestamp: time.toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false 
        }),
      }, ...prevLogs].slice(0, 100)
    );
  };

  const updateTempLog = (newLog) => {
    console.log("New Log: ", newLog);
    setLogs((prevLogs) => {
      prevLogs[0] = newLog;
      return [...prevLogs];
    });
  };

  const handleScanSuccess = async (qrText) => {
    const timestamp = new Date();
    if (validateQRCode(qrText)) {
      insertTempLog(qrText.split('||')[3], timestamp);
      try {
        updateTempLog(await handleQrScan(qrText, request, timestamp)); // Pass request to handleQrScan
      } catch (error) {
        console.error(error);
        updateTempLog({
          scan: "Error: " + error.message,
          id: qrText.split('||')[3],
          timestamp: timestamp.toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
          }),
        });
      }
    }
  };

  const handleModalYes = () => {
    navigate(qrCode);
    setShowModal(false);
  };

  const handleModalNo = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-5 min-h-screen bg-gray-100">
      <div className="flex justify-center ">
        <Html5Scanner onScanSuccess={handleScanSuccess} />
      </div>
      <Logs logs={logs} />
      {showModal && (
        <ModalYesNo
          message="Would you like to open kids registration page?"
          onYes={handleModalYes}
          onNo={handleModalNo}
        />
      )}
    </div>
  );
};