import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Switch, Table } from 'antd';
// import Products from '../components/Products';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [data, setData] = useState({})
    const navigate = useNavigate();
    console.log(data, "data")
    const [args, setArgs] = useState({
        "limit": 5,
        "page": 1
    })
    useEffect(() => {
        axios.post(`http://localhost:4000/api/product/fetchProducts`, args, {
            headers: {
                token: `Bearer UxjZsKNyGSZTLJUMJnMrSlRHakzvWp`,
                "Access-Allow-Control-Origin": "*"
            }
        })
            .then(res => {
                setData(res.data)
            })
            .catch(err => console.log(err))
    }, [args])
    // let url = `http://localhost:4000/api/product/fetchProducts`;

    // const config = {
    //     headers: {
    //         token: `Bearer UxjZsKNyGSZTLJUMJnMrSlRHakzvWp`,
    //         "Access-Allow-Control-Origin": "*"
    //     }
    // };

    const handleDelete = async (row) => {
        await axios.post(`http://localhost:4000/api/product/deleteProduct`, { productId: row.id }, {
            headers: {
                token: `Bearer UxjZsKNyGSZTLJUMJnMrSlRHakzvWp`,
                "Access-Allow-Control-Origin": "*"
            }
        })
            .then(res => {
                axios.post(`http://localhost:4000/api/product/fetchProducts`, args, {
                    headers: {
                        token: `Bearer UxjZsKNyGSZTLJUMJnMrSlRHakzvWp`,
                        "Access-Allow-Control-Origin": "*"
                    }
                }).then((res)=>{
                    setData(res.data)
                })
                // navigate("/");
            })
            .catch(err => console.log(err))
    }
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            sorter: (a, b) => a.productName.length - b.productName.length,
        },
        {
            title: 'Image',
            dataIndex: 'imageName',
            render: (cell, row) => <>
                <img src={row.imageUrl} />
            </>,
            sorter: (a, b) => a.productName.length - b.productName.length,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Qty',
            dataIndex: 'qty'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            render: (cell, row) => <Space size={10}>
                {/* <Switch onChange={() => onChange(row)} checked={row?.isActive === true ? true : false} /> */}
                <Button htmlType="submit" className='view-btn' onClick={() => navigate('/view', {
                    state: {
                        product: row
                    }
                })}> view</Button>
                <Button htmlType="submit" className='edit-btn' onClick={() =>
                    navigate('/edit', {
                        state: {
                            product: row
                        }

                    })}>Edit</Button>
                <Button htmlType="submit"
                    className='delete-btn'
                    onClick={() => handleDelete(row)}
                >
                    Delete</Button>
            </Space>
        },
    ];

    const onChange = (newState, _, sorter) => {
        const { current, pageSize } = newState;
        console.log(current, pageSize, "page aixe")
        setArgs({ ...args, page: current, limit: pageSize })
        // setArgs({ ...args, sort: sortField, dir: sortOrder })
    }

    const handleSearch=(search)=>{
        setArgs({ ...args, page: 0, search: search })
    }
    return (
        <div>
            <h2 className="heading">Welcome to proudct crud</h2>
            <h3> Search based on name of prodcut, pagination and sorting</h3>
            <Input onChange={(e) => handleSearch(e.target.value)} type='text' placeholder="Serach" />
            <section>
                <h3>Products</h3>
                <Table columns={columns} dataSource={data?.data}
                    onChange={onChange}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        total: data?.totalRecords,
                        pageSize: 5,
                    }}
                />
            </section>
        </div>
    );
};

export default Home;
