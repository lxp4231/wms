import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, Response, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import fixMenuItemIcon from './fixMenuItemIcon';
import { notification } from 'antd';
import logo from '../public/logo.png';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';


/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
// src/app.ts
const authHeaderInterceptor = async (url: string, options: RequestOptionsInit) => {
  // 从本地获取token 
  const Authorization='Bearer '+localStorage.getItem('access')
  const authHeader = { Authorization};
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
const errorHandler = (error) => {
  notification: error({
    description: '您的网络异常',
    message:'网络异常'
  })
}
// 请求拦截器
 export const request: RequestConfig = {
  errorHandler,
  // 新增自动添加AccessToken的请求前拦截器
   requestInterceptors: [authHeaderInterceptor],//请求拦截，一般添加token
  //  responseInterceptors: [demoResponseInterceptors], //响应拦截，一般添加验证token(status===403)是否过期，跳转到登陆页
 };

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  menuData?: any;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      console.log(msg,'666');
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    //再这里从后端获取动态路由， 后端返回的menu可以只有path和name
   const menuData: any=[
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './pages/user/Login/',
        },
        {
          component: './pages/404',
        },
      ],
     },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './pages/Welcome',
     },
     {
      path: '/FloatForm',
      name: 'FloatForm',
      icon: 'windows',
      component: './pages/FloatForm',
    },
    {
      path: '/admin',
      name: 'admin',
      icon: 'crown',
      // access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './pages/Welcome',
        },
        {
          component: './pages/404',
        },
      ],
    },
    {
      name: 'list.table-list',
      icon: 'table',
      path: '/list',
      component: './TableList',
    },
    {
      path: '/',
      redirect: './pages/Welcome',
    },
    {
      component: './pages/404',
    },
  ]
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      // 存到initialState
      menuData
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  // console.log(initialState,'initialState');
  return {
    // menu: {   // 路由服务端获取，必须用这个属性不然的话第一次登陆进去后页面是没有路由的，只有刷新后才有，下面的params和request也是必须的
    //   // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
    //   params: {
    //     userId: initialState?.currentUser?.userid,
    //   },
    //   request: () => initialState?.menuData,
    // },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 菜单栏布局
    menuDataRender: () =>{
     return fixMenuItemIcon(initialState?.menuData)
    },
    logo: logo,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
