import React, { useState, useEffect } from "react";
import { Grid, Loader, Form, Checkbox } from "semantic-ui-react";
import ReactDOM from "react-dom";
import axios from "axios";
import crypto from "crypto";
import cloneDeep from "lodash/cloneDeep";
import Lottie from "react-lottie";
import successAnimationData from "./success.json";
import "@lottiefiles/lottie-player";
import "./widget.css";
// WARNING: the checkbox css below is modified extensively
import "./checkbox.css";
import "semantic-ui-css/components/form.css";
import "semantic-ui-css/components/grid.css";
import "semantic-ui-css/components/segment.css";
import "semantic-ui-css/components/loader.css";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";
const BASE_URL =
  "https://c95bs8qze0.execute-api.us-east-1.amazonaws.com/developerBeta/";

const container = document.getElementById(INJECT_DIV_TAG);

const generateId = () => {
  const id = crypto.randomBytes(8).toString("hex");
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
  const normalSubmitStyle = {
    width: "140px",
    height: "45px",
    backgroundColor: "#3498db",
    color: "white",
    borderRadius: "10px",
    cursor: "default",
  };

  const hoverSubmitStyle = {
    width: "140px",
    height: "45px",
    backgroundColor: "#3498db",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const [value, setValue] = useState();
  const [parsedData, setParsedData] = useState();
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitBtStyle, setSubmitBtStyle] = useState(normalSubmitStyle);

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
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        closeModal();
      }, 1600);
    }
  }, [showSuccess]);

  const handleChange = (e, { value }) => {
    setValue(value);
  };

  const handleSubmit = () => {
    if (value) {
      let classObj = {};
      parsedData.class.forEach((c) => {
        classObj[c] = c === value;
      });
      let postObj = cloneDeep(parsedData);
      delete postObj.class;
      postObj.class = classObj;

      postResponse({
        results: [postObj],
      });
      setShowSuccess(true);
    } else {
      // display error
    }
    return;
  };

  const RadioList = ({ list }) => {
    const RadioList = list.map((v, index) => {
      return (
        <Form.Field
          key={index}
          style={{
            display: "block",
            padding: "5%",
            backgroundColor: "#1abc9c",
            width: "90.5%",
            margin: "5px 0px 0px 0px",
            lineHeight: "35px",
            borderRadius: "10px",
          }}
        >
          <Checkbox
            radio
            label={v}
            value={v}
            checked={v === value}
            onChange={handleChange}
          />
        </Form.Field>
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
              <Loader
                active
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                Loading
              </Loader>
            ) : (
              <div>
                {showSuccess ? (
                  <Lottie
                    options={{
                      loop: false,
                      autoplay: true,
                      animationData: successAnimationData,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    height={120}
                    width={120}
                    style={{
                      position: "absolute",
                      marginLeft: "-60px",
                      marginTop: "-60px",
                      top: "50%",
                      left: "50%",
                    }}
                  />
                ) : (
                  <Grid columns="equal">
                    <Grid.Row style={{ padding: "0px" }}>
                      <Grid.Column>
                        <center>
                          <h2>{parsedData && parsedData.instructions}</h2>
                        </center>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={12} style={{ paddingLeft: "0px" }}>
                        <div className="lambda-textbg">
                          {parsedData && parsedData.data}
                        </div>
                      </Grid.Column>
                      <Grid.Column style={{ padding: "0px" }}>
                        <Form>
                          {parsedData && <RadioList list={parsedData.class} />}
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <center>
                          <div
                            style={submitBtStyle}
                            onClick={() => {
                              handleSubmit();
                            }}
                            onMouseEnter={() => {
                              setSubmitBtStyle(hoverSubmitStyle);
                            }}
                            onMouseLeave={() => {
                              setSubmitBtStyle(normalSubmitStyle);
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: "50%",
                                top: "47%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              Done
                            </div>
                          </div>
                        </center>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
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
      .post(`${BASE_URL}/tasks`, data)
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
