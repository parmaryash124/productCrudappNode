import { Button, Form, Input, Space, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const SubmitButton = ({ form }) => {
          const [submittable, setSubmittable] = React.useState(false);

          // Watch all values
          const values = Form.useWatch([], form);
          React.useEffect(() => {
                    form
                              .validateFields({
                                        validateOnly: true,
                              })
                              .then(
                                        () => {
                                                  setSubmittable(true);
                                        },
                                        () => {
                                                  setSubmittable(false);
                                        },
                              );
          }, [values]);
          return (
                    <Button type="primary" htmlType="submit" disabled={!submittable}>
                              Submit
                    </Button>
          );
};
const AddProduct = () => {
          const [fileList, setFileList] = useState([]);
          const navigate = useNavigate();
          console.log(fileList, "file list")
          const handlePreview = async (file) => {
                    // if (!file.url && !file.preview) {
                    // 	file.preview = await getBase64(file.originFileObj);
                    // }
                    // setPreviewImage(file.url || file.preview);
                    // setPreviewOpen(true);
                    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
          };
          const handleChange = ({ fileList: newFileList }) => {
                    setFileList(newFileList);
                    // setImageError(false);
          }

          const handleForm = async (values) => {
                    console.log(values, 'val')

                    var formdata = new FormData();
                    formdata.append("productName", values.productName);
                    formdata.append("price", values.price);
                    formdata.append("qty", values.qty);
                    if (fileList.length > 0) {
                              formdata.append("file", fileList[0].originFileObj);
                    }
                    // else {
                    // 	formdata.append("profile", "");
                    // }

                    await axios.post(`http://localhost:4000/api/product/addProduct`, formdata, {
                              headers: {
                                        token: `Bearer UxjZsKNyGSZTLJUMJnMrSlRHakzvWp`,
                                        "Access-Allow-Control-Origin": "*"
                              }
                    })
                              .then(res => {
                                        navigate("/");
                              })
                              .catch(err => console.log(err))

          }
          const uploadButton = (
                    <div>

                              <div
                                        style={{
                                                  marginTop: 8,
                                        }}
                              >
                                        Upload
                              </div>
                    </div>
          );
          const [form] = Form.useForm();
          return (
                    <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleForm}>
                              <Form.Item
                                        name="productName"
                                        label="productName"
                                        rules={[
                                                  {
                                                            required: true,
                                                  },
                                        ]}
                              >
                                        <Input />
                              </Form.Item>
                              <Form.Item
                                        name="price"
                                        label="price"
                                        rules={[
                                                  {
                                                            required: true,
                                                  },
                                        ]}
                              >
                                        <Input />
                              </Form.Item>
                              <Form.Item
                                        name="qty"
                                        label="qty"
                                        rules={[
                                                  {
                                                            required: true,
                                                  },
                                        ]}
                              >
                                        <Input />
                              </Form.Item>
                              <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        name='profile'
                                        maxCount={1}
                                        className='remove-icon'
                                        beforeUpload={() => {
                                                  return false;
                                        }}
                                        accept="image/png, image/jpeg, image/jpg"
                              >
                                        {fileList.length >= 1 ? null : uploadButton}
                              </Upload>
                              <Form.Item>
                                        <Space>
                                                  <SubmitButton form={form} />
                                                  <Button htmlType="reset">Reset</Button>
                                        </Space>
                              </Form.Item>

                    </Form>
          );
};
export default AddProduct;