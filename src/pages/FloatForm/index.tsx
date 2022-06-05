import React,{useEffect,useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography,Button } from 'antd';
import { useIntl, FormattedMessage,connect} from 'umi';
import styles from './index.less';
// import { getPersons } from '@/services/person';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const FloatForm: React.FC = (props) => {
  const intl = useIntl();
  useEffect(() => {
    props.dispatch({
      type: 'getPersons/featchPerson',
      payload:null
    })
  }, [])  
// 发起请求获取数据
  //1. 一般方法
  // const personData =async () => {
  //   const data =await getPersons()
  //   console.log(data,'666');
  // }
  //2. 使用dva的方法，需要connect和model做一个连接，然后使用dipatch调用获取model中的数据
  const personData = async () => {
    // console.log(props.getPersons.persons, '101010');
  }
  // const getName = () => {
  // }
  const lists = props.getPersons.persons
  console.log(lists, 'lists');

  return (
    <PageContainer>
      <Button onClick={personData} type="primary" style={{ marginBottom: '10px' }}>获取person的数据</Button><br/>
      <div>
      {/* {
        lists.map((item: {id: number,name: string,age: number}) => {
       return  <><span key={item.id}>{item.name}</span></>
      })
      } */}
      </div>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="Advanced Form" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="Advanced layout" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};

export default connect(({getPersons})=>({getPersons}))(FloatForm) ; // 这个getPersons是models中的namespace所有状态
