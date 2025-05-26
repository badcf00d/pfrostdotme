import * as React from 'react';
import './App.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: 'hsl(227, 40%, 100%)',
    },
    secondary: {
      main: 'hsl(0, 40%, 50%)',
    },
    text: {
      primary: 'hsl(200, 40%, 95%)',
      secondary: 'hsl(200, 40%, 95%)',
    },
    background: {
      default: 'hsl(0, 30%, 15%)',
      paper: 'hsl(210, 20%, 10%)',
    },
    '& .MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button': {
      color: 'hsl(227, 40%, 100%)',
    },
  },
});


class Timestamp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      time: new Date(),
    };

    this.timer = null;
    this.cancelTimer = this.cancelTimer.bind(this);
  }

  timerTick_cb = () => {
    this.setState({
      date: new Date(),
      time: new Date(),
    });
    console.log(`Timer: Set time to ${this.state.time}`);
  }

  dateChange_cb(newDate) {
    console.log(`Set date to ${newDate}`);
    this.setState({
      date: newDate,
    });
  }

  timeChange_cb(newTime) {
    console.log(`Set time to ${newTime}`);
    this.setState({
      time: newTime,
    });
  }

  cancelTimer() {
    console.log("cancelled");
    clearInterval(this.timer);
  }

  render() {
    if (!this.timer)
      this.timer = setInterval(this.timerTick_cb, 1000);

    if ((this.state.date) && (this.state.time)) {
      const timestamp = new Date(Date.UTC(
        this.state.date.getUTCFullYear(),
        this.state.date.getUTCMonth(),
        this.state.date.getUTCDate(),
        this.state.time.getUTCHours(),
        this.state.time.getUTCMinutes(),
        this.state.time.getUTCSeconds(),
        this.state.time.getUTCMilliseconds()));

      const timestring = timestamp.getTime().toString().slice(0, -3);
      console.log('Selected date: ', timestamp);
      return (
        <div>
          <div className='selector-div'>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ThemeProvider theme={appTheme}>
              <BasicTimePicker
                time={this.state.time}
                cancel_timer={this.cancelTimer}
                on_change={this.timeChange_cb.bind(this)}>
              </BasicTimePicker>
                <BasicDatePicker
                  date={this.state.date}
                  cancel_timer={this.cancelTimer}
                  on_change={this.dateChange_cb.bind(this)}>
                </BasicDatePicker>
              </ThemeProvider>
            </LocalizationProvider>
          </div>
          <div className='timestamp-table'>
            <table>
              <thead>
                <tr>
                  <th>Syntax</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><RelativeTimeSyntax timestring={timestring} /></td>
                  <td><RelativeTimePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><ShortTimeSyntax timestring={timestring} /></td>
                  <td><ShortTimePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><LongTimeSyntax timestring={timestring} /></td>
                  <td><LongTimePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><ShortDateSyntax timestring={timestring} /></td>
                  <td><ShortDatePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><LongDateSyntax timestring={timestring} /></td>
                  <td><LongDatePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><ShortDateTimeSyntax timestring={timestring} /></td>
                  <td><ShortDateTimePreview timestamp={timestamp} /></td>
                </tr>
                <tr>
                  <td><LongDateTimeSyntax timestring={timestring} /></td>
                  <td><LongDateTimePreview timestamp={timestamp} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    else {
      if (!this.state.date)
        return (<div><p>Invalid date</p></div>);
      if (!this.state.time)
        return (<div><p>Invalid time</p></div>);
    }
  }
}

function BasicTimePicker(props) {
  return (
    <TimePicker
      label="Time"
      color="primary"
      ampm={false}
      inputFormat="HH:mm:ss"
      mask="__:__:__"
      value={props.time}
      onOpen={ () => {
        props.cancel_timer();
      }}
      onChange={ (newValue) => {
        props.cancel_timer();
        if (newValue._isValid)
          props.on_change(newValue._d);
      }}
      InputProps={{
        sx: {
          "& .MuiSvgIcon-root": { color: "#AAAAAA" },
        }
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}

function BasicDatePicker(props) {
  return (
    <DatePicker
      label="Date"
      inputFormat="DD/MM/YYYY"
      value={props.date}
      color="primary"
      onOpen={ () => {
        props.cancel_timer();
      }}
      onChange={ (newValue) => {
        props.cancel_timer();
        if (newValue._isValid)
          props.on_change(newValue._d);
      }}
      InputProps={{
        sx: {
          "& .MuiSvgIcon-root": { color: "#AAAAAA" },
        }
      }}
      renderInput={(params) => <TextField color="primary" {...params} />}
    />
  );
}

function commonTimeSyntax(str) {
  return (
    <div onClick={() => { navigator.clipboard.writeText(str) }} className="tooltip">
      <span className="tooltiptext">Click to copy</span>
      <code>{str} </code>
    </div>
  );
}

function commonTimePreview(preview) {
  return (
    <div className="discord">
      frosticles
      <div>
        {preview}
      </div>
    </div>
  );
}


function RelativeTimeSyntax(props) {
  const str = `<t:${props.timestring}:R>`
  return (commonTimeSyntax(str));
}


function RelativeTimePreview(props) {
  const formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', { numeric: 'auto' });
  var diff = (props.timestamp.getTime() - Date.now()) / 1000;
  var absDiff = Math.abs(diff);
  var units = "second";

  if (absDiff > 60) {
    if ((absDiff /= 60) < 60)
      units = "minute";
    else if ((absDiff /= 60) < 24)
      units = "hour";
    else if ((absDiff /= 24) < 30)
      units = "day";
    else if ((absDiff /= 31) < 12)
      units = "month";
    else if ((absDiff /= 12) > 0)
      units = "year";
  }
  diff = absDiff * Math.sign(diff);

  const preview = formatter.format(Math.round(diff), units);
  return (commonTimePreview(preview));
}



function ShortTimeSyntax(props) {
  const str = `<t:${props.timestring}:t>`
  return (commonTimeSyntax(str));
}
function ShortTimePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { timeStyle: 'short' });
  const preview = formatter.format(props.timestamp)
  return (commonTimePreview(preview));
}

function LongTimeSyntax(props) {
  const str = `<t:${props.timestring}:T>`
  return (commonTimeSyntax(str));
}
function LongTimePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { timeStyle: 'medium' });
  const preview = formatter.format(props.timestamp)
  return (commonTimePreview(preview));
}

