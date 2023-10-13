import { listInterfaceInfoByPageUsingGET } from '@/services/jinapi-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { List, message } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  //使用useState和泛型来定义组件内的状态
  //加载状态
  const [loading, setLoading] = useState(false);
  //列表数据
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  //总数
  const [total, setTotal] = useState<number>(0);
  const pageNumber = 5;
  //定义异步加载数据的函数
  const loadData = async (current = 1, pageSize = pageNumber) => {
    //开始加载数据
    setLoading(true);
    try {
      //调用接口获取数据
      const res = await listInterfaceInfoByPageUsingGET({
        current,
        pageSize,
      });
      //将请求返回的数据设置到列表数据中
      setList(res?.data?.records ?? []);
      //将请求返回的总数设置到总数状态中
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败' + error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="在线接口开发平台">
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[
                <a key={item.id} href={apiLink}>
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
              <div>content</div>
            </List.Item>
          );
        }}
        //分页配置
        pagination={{
          //自定义显示总数
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: pageNumber,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
