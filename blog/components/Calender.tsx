'use client'
import {Calendar} from "@nextui-org/react";
import {today, getLocalTimeZone} from "@internationalized/date";

export default function MyCalender() {
  return (
    <Calendar 
      className=""
      aria-label="Date (Read Only)" 
      value={today(getLocalTimeZone())} 
      isReadOnly 
    />
  );
}