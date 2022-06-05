import { request } from 'umi';

export const getPersons = async () => {
    return request('/api/persons')
}