import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { Button, Grid, Loader } from "semantic-ui-react";
import ReactDOM from "react-dom";
import axios from "axios";
import crypto from "crypto";
import "./Widget.css";
import "semantic-ui-css/components/button.css";
import "semantic-ui-css/components/grid.css";
import "semantic-ui-css/components/segment.css";
import "semantic-ui-css/components/loader.css";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";
const BASE_URL =
  "https://c95bs8qze0.execute-api.us-east-1.amazonaws.com/developerBeta/";
const container = document.getElementById(INJECT_DIV_TAG);

const generateId = () => {
  const id = crypto.randomBytes(16).toString("hex");
  return id;
};

const getIdFromStorage = () => {
  const labelerId = JSON.parse(localStorage.getItem("labelerId"));
  if (!labelerId) {
    const id = generateId();
    localStorage.setItem("labelerId", JSON.stringify(id));
    return id;
  } else {
    return labelerId;
  }
};

const Widget = ({ api_id, closeModal, postResponse }) => {
  const [value, setValue] = useState(0);
  const [parsedData, setParsedData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(api_id);
  }, [setLoading]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/labelers/${getIdFromStorage()}/developers/${api_id}`)
      .then((raw) => {
        const data = raw.data;
        if (data) {
          const rawData = data[0];
          let parsedData = {};
          const classList = Object.keys(rawData.class).map((key) => {
            return key;
          });
          parsedData = {
            instructions: rawData.instructions,
            multiclass: rawData.multiclass,
            taskId: rawData.taskId,
            class: classList,
            data: rawData.data,
            type: rawData.type,
            labelerId: rawData.labelerId,
            jobId: rawData.jobId,
            labelingMethod: rawData.labelingMethod,
            stoppedByTimer: rawData.stoppedByTimer,
            beginTimestamp: rawData.beginTimestamp,
            endTimestamp: rawData.endTimestamp,
          };
          console.log(parsedData);
          setParsedData(parsedData);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        closeModal();
      });
  }, [setLoading]);

  useEffect(() => {
    const onMouseMove = (e) => {
      // console.log(e);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      console.log("unmount");
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    postResponse({
      results: [
        {
          instructions: "Choose the appropriate sentiment for this text.",
          multiclass: false,
          taskId: "1413413089602753",
          class: {
            Negative: false,
            Neutral: false,
            Positive: false,
          },
          data: "I am Daniel.",
          type: "text",
          labelerId: "5307751900195447",
          jobId: "8916346609042891",
          labelingMethod: "multipleChoice",
          stoppedByTimer: null,
          beginTimestamp: null,
          endTimestamp: null,
          developerId: "5445029971295084",
        },
      ],
    });
    closeModal();
  };

  const RadioList = ({ list }) => {
    const RadioList = list.map((value, index) => {
      return (
        <Radio className="lambda-radiostyle" value={index} key={index}>
          <div className="lambda-radiocell">{value}</div>
        </Radio>
      );
    });

    return RadioList;
  };

  return (
    <div>
      <div className="lambda-background">
        <div className="lambda-foreground">
          <div>
            {loading ? (
              <Loader active inline="centered" style={{ marginTop: "160px" }}>
                Loading
              </Loader>
            ) : (
              <div>
                <Grid columns="equal">
                  <Grid.Row style={{ padding: "0px" }}>
                    <Grid.Column>
                      <center>
                        <h2>{parsedData && parsedData.instructions}</h2>
                      </center>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <div className="lambda-textbg">
                        {parsedData && parsedData.data}
                      </div>
                    </Grid.Column>
                    <Grid.Column style={{ paddingLeft: "10px" }}>
                      <Radio.Group onChange={onChange} value={value}>
                        {parsedData && <RadioList list={parsedData.class} />}
                      </Radio.Group>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <center>
                        <Button
                          primary
                          className="lambda-submit"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          Submit
                        </Button>
                      </center>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

class WidgetContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      api_id: props.api_id,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  postResponse = (data) => {
    axios
      .post(
        "https://c95bs8qze0.execute-api.us-east-1.amazonaws.com/developerBeta/tasks",
        data
      )
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
        {this.state.open && (
          <Widget
            api_id={this.state.api_id}
            closeModal={this.closeModal}
            postResponse={this.postResponse}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <WidgetContainer
    api_id={document.getElementById(INJECT_DIV_TAG).getAttribute(API_ID_NAME)}
    ref={(lambdaWidget) => (window.lambdaWidget = lambdaWidget)}
  />,
  container
);
