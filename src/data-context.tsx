import {createContext} from 'react';

export type DataContextType = {
    data: any,
    setData: any,
    initData: any
}


export const DataContext = createContext<DataContextType>({ 
  data:{}, 
  setData: () => {},
  initData: () => {}
});