import React, { useState, useEffect } from "react";
import { Radio, Button, Typography, Row, Col, Skeleton } from "antd";
import ReactDOM from "react-dom";
import axios from "axios";
import crypto from "crypto";
import "./Widget.css";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";

const { Title, Text } = Typography;

const useFetch = (url) => {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    setState({ data: state.data, loading: true });
    console.log(url);
    axios.get(url).then((x) => {
      setState({ data: x.data, loading: false });
    });
  }, [url, setState]);

  return state;
};

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

const App = ({ api_id }) => {
  const baseUrl =
    "https://c95bs8qze0.execute-api.us-east-1.amazonaws.com/prod/labelers/";
  const labelerId = getIdFromStorage();
  const { data, loading } = useFetch(baseUrl + labelerId);
  const [value, setValue] = useState(1);
  const [parsedData, setParsedData] = useState();

  useEffect(() => {
    console.log(`API ID is: ${api_id}`);
    console.log("Labeler Id: ", labelerId);
  }, []);

  useEffect(() => {
    if (data) {
      const rawData = data[0];
      let parsedData = {};
      const classList = Object.keys(rawData.class).map((key) => {
        return key;
      });
      parsedData = {
        instructions: rawData.instructions,
        multiclass: rawData.multiclass,
        class: classList,
        data: rawData.data,
        type: rawData.type,
      };

      setParsedData(parsedData);
    }
  }, [data, loading]);

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
    ReactDOM.unmountComponentAtNode(document.getElementById(INJECT_DIV_TAG));
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

ReactDOM.render(
  React.createElement(App, {
    api_id: document.getElementById(INJECT_DIV_TAG).getAttribute(API_ID_NAME),
  }),
  document.getElementById(INJECT_DIV_TAG)
);
