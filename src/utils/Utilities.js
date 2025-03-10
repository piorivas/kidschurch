var utils = {
  dateFormat: { year: 'numeric', month: 'long', day: '2-digit' },
  timeFormat: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  dateTimeFormat: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' },
  getMobileOperatingSystem :  () => {
        var OsName = 'unknown';
        if (navigator.platform.indexOf("Win")!=-1) OsName = "Windows";
        if (navigator.platform.indexOf("Mac")!=-1) OsName = "MacOS";
        if (navigator.platform.indexOf("Linux")!=-1) OsName = "Android";
        if (navigator.platform.indexOf("iPhone")!=-1) OsName = "MacOS";

        return OsName;
    }
};

export { utils };