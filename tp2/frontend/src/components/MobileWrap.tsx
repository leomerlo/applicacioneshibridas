import { PropsWithChildren } from "react"

const MobileWrap = (props: PropsWithChildren) => {
  return (
    <div className="flex justify-center items-center bg-gray-90 h-screen">
      <div className="w-mobile h-mobile mx-auto bg-white">
        {props.children}
      </div>
    </div>
  )
}

export default MobileWrap