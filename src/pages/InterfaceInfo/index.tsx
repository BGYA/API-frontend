import {
getInterfaceInfoByIdUsingGET,
invokeInterfaceInfoUsingPOST
} from '@/services/jinapi-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Button,Card,Descriptions,DescriptionsProps,Divider,Form,message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React,{ useEffect,useState } from 'react';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  //使用useState和泛型来定义组件内的状态
  //加载状态
  const [loading, setLoading] = useState(false);
  //列表数据
  const [data, setData] = useState<API.InterfaceInfo>();
  //储存结果变量
  const [invokeRes, setInvokeRes] = useState<any>();
  //调用加载状态变量，默认为false
  const [invokeLoading, setInvokeLoading] = useState(false);

  //const match = useMatch('/interface_info/:id')
  const params = useParams();
  //alert(JSON.stringify(match));
  //总数
  const pageNumber = 5;
  //定义异步加载数据的函数
  const loadData = async (current = 1, pageSize = pageNumber) => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    //开始加载数据
    setLoading(true);
    try {
      //调用接口获取数据
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败' + error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '描述',
      span: 2,
      children: data?.description,
    },
    {
      key: '2',
      label: '请求地址',
      children: data?.url,
    },
    {
      key: '3',
      label: '请求方法',
      children: data?.method,
    },
    {
      key: '4',
      label: '创建时间',
      children: dayjs(data?.createTime).format('YYYY/MM/DD HH:mm:ss'),
    },
    {
      key: '5',
      label: '更新时间',
      children: dayjs(data?.updateTime).format('YYYY/MM/DD HH:mm:ss'),
      span: 2,
    },
    {
      key: '6',
      label: 'Status',
      children: data?.status ? '开启' : '关闭',
    },
    {
      key: '7',
      label: '请求头',
      children: data?.requestHeader,
    },
    {
      key: '8',
      label: '响应头',
      children: data?.responseHeader,
    },
    {
      key: '9',
      label: '请求参数',
      children: data?.requestParams,
    },
  ];

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败' + error.message);
    }

    setInvokeLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? <Descriptions title={data.name} bordered items={items} /> : <>接口不存在</>}
      </Card>
      <Divider />
      <Card title='在线测试'>
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title='返回结果' loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
