import React from "react";
import DigitalClock from "../DigitalClock";
import StatisticsCard from "../StatisticsCard";
import BirthdayCard from "../BirthdayCard";
import FirstTimersCard from "../FirstTimersCard";

export const Dashboard = () => {
  return (
    <div className="flex flex-col bg-gray-50">
      <DigitalClock />
      <StatisticsCard />
      <div className="flex flex-col items-center md:items-start md:flex-row justify-center">
        <BirthdayCard />
        <FirstTimersCard />
      </div>
    </div>
  );
};