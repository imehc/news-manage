import React from 'react'
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-particles-js';//引入粒子插件
import axios from 'axios'
import './index.css'
export default function Login(props) {
  const onFinish = (values) => {
    // console.log(values);
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      // console.log(res.data);
      if (res.data.length === 0) {
        message.error("用户名或者密码不匹配")
      } else {
        sessionStorage.setItem("token", JSON.stringify(res.data[0]))
        props.history.push('/')
        message.success("登录成功")
      }
    })
  }
  return (
    <div style={{ background: "rgb(135, 206, 235)", height: "100%", overflow: "hidden" }}>
      <Particles height={document.documentElement.clientHeight} params={
        {
          "background": {
            "color": {
              "value": "rgb(85,101,207)"
            },
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
          },
          "fullScreen": {
            "enable": true,
            "zIndex": 1
          },
          "interactivity": {
            "events": {
              "onClick": {
                "enable": true,
                "mode": "push"
              },
              "onHover": {
                "enable": true,
                "mode": "bubble",
                "parallax": {
                  "force": 60
                }
              }
            },
            "modes": {
              "bubble": {
                "distance": 400,
                "duration": 2,
                "opacity": 1,
                "size": 40
              },
              "grab": {
                "distance": 400
              }
            }
          },
          "particles": {
            "color": {
              "value": "#ffffff"
            },
            "links": {
              "color": {
                "value": "#fff"
              },
              "distance": 150,
              "opacity": 0.4
            },
            "move": {
              "attract": {
                "rotate": {
                  "x": 600,
                  "y": 1200
                }
              },
              "enable": true,
              "outModes": {
                "default": "bounce",
                "bottom": "bounce",
                "left": "bounce",
                "right": "bounce",
                "top": "bounce"
              },
              "speed": 6
            },
            "number": {
              "density": {
                "enable": true
              },
              "value": 170
            },
            "opacity": {
              "animation": {
                "speed": 1,
                "minimumValue": 0.1
              }
            },
            "shape": {
              "options": {
                "character": {
                  "fill": false,
                  "font": "Verdana",
                  "style": "",
                  "value": "*",
                  "weight": "400"
                },
                "char": {
                  "fill": false,
                  "font": "Verdana",
                  "style": "",
                  "value": "*",
                  "weight": "400"
                },
                "polygon": {
                  "nb_sides": 5
                },
                "star": {
                  "nb_sides": 5
                },
                "image": {
                  "height": 32,
                  "replace_color": true,
                  "src": "/logo192.png",
                  "width": 32
                },
                "images": {
                  "height": 32,
                  "replace_color": true,
                  "src": "/logo192.png",
                  "width": 32
                }
              },
              "type": "image"
            },
            "size": {
              "value": 16,
              "animation": {
                "speed": 40,
                "minimumValue": 0.1
              }
            },
            "stroke": {
              "color": {
                "value": "#000000",
                "animation": {
                  "h": {
                    "count": 0,
                    "enable": false,
                    "offset": 0,
                    "speed": 1,
                    "sync": true
                  },
                  "s": {
                    "count": 0,
                    "enable": false,
                    "offset": 0,
                    "speed": 1,
                    "sync": true
                  },
                  "l": {
                    "count": 0,
                    "enable": false,
                    "offset": 0,
                    "speed": 1,
                    "sync": true
                  }
                }
              }
            }
          }
        }
      } />
      <div className="formContainer">
        <div className="login_title">Earth News Publishing System</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
