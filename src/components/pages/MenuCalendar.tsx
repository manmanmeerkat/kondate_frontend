import FullCalendar from '@fullcalendar/react'
import React, { useEffect, useState } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import "../../menuCalendar.css"
import { EventContentArg } from '@fullcalendar/core'
import axios from 'axios'

const MenuCalendar = () => {
    const [events, setEvents] = useState([{ title: '', date: '' }]);

    const renderEventContent = (eventInfo: EventContentArg) => {
        console.log(eventInfo)
        return (
            <div className='money' id="event-income">
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        )
    } 

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    
    const handleDatesSet = (datesetInfo: any) => {
        setStartDate(datesetInfo.view.currentStart)
        setEndDate(datesetInfo.view.currentEnd)

        //startDateをYYYY-MM-DDの形に変換
        const startDate = datesetInfo.view.currentStart.toISOString().split('T')[0];
        //endDateをYYYY-MM-DDの形に変換
        const endDate = datesetInfo.view.currentEnd.toISOString().split('T')[0];

        axios.get('/api/get-ingredients-list', {
            withCredentials: true,
            params: {
              start_date: startDate,
              end_date: endDate,
            },
          })
          .then(response => {
            const fetchedEvents = response.data.menuData.map((item: any) => ({
                title: item.dish_name,
                date: item.date
            }));
            setEvents(fetchedEvents);
          })
          .catch(error => {
            console.error(error);
          });
    }

    useEffect(() => { 
        handleDatesSet({ view: { currentStart: startDate, currentEnd: endDate } });
    }, []);

    return (
        <FullCalendar 
            locale={jaLocale}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
        />
    );
}

export default MenuCalendar;
