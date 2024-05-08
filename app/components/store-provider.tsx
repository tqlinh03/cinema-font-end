"use client"
import { Provider } from "react-redux"
import { store } from "@/app/redux/store"
import { LayoutApp } from "./layout-app"

export const StoreProvider = ({
  children
}: {children: React.ReactNode}) => {

  return (
    <Provider store={store}>
      {/* <LayoutApp> */}
      {children}
      {/* </LayoutApp> */}
    </Provider>
  )
}