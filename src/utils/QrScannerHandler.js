import { utils } from "./Utilities";

export const handleQrScan = async (qrText, request, timestamp) => {
  const [msg, entity, action, code] = qrText.split('||');
  var newLog = [];
  console.log("QR Data: ", msg, entity, action, code);
  if (entity === 'kids') {
    newLog = await handleKidScan(action, code, timestamp, request);
  } else if (entity === 'users') {
    newLog = await handleVolunteerScan(action, code, timestamp, request);
  } else {
    throw new Error("Invalid entity");
  }
  console.log("handleOrScan New Log: ", newLog);

  return newLog;
};

const handleKidScan = async (action, code, timestamp, request) => {
  const checkIn = async (code) => {
    try {
      const data = JSON.parse(await request('kids', 'GET', {id: code}));
      if (!data.name) {
        throw new Error("Kids data not found");
      }
      const response = JSON.parse(await request('logs_kids', 'CREATE', {
        ...data,
        action: 'Check-in',
        date: timestamp.toLocaleDateString('en-US', utils.dateFormat),
        time: timestamp.toLocaleTimeString('en-US', utils.timeFormat),
        timestamp: timestamp.toLocaleString('en-US')
      }));
      console.log("Check-in Response: ", response);
      const logData = {
        scan: "Check-in successful",
        id: response.id,
        name: response.name,
        level: response.level,
        timestamp: response.time
      };
      console.log("Log Data: ", logData);

      return logData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  if (action === 'Check-in') {
    return await checkIn(code);
  } else {
    throw new Error("Invalid action: " + action);
  }

  return null;
};

const handleVolunteerScan = async (action, code, request, setLogs, qrCode) => {
  // Implement the logic for handling volunteer scan
  // ...existing code...
};