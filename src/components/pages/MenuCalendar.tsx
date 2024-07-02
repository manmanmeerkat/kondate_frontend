import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import axios from 'axios';
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
import { useFetchUserData } from '../../hooks/useFetchUserData';

const MenuCalendar = () => {
    const [events, setEvents] = useState([{ title: '', date: '' }]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<{ title: string, date: string }[]>([]);
    const { user } = useFetchUserData();


    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const renderEventContent = useCallback((eventInfo: EventContentArg) => {
        return (
            <div className='menu-title' id="menu">
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    }, []);

    const handleDatesSet = useCallback(async (datesetInfo: any) => {
        const startDate = datesetInfo.view.currentStart.toISOString().split('T')[0];
        const endDate = datesetInfo.view.currentEnd.toISOString().split('T')[0];

        try {
            const response = await axios.get('/api/get-ingredients-list', {
                withCredentials: true,
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
                //ユーザーのidを送信
                headers: {
                    Authorization: `Bearer ${user?.id}`,
                },

            });

            const fetchedEvents = response.data.menuData.map((item: any) => ({
                title: item.dish_name,
                date: item.date
            }));

            setEvents(fetchedEvents);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleDateClick = useCallback((clickInfo: DateClickArg) => {
        setSelectedDate(clickInfo.dateStr);
        const filteredEvents = events.filter(event => event.date === clickInfo.dateStr);
        setSelectedEvents(filteredEvents);
        onOpen();  // モーダルを開く
    }, [events, onOpen]);

    const getDayOfWeek = useMemo(() => {
        return (dateStr: string) => {
            const date = new Date(dateStr);
            const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
            return daysOfWeek[date.getDay()];
        };
    }, []);

    return (
        <div className="menu-calendar">
            <HStack justify="space-between" mt={4}>
                <Button onClick={() => window.history.back()} colorScheme="teal">
                    戻る
                </Button>
            </HStack>
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
