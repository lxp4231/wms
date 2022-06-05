import {getPersons} from "@/services/person"
export default {
    namespace: 'getPersons',
    // 初始状态
    state: {
      persons: [],
      list:[]
    },
      //写一些副作用，发起请求获取数据
    effects: {
        // *featchPerson({payload},{call,put})
        *featchPerson(_: any,{call,put}: any) {
        const data = yield call(getPersons)
        yield put({
              type: 'setPerson',
              payload: 
               data
               ,  //传的数据就是action
              });
        }

    },
    // 更新状态
    reducers: {
        // setPerson(state, action)
        setPerson(state: any,action: { payload: any; }) {
            return {
                ...state,
                persons:action.payload
            }
     }
    }
}