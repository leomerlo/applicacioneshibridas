import { PropsWithChildren } from "react"

const FooterMenu = (props: PropsWithChildren) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4">
      <div className="flex justify-between items-center gap-4">
        { props.children }
      </div>
    </div>
  )
}

export default FooterMenu