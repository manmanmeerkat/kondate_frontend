// custom-typings.d.ts

declare module 'react-calendar' {
    interface CalendarProps {
      value?: Date | Date[] | null;
    }
  
    export default function Calendar(props: CalendarProps): JSX.Element;
  }
  