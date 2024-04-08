import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, HStack, IconButton, useToast, List, ListItem } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";

const LOCAL_STORAGE_KEY = "reactEventAppUser";
const LOCAL_STORAGE_EVENTS_KEY = "reactEventAppEvents";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const toast = useToast();

  const handleLogin = () => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser === username) {
      setIsLoggedIn(true);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, username);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleEventSave = () => {
    if (editingEvent) {
      const updatedEvents = events.map((event) => {
        if (event.id === editingEvent.id) {
          return { ...event, name: eventName, description: eventDescription };
        }
        return event;
      });
      setEvents(updatedEvents);
      setEditingEvent(null);
    } else {
      const newEvent = {
        id: Date.now(),
        name: eventName,
        description: eventDescription,
      };
      setEvents([...events, newEvent]);
    }
    setEventName("");
    setEventDescription("");
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventDescription(event.description);
  };

  const handleEventDelete = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUser);
    }
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  if (!isLoggedIn) {
    return (
      <ChakraProvider>
        <VStack spacing={4} align="flex-start">
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin}>Login / Register</Button>
        </VStack>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box p={4}>
        <HStack justifyContent="space-between">
          <Heading>Event Manager</Heading>
          <IconButton aria-label="Logout" icon={<FaSignOutAlt />} onClick={handleLogout} />
        </HStack>
        <VStack spacing={4} align="flex-start" mt={4}>
          <FormControl>
            <FormLabel>Event Name</FormLabel>
            <Input value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Event Description</FormLabel>
            <Input value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
          </FormControl>
          <Button leftIcon={<FaPlus />} onClick={handleEventSave}>
            {editingEvent ? "Update Event" : "Add Event"}
          </Button>
        </VStack>
        <Heading size="md" mt={6}>
          Events
        </Heading>
        <List spacing={3}>
          {events.map((event) => (
            <ListItem key={event.id} p={2} borderWidth="1px" borderRadius="lg">
              <HStack justifyContent="space-between">
                <VStack align="flex-start">
                  <Text fontWeight="bold">{event.name}</Text>
                  <Text>{event.description}</Text>
                </VStack>
                <HStack>
                  <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEventEdit(event)} />
                  <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleEventDelete(event.id)} />
                </HStack>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