function ShortDateSyntax(props) {
  const str = `<t:${props.timestring}:d>`
  return (commonTimeSyntax(str));
}
function ShortDatePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'short' });
  const preview = formatter.format(props.timestamp)
  return (commonTimePreview(preview));
}

function LongDateSyntax(props) {
  const str = `<t:${props.timestring}:D>`
  return (commonTimeSyntax(str));
}
function LongDatePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'long' });
  const preview = formatter.format(props.timestamp)
  return (commonTimePreview(preview));
}

function ShortDateTimeSyntax(props) {
  const str = `<t:${props.timestring}:f>`
  return (commonTimeSyntax(str));
}
function ShortDateTimePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'long', timeStyle: 'short' });
  const preview = formatter.format(props.timestamp)
  return (commonTimePreview(preview));
}

function LongDateTimeSyntax(props) {
  const str = `<t:${props.timestring}:F>`
  return (commonTimeSyntax(str));
}
function LongDateTimePreview(props) {
  const formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'full', timeStyle: 'short' });
  const preview = formatter.format(props.timestamp).replace(" at ", " ");
  return (commonTimePreview(preview));
}

function App() {
  return (
    <div>
      <header className="App-header">
        Discord Timestamp Generator
      </header>
      <main className="App-main">
        <Timestamp />
      </main>
    </div>
  );
}

export default App;
