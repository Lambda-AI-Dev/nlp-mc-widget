import React, { useState, useEffect } from "react";
import style from "./style";
import { Radio, Button, Typography, Row, Col, Skeleton } from "antd";
import ReactDOM from "react-dom";
import axios from "axios";

const INJECT_DIV_TAG = "lambda-target";
const API_ID_NAME = "api_id";

const { Title, Text } = Typography;

const useFetch = url => {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    setState({ data: state.data, loading: true });
    axios.get(url).then(x => {
      setState({ data: x.data, loading: false });
    });
  }, [url, setState]);

  return state;
};

const App = ({ api_id }) => {
  const { data, loading } = useFetch("https://quotes.rest/qod?language=en");
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    console.log(`API ID is: ${api_id}`);
  }, []);

  useEffect(() => {
    const onMouseMove = e => {
      //console.log(e);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      console.log("unmount");
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const onChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    setVisible(false);
  };

  const radioStyle = {
    display: "block",
    height: "50px",
    width: "100%",
    lineHeight: "30px",
    background: "#3498db",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "10px"
  };

  return (
    <div>
      {visible && (
        <div style={style.background}>
          <div style={style.foreground}>
            <div>
              {loading ? (
                <Skeleton active style={{ verticalAlign: "middle" }} />
              ) : (
                <div>
                  <Row>
                    <Col>
                      <center>
                        <Title level={4}>
                          Select the Category for the Following Text
                        </Title>
                      </center>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col span={18}>
                      <div
                        style={{
                          background: "white",
                          borderRadius: "10px",
                          padding: "10px",
                          margin: "5px",
                          height: "215px"
                        }}
                      >
                        <Text style={{ fontSize: "medium" }}>
                          {data.contents.quotes[0].quote}
                        </Text>
                      </div>
                    </Col>
                    <Col span={6} style={{ paddingLeft: "10px" }}>
                      <Radio.Group onChange={onChange} value={value}>
                        <Radio style={radioStyle} value={1}>
                          <div
                            style={{
                              color: "white",
                              display: "inline",
                              fontSize: "medium"
                            }}
                          >
                            🤗 Happy
                          </div>
                        </Radio>
                        <Radio style={radioStyle} value={2}>
                          <div
                            style={{
                              color: "white",
                              display: "inline",
                              fontSize: "medium"
                            }}
                          >
                            🤗 Happy
                          </div>
                        </Radio>
                        <Radio style={radioStyle} value={3}>
                          <div
                            style={{
                              color: "white",
                              display: "inline",
                              fontSize: "medium"
                            }}
                          >
                            🤗 Happy
                          </div>
                        </Radio>
                        <Radio style={radioStyle} value={4}>
                          <div
                            style={{
                              color: "white",
                              display: "inline",
                              fontSize: "medium"
                            }}
                          >
                            🤗 Unsure
                          </div>
                        </Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <center style={{ padding: "5px" }}>
                        <Button
                          type="primary"
                          size="large"
                          style={{
                            marginTop: "15px",
                            width: "100px",
                            borderRadius: "10px"
                          }}
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
