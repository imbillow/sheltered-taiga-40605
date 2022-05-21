import React from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import useSWR from "swr";

function useHackathons() {
  const hackathonsFetcher = (url) => fetch("https://nocors-anywhere.herokuapp.com/" + url)
    .then(x => x.text())
    .then(text => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, "text/html");
      const currnet = dom.querySelectorAll(".hackathon-list.current .card-body");
      const hackathonsCurrent = Array.from(currnet).map(x => {
        const times = x.querySelectorAll(":scope .title-and-dates time");
        return {
          title: x.querySelector(":scope .title-and-dates h4 a").textContent.trim(),
          start: Date.parse(times[0].dateTime),
          end: Date.parse(times[1].dateTime),
        }
      });
      console.log(hackathonsCurrent);
      return hackathonsCurrent;
    })
  const { data, error } = useSWR("gitcoin.co/hackathons", hackathonsFetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  }
}

function Calendar() {
  let { data, isLoading, isError } = useHackathons()
  if (isLoading) return <div>Loading</div>
  if (isError) return <div>Error</div>

  return (
    <FullCalendar
      plugins={[interactionPlugin, resourceTimelinePlugin ]}
      initialView='timeline'
      duration={{ month: 1 }}
      nowIndicator={true}
      expandRows={true}
      initialEvents={
        data
      }
    />
  );
}

export default Calendar;
