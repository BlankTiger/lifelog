import { Button, Flex, FormControl, FormLabel, FormHelperText, FormErrorMessage, Spacer, Input, Select, Textarea } from "@chakra-ui/react";
import { useTodayStore, useCalendarEntriesStore, useShouldRefreshStore, CalendarEntry } from "./utils/GlobalState";
import "./App.css";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  id: number;
  summary: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  status: string;
  entry_type: string;
}

const AddEntry = () => {
  const today = useTodayStore(state => state.todayShowable);
  const addCalendarEntry = useCalendarEntriesStore(state => state.addCalendarEntry);
  const setShouldRefresh = useShouldRefreshStore(state => state.setShouldRefresh);

  const { register, handleSubmit } = useForm<FormValues>();
  const addEntry: SubmitHandler<FormValues> = entry => {
    entry.id = Date.now();
    entry.start = new Date(entry.start);
    entry.end = new Date(entry.end);
    addCalendarEntry(today, entry as CalendarEntry);
    setShouldRefresh();
  };

  return (
    <div className="container">
      <Flex direction="column" align="left" width="100vw" height="100vh" px={50} py={2} >
        <form onSubmit={handleSubmit(addEntry)}>
          <FormControl isRequired>
            <FormLabel>{"Summary"}</FormLabel>
            <Input {...register("summary")} isRequired type="text"></Input>
            <FormLabel mt={4}>{"Description"}</FormLabel>
            <Textarea {...register("description")} isRequired></Textarea>
            <FormLabel mt={4}>{"Start date"}</FormLabel>
            <Input
              {...register("start")}
              isRequired
              type="datetime-local"
            />
            <FormLabel mt={4}>{"End date"}</FormLabel>
            <Input
              {...register("end")}
              isRequired
              type="datetime-local"
            />
            <FormLabel mt={4}>{"Location"}</FormLabel>
            <Input {...register("location")} isRequired type="text"></Input>
            <FormLabel mt={4}>{"Status"}</FormLabel>
            <Select {...register("status")} isRequired>
              <option>{"Accepted"}</option>
              <option>{"Rejected"}</option>
            </Select>
            <FormLabel mt={4}>{"Entry type"}</FormLabel>
            <Select {...register("entry_type")} isRequired>
              <option>{"Work"}</option>
              <option>{"Personal"}</option>
              <option>{"University"}</option>
            </Select>
            <Spacer />
            <Flex direction="row" justify="center">
              <Button type="submit" my={6}>{"Add entry"}</Button>
            </Flex>
          </FormControl>
        </form>
      </Flex>
    </div >
  );
}

export default AddEntry;
