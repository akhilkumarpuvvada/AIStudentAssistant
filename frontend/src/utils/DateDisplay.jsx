import React from 'react'

const DateDisplay = ({value}) => {
    console.log(value);
    
    if(!value) return <span>-</span>
    let date;
    try {
        date = new Date(value);
        if(isNaN(date.getTime())) throw new Error("Invalid");
    }
    catch {
        return <span>Invalid Date</span>
    }

  return (
    <span>
        {date.toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short"
        })}
    </span>
  )
}

export default DateDisplay