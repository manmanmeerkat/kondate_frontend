import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Box,
    Text,
    HStack,
    Icon,
    VStack
} from "@chakra-ui/react";
import { MdRestaurantMenu } from 'react-icons/md';
import "../../menuCalendar.css";
import { EventContentArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import axios from 'axios';

const MenuCalendar = () => {
    const [events, setEvents] = useState([{ title: '', date: '' }]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<{ title: string, date: string }[]>([]);

    const renderEventContent = (eventInfo: EventContentArg) => {
        return (
            <div className='money' id="event-income">
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };

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

    const handleDateClick = (clickInfo: DateClickArg) => {
        setSelectedDate(clickInfo.dateStr);
        const filteredEvents = events.filter(event => event.date === clickInfo.dateStr);
        setSelectedEvents(filteredEvents as any);
        onOpen();  // モーダルを開く
    };

    const getDayOfWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
        return daysOfWeek[date.getDay()];
    };

    return (
        <div className="menu-calendar">
            <FullCalendar 
                locale={jaLocale}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventContent={renderEventContent}
                datesSet={handleDatesSet}
                dateClick={handleDateClick}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <Text>{selectedDate} ({getDayOfWeek(selectedDate)})</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            {selectedEvents.length > 0 ? (
                                selectedEvents.map((event, index) => (
                                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg" w="100%">
                                        <HStack>
                                            <Icon as={MdRestaurantMenu} w={6} h={6} color="teal.500" />
                                            <Text fontWeight="bold" fontSize="lg">{event.title}</Text>
                                        </HStack>
                                    </Box>
                                ))
                            ) : (
                                <Text>献立がありません</Text>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" mr={3} onClick={onClose}>
                            閉じる
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default MenuCalendar;
