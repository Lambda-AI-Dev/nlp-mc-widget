import React, { useState, useEffect } from "react";
import { Radio, Button, Typography, Row, Col, Skeleton } from "antd";
import ReactDOM from "react-dom";
import axios from "axios";
import crypto from "crypto";
import "./Widget.css";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";
const BASE_URL =
  "https://c95bs8qze0.execute-api.us-east-1.amazonaws.com/developerBeta/";
const container = document.getElementById(INJECT_DIV_TAG);

const { Title, Text } = Typography;

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
              <Skeleton active />
            ) : (
              <div>
                <Row>
                  <Col>
                    <center>
                      <Title level={4}>
                        {parsedData && parsedData.instructions}
                      </Title>
                    </center>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col span={18}>
                    <div className="lambda-textbg">
                      <Text style={{ fontSize: "medium" }}>
                        {parsedData && parsedData.data}
                      </Text>
                    </div>
                  </Col>
                  <Col span={6} style={{ paddingLeft: "10px" }}>
                    <Radio.Group onChange={onChange} value={value}>
                      {parsedData && <RadioList list={parsedData.class} />}
                    </Radio.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <center style={{ padding: "5px" }}>
                      <Button
                        type="primary"
                        size="large"
                        className="lambda-submit"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Submit
                      </Button>
                    </center>
                  </Col>
                </Row>
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
