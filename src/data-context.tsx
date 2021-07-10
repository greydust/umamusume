import {createContext} from 'react';

export type DataContextType = {
    data: any,
    initData: any
}


export const DataContext = createContext<DataContextType>({ 
  data:{}, 
  initData: () => {}
});