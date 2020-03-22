import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import style from "./style";
import {
  Paper,
  Typography,
  Backdrop,
  Grid,
  Button,
  CircularProgress
} from "@material-ui/core";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";

const App = ({ api_id }) => {
  const [showHello, setShowHello] = useState(true);
  const [showWidget, setShowWidget] = useState(true);

  useEffect(() => {
    console.log(api_id);
  }, []);

  useEffect(() => {
    const onMouseMove = e => {
      console.log(e);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      console.log("unmount");
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      {showWidget && (
        <Backdrop open={true}>
          {showHello ? (
            <Paper style={style.wforeground} elevation={0}>
              <div style={{ margin: "60px" }}>
                <Typography variant="h3" style={{ color: "white" }}>
                  Hey, Help us with a quick question.
                </Typography>

                <Typography
                  variant="subtitle2"
                  style={{
                    color: "white",
                    marginTop: "20px",
                    marginBottom: "20px"
                  }}
                >
                  Please help us with a 5 second question and earn 100 points!
                  This widget is supported by: Google AI.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowHello(false);
                  }}
                >
                  Continue
                </Button>
              </div>
            </Paper>
          ) : (
            <Paper style={style.foreground} elevation={0}>
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ marginLeft: "20px", marginTop: "20px" }}
                >
                  Complete Task to Continue
                </Typography>

                <Paper
                  style={{ margin: "20px", padding: "20px" }}
                  elevation={1}
                >
                  <center>
                    <Typography>
                      Access quote of the day service. Use this to get the quote
                      of the day in various categories. This is a free API that
                      is available to public. You must credit They Said So if
                      you are using the free version
                    </Typography>
                  </center>
                </Paper>
                <Grid container spacing={3} style={{ padding: "0px 20px" }}>
                  <Grid item xs={6}>
                    <Paper style={{ padding: "10px" }}>
                      <Typography>Hello</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper style={{ padding: "10px" }}>
                      <Typography>Hello</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper style={{ padding: "10px" }}>
                      <Typography>Hello</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper style={{ padding: "10px" }}>
                      <Typography>Hello</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ display: "block", float: "right", margin: "20px" }}
                  onClick={() => {
                    setShowWidget(false);
                  }}
                >
                  Submit
                </Button>
              </div>
            </Paper>
          )}
        </Backdrop>
      )}
    </div>
  );
};

ReactDOM.render(
  React.createElement(App, {
    api_id: document.getElementById(INJECT_DIV_TAG).getAttribute(API_ID_NAME)
  }),
  document.getElementById(INJECT_DIV_TAG)
);
