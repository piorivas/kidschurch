import moment from "moment";
import { utils } from "./Utilities";
import { toast } from "sonner";

var services = null;

export const handleQrScan = async (qrText, request, timestamp, srvs) => {
  services = srvs;
  const [msg, entity, action, code] = qrText.split('||');
  var newLog = [];
  if (entity === 'kids') {
    newLog = await handleKidScan(action, code, timestamp, request);
  } else if (entity === 'users') {
    newLog = await handleVolunteerScan(action, code, timestamp, request);
  } else {
    throw new Error("Invalid entity");
  }

  return newLog;
};

const handleKidScan = async (action, code, timestamp, request) => {
  const service = Object.values(services).find(service => {
    const startTime = moment(service.start_range, "hh:mm:ss A");
    const endTime = moment(service.end_range, "hh:mm:ss A");
    const currentTime = moment(timestamp, "hh:mm:ss A");
    return currentTime.isBetween(startTime, endTime);
  });
  const checkIn = async (code) => {
    try {
      if(!service){
        toast.error("No service available at this time");
        return null;
      }
      const data = JSON.parse(await request('kids', 'GET', {id: code}));
      if (!data.name) {
        toast.error("Kid's data not found");
        return null;
      }
      request('logs_kids', 'SEARCH', {
        id: code, 
        action: 'Check-in', 
        date: moment(timestamp).format('MMMM DD, YYYY'),
        service: service.label
      }).then((response)=>{
         const logs = JSON.parse(response);
         if (logs.length > 0) {
          toast.error(`${data.name} has already logged in for ${service.label}`);
          return;
         }
          request('logs_kids', 'CREATE', {
            ...data,
            action: 'Check-in',
            date: moment(timestamp).format('MMMM DD, YYYY'),
            time: moment(timestamp).format('hh:mm:ss A'),
            timestamp: timestamp.toLocaleString('en-US'),
            service: service.label
          }).then((response)=>{
            toast.success(`${data.name} has successfully checked in for ${service.label}`);
          }, (error) => {toast.error(error)});
      }, (error) => {toast.error(error)});

      const query = {
        "id": code,
        "name": data.name,
        "level": data.level,
        "timestamp": timestamp.toLocaleString('en-US')
      };

      const url = "https://api.rivaschristianacademy.com/nxtgen/checkin/json";
      const link = url + "?" + new URLSearchParams(query).toString();

      const logData = {
        header: "Check-in",
        id: data.id,
        name: data.name,
        level: data.level,
        timestamp: timestamp.toLocaleString('en-US'),
        anchorLink: {
          link: "my.bluetoothprint.scheme://" + link,
          label: "Print Receipt"
        }
      };

      return logData;
    } catch (error) {
      console.error(error);
      toast.error(error);
      return null
    }
  }

  const checkOut = async (code) => {
    try {
      if(!service){
        toast.error("No service available at this time");
        return null;
      }
      const data = JSON.parse(await request('logs_kids', 'SEARCH', {
        id: code,
        date: moment(timestamp).format('MMMM DD, YYYY'),
        service: service.label,
      }));
      if (data.length === 0) {
        toast.error("Check out expired or check in not found");
        return null;
      }
      request('logs_kids', 'UPDATEALL', {
        filters: {
          id: code,
          date: moment(timestamp).format('MMMM DD, YYYY'),
          service: service.label,
        },
        updates: {
          time_out: timestamp.toLocaleString('en-US')
        }
      }).then(
        (response)=>{toast.info(`Checkout successful for ${data[0].name}`)}, 
        (error) => {toast.error(error)}
      );

      const logData = {
        header: "Check-out",
        id: data[0].id,
        name: data[0].name,
        level: data[0].level,
        timestamp: timestamp.toLocaleString('en-US')
      };

      return logData;
    } catch (error) {
      toast.error(error);
      return null;
    }
  }

  if (action === 'Check-in') {
    return await checkIn(code);
  } else if (action === 'Check-out') {
    return await checkOut(code);
  } else {
    throw new Error("Invalid action: " + action);
  }

  return null;
};

const handleVolunteerScan = async (action, code, request, setLogs, qrCode) => {
  // Implement the logic for handling volunteer scan
  // ...existing code...
};